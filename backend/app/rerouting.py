import json
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session
from .models import Route, RouteStop, TrafficEvent, MicroHub, Vehicle
from .pune_geo import (
    haversine_distance_km, 
    estimate_travel_time_min, 
    interpolate_points
)

def simulate_road_closure_and_reroute(
    db: Session,
    route_id: Optional[int] = None,
    blocked_area: str = "FC Road / Deccan Corridor",
    road_name: str = "Fergusson College Road"
) -> Dict[str, Any]:
    """
    Simulates a dynamic road incident, marks the road segment as blocked,
    and recalculates the active route with an optimized detour.
    Returns the comparison (Original ETA vs New ETA, detour points, event details).
    """
    # Find active route to test rerouting on
    query = db.query(Route).filter(Route.status == "active")
    if route_id:
        query = query.filter(Route.id == route_id)
    route = query.first()

    if not route:
        # Fallback to the first route in database
        route = db.query(Route).first()

    if not route:
        return {"error": "No route available to reroute"}

    # Create TrafficEvent
    event = TrafficEvent(
        road_name=road_name,
        area=blocked_area,
        blocked_from_lat=18.5245,
        blocked_from_lng=73.8402,
        blocked_to_lat=18.5167,
        blocked_to_lng=73.8417,
        severity="CRITICAL",
        status="ACTIVE",
        description="Emergency pipeline repair & traffic barrier setup"
    )
    db.add(event)
    db.flush()

    # Calculate detour
    hub = db.query(MicroHub).filter(MicroHub.id == route.hub_id).first()
    stops = db.query(RouteStop).filter(RouteStop.route_id == route.id).order_by(RouteStop.stop_sequence.asc()).all()

    # Add detour waypoint (e.g. bypassing through Senapati Bapat Road or J.M. Road)
    detour_waypoint = [18.5300, 73.8320] # Law College / SB Road bypass
    new_polyline = []
    
    cur_lat = hub.latitude if hub else 18.5314
    cur_lng = hub.longitude if hub else 73.8446

    # Insert detour points into polyline
    for stop in stops:
        if stop.stop_type != "hub_return":
            # Direct path to detour waypoint first
            new_polyline.extend(interpolate_points((cur_lat, cur_lng), (detour_waypoint[0], detour_waypoint[1]), steps=3))
            new_polyline.extend(interpolate_points((detour_waypoint[0], detour_waypoint[1]), (stop.lat, stop.lng), steps=3))
            cur_lat = stop.lat
            cur_lng = stop.lng

    # Return to hub via northern bypass
    if hub:
        new_polyline.extend(interpolate_points((cur_lat, cur_lng), (hub.latitude, hub.longitude), steps=3))

    # Calculate detour delta (typically adds 2.5 - 3.8 km and 3 - 5 min delay)
    added_distance_km = 3.2
    added_time_min = 4.5

    original_eta = route.original_eta_min or route.estimated_time_min or 28.0
    new_distance = round(route.total_distance_km + added_distance_km, 2)
    new_eta = round(original_eta + added_time_min, 1)

    route.is_rerouted = True
    route.status = "rerouted"
    route.total_distance_km = new_distance
    route.estimated_time_min = new_eta
    route.rerouted_eta_min = new_eta
    route.polyline_json = json.dumps(new_polyline)

    db.commit()

    return {
        "success": True,
        "route_code": route.code,
        "blocked_road": road_name,
        "area": blocked_area,
        "original_eta_min": original_eta,
        "new_optimized_eta_min": new_eta,
        "eta_delay_min": round(new_eta - original_eta, 1),
        "additional_distance_km": added_distance_km,
        "traffic_event_id": event.id,
        "detour_summary": "Rerouted via Senapati Bapat Road arterial bypass to avoid FC Road congestion.",
        "polyline": new_polyline
    }

def clear_road_closure(db: Session) -> Dict[str, Any]:
    """Clears active simulated road closures and restores normal route statuses."""
    events = db.query(TrafficEvent).filter(TrafficEvent.status == "ACTIVE").all()
    for ev in events:
        ev.status = "RESOLVED"

    rerouted_routes = db.query(Route).filter(Route.is_rerouted == True).all()
    for r in rerouted_routes:
        r.is_rerouted = False
        r.status = "active"
        if r.original_eta_min:
            r.estimated_time_min = r.original_eta_min

    db.commit()
    return {"success": True, "message": "All traffic closures cleared and routes normalized."}
