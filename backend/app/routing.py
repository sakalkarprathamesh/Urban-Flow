import json
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from .models import Route, RouteStop, Vehicle, MicroHub, DeliveryCluster, Package
from .pune_geo import (
    haversine_distance_km, 
    estimate_travel_time_min, 
    interpolate_points,
    PUNE_ROAD_NODES
)

def solve_tsp_nearest_neighbor(
    start_lat: float, 
    start_lng: float, 
    stops_data: List[Dict[str, Any]]
) -> List[Dict[str, Any]]:
    """
    Greedy Nearest Neighbor heuristic with local optimization for delivery stops.
    """
    unvisited = list(stops_data)
    ordered_stops = []
    current_lat = start_lat
    current_lng = start_lng

    while unvisited:
        best_idx = 0
        best_dist = float("inf")
        for idx, stop in enumerate(unvisited):
            dist = haversine_distance_km(current_lat, current_lng, stop["lat"], stop["lng"])
            # Slight priority boost for EXPRESS deliveries
            if stop.get("priority") == "EXPRESS":
                dist *= 0.75
            if dist < best_dist:
                best_dist = dist
                best_idx = idx

        next_stop = unvisited.pop(best_idx)
        ordered_stops.append(next_stop)
        current_lat = next_stop["lat"]
        current_lng = next_stop["lng"]

    return ordered_stops

def generate_route_for_cluster(
    cluster_id: int, 
    db: Session, 
    vehicle_id: Optional[int] = None
) -> Optional[Route]:
    """
    Creates an optimized delivery route for a given cluster and assigns an appropriate vehicle.
    """
    cluster = db.query(DeliveryCluster).filter(DeliveryCluster.id == cluster_id).first()
    if not cluster:
        return None

    hub = db.query(MicroHub).filter(MicroHub.id == cluster.hub_id).first()
    if not hub:
        return None

    # Find suitable vehicle if not specified
    if not vehicle_id:
        # Match vehicle with capacity >= cluster.total_weight_kg
        vehicles = db.query(Vehicle).filter(
            Vehicle.status == "available",
            Vehicle.max_capacity_kg >= cluster.total_weight_kg
        ).order_by(Vehicle.max_capacity_kg.asc()).all()

        if not vehicles:
            # Fallback to any vehicle
            vehicles = db.query(Vehicle).filter(Vehicle.status == "available").all()
        
        assigned_vehicle = vehicles[0] if vehicles else None
    else:
        assigned_vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()

    packages = db.query(Package).filter(Package.cluster_id == cluster.id).all()
    if not packages:
        return None

    # Group packages by destination proximity
    stop_points = []
    for pkg in packages:
        stop_points.append({
            "lat": pkg.dest_lat,
            "lng": pkg.dest_lng,
            "address": pkg.dest_address,
            "area": pkg.dest_area,
            "priority": pkg.priority,
            "package_id": pkg.id
        })

    # Order stops using TSP heuristic
    ordered_stops = solve_tsp_nearest_neighbor(hub.latitude, hub.longitude, stop_points)

    # Build polyline and calculate total metrics
    polyline: List[List[float]] = []
    total_distance_km = 0.0
    cur_lat = hub.latitude
    cur_lng = hub.longitude

    # From hub to first stop
    for stop in ordered_stops:
        seg_dist = haversine_distance_km(cur_lat, cur_lng, stop["lat"], stop["lng"])
        total_distance_km += seg_dist
        polyline.extend(interpolate_points((cur_lat, cur_lng), (stop["lat"], stop["lng"]), steps=3))
        cur_lat = stop["lat"]
        cur_lng = stop["lng"]

    # Return to hub
    return_dist = haversine_distance_km(cur_lat, cur_lng, hub.latitude, hub.longitude)
    total_distance_km += return_dist
    polyline.extend(interpolate_points((cur_lat, cur_lng), (hub.latitude, hub.longitude), steps=3))

    total_time_min = estimate_travel_time_min(total_distance_km, "Normal")

    route_count = db.query(Route).count()
    route_code = f"UF-R{route_count + 1:03d}"

    new_route = Route(
        code=route_code,
        vehicle_id=assigned_vehicle.id if assigned_vehicle else None,
        hub_id=hub.id,
        status="active",
        total_distance_km=round(total_distance_km, 2),
        estimated_time_min=round(total_time_min, 1),
        current_stop_index=0,
        polyline_json=json.dumps(polyline),
        is_rerouted=False,
        original_eta_min=round(total_time_min, 1),
        rerouted_eta_min=round(total_time_min, 1),
        empty_returns_avoided=0
    )
    db.add(new_route)
    db.flush()

    # Create RouteStop records
    # Sequence 0: Departure from Hub
    seq = 1
    accumulated_time = 4.0
    for stop_data in ordered_stops:
        stop_dist = haversine_distance_km(hub.latitude, hub.longitude, stop_data["lat"], stop_data["lng"])
        accumulated_time += estimate_travel_time_min(stop_dist) + 3.0 # 3 min delivery handling
        rs = RouteStop(
            route_id=new_route.id,
            stop_sequence=seq,
            stop_type="delivery",
            lat=stop_data["lat"],
            lng=stop_data["lng"],
            address=stop_data["address"],
            area=stop_data["area"],
            package_count=1,
            status="pending",
            eta_min=round(accumulated_time, 1)
        )
        db.add(rs)
        seq += 1

    # Final Stop: Return to Hub
    return_stop = RouteStop(
        route_id=new_route.id,
        stop_sequence=seq,
        stop_type="hub_return",
        lat=hub.latitude,
        lng=hub.longitude,
        address=f"{hub.name} (Return Depot)",
        area=hub.area,
        package_count=0,
        status="pending",
        eta_min=round(total_time_min, 1)
    )
    db.add(return_stop)

    # Update vehicle status and load
    if assigned_vehicle:
        assigned_vehicle.status = "in_transit"
        assigned_vehicle.current_load_kg = cluster.total_weight_kg
        assigned_vehicle.assigned_route_id = new_route.id

    # Update packages
    for pkg in packages:
        pkg.status = "IN_TRANSIT"
        pkg.assigned_route_id = new_route.id

    db.commit()
    return new_route
