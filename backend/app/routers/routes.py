from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Route, RouteStop, TrafficEvent, Vehicle, MicroHub
from ..schemas import RouteResponse, RoadClosureRequest
from ..rerouting import simulate_road_closure_and_reroute, clear_road_closure
from ..routing import generate_route_for_cluster

router = APIRouter(prefix="/api/routes", tags=["Routes"])

@router.get("", response_model=List[RouteResponse])
def list_routes(status: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Route)
    if status:
        query = query.filter(Route.status == status)
    return query.order_by(Route.id.desc()).all()

@router.get("/{route_id}", response_model=RouteResponse)
def get_route(route_id: int, db: Session = Depends(get_db)):
    route = db.query(Route).filter(Route.id == route_id).first()
    if not route:
        raise HTTPException(status_code=404, detail="Route not found")
    return route

@router.post("/simulate-road-closure")
def trigger_road_closure(payload: RoadClosureRequest, db: Session = Depends(get_db)):
    """
    Simulates a dynamic road incident on Fergusson College Road (FC Road) / Deccan corridor.
    Reroutes the active route, shows original ETA vs new optimized ETA, and updates map polyline.
    """
    result = simulate_road_closure_and_reroute(
        db=db,
        route_id=payload.route_id,
        blocked_area=payload.area,
        road_name=payload.road_name
    )
    return result

@router.post("/clear-road-closure")
def trigger_clear_closure(db: Session = Depends(get_db)):
    """Clears simulated road closures and normalizes route states."""
    return clear_road_closure(db)

@router.post("/dispatch-cluster/{cluster_id}")
def dispatch_cluster(cluster_id: int, db: Session = Depends(get_db)):
    """Generates an optimized route for a consolidated cluster."""
    new_route = generate_route_for_cluster(cluster_id=cluster_id, db=db)
    if not new_route:
        raise HTTPException(status_code=400, detail="Unable to create route for this cluster")
    return {
        "success": True,
        "route_code": new_route.code,
        "stops_count": len(new_route.stops),
        "total_distance_km": new_route.total_distance_km,
        "eta_min": new_route.estimated_time_min
    }
