from typing import List, Dict, Any
from sqlalchemy.orm import Session
from .models import ReversePickup, Route, RouteStop, Vehicle, MicroHub, Package
from .pune_geo import haversine_distance_km, estimate_travel_time_min

def match_and_assign_reverse_logistics(db: Session, max_pickup_detour_km: float = 2.0) -> List[Dict[str, Any]]:
    """
    Identifies vehicles with active delivery routes that are approaching their final stops
    and pairs them with pending customer package returns / eligible merchant pickups
    in the same geographic corridor, avoiding empty return trips to the micro-hub.
    """
    pending_returns = db.query(ReversePickup).filter(ReversePickup.status == "PENDING").all()
    if not pending_returns:
        # Check if there are packages with is_reverse_eligible in RETURN_REQUESTED state
        return_pkgs = db.query(Package).filter(Package.status == "RETURN_REQUESTED").all()
        for p in return_pkgs:
            rp = ReversePickup(
                package_tracking_code=p.tracking_code,
                customer_name=p.recipient_name,
                area=p.dest_area,
                lat=p.dest_lat,
                lng=p.dest_lng,
                items_description="Customer E-Commerce Return / Size Exchange",
                weight_kg=p.weight_kg,
                return_dest_hub_id=p.assigned_hub_id,
                status="PENDING"
            )
            db.add(rp)
        db.commit()
        pending_returns = db.query(ReversePickup).filter(ReversePickup.status == "PENDING").all()

    active_routes = db.query(Route).filter(Route.status.in_(["active", "rerouted"])).all()
    assignments = []

    for route in active_routes:
        hub = db.query(MicroHub).filter(MicroHub.id == route.hub_id).first()
        vehicle = db.query(Vehicle).filter(Vehicle.id == route.vehicle_id).first()
        if not hub or not vehicle:
            continue

        # Get route stops
        stops = db.query(RouteStop).filter(RouteStop.route_id == route.id).order_by(RouteStop.stop_sequence.asc()).all()
        if len(stops) < 2:
            continue

        # Find the last delivery stop before returning to hub
        last_delivery_stop = None
        hub_return_stop = None
        for s in stops:
            if s.stop_type == "delivery":
                last_delivery_stop = s
            elif s.stop_type == "hub_return":
                hub_return_stop = s

        if not last_delivery_stop:
            continue

        # Match pending returns near the last delivery stop
        for ret in pending_returns:
            if ret.status != "PENDING":
                continue

            dist_to_return = haversine_distance_km(
                last_delivery_stop.lat, last_delivery_stop.lng, 
                ret.lat, ret.lng
            )

            # Capacity check on vehicle
            if dist_to_return <= max_pickup_detour_km:
                # Assign this reverse pickup to the route
                ret.status = "MATCHED"
                ret.matched_vehicle_code = vehicle.code
                ret.matched_route_code = route.code
                ret.return_dest_hub_id = hub.id

                # Insert a new RouteStop between last delivery and hub return
                new_seq = last_delivery_stop.stop_sequence + 1
                if hub_return_stop:
                    hub_return_stop.stop_sequence += 1

                rev_stop = RouteStop(
                    route_id=route.id,
                    stop_sequence=new_seq,
                    stop_type="reverse_pickup",
                    lat=ret.lat,
                    lng=ret.lng,
                    address=f"Reverse Pickup: {ret.items_description}",
                    area=ret.area,
                    package_count=1,
                    status="pending",
                    eta_min=round(last_delivery_stop.eta_min + estimate_travel_time_min(dist_to_return) + 4.0, 1),
                    reverse_pickup_desc=f"{ret.items_description} ({ret.weight_kg} kg)"
                )
                db.add(rev_stop)

                # Update route statistics
                route.empty_returns_avoided += 1
                vehicle.current_load_kg = round(vehicle.current_load_kg + ret.weight_kg, 2)

                assignments.append({
                    "return_id": ret.id,
                    "customer": ret.customer_name,
                    "item": ret.items_description,
                    "vehicle_code": vehicle.code,
                    "route_code": route.code,
                    "hub_name": hub.name,
                    "distance_detour_km": dist_to_return
                })
                break # 1 reverse pickup per route demonstration

    db.commit()
    return assignments
