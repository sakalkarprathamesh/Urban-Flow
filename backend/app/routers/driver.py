from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Route, RouteStop, Vehicle, MicroHub
from ..schemas import DriverActionRequest

router = APIRouter(prefix="/api/driver", tags=["Driver Portal"])

@router.get("/current-route")
def get_driver_active_route(db: Session = Depends(get_db)):
    """Returns the primary active route with stops sequence for the driver portal."""
    route = db.query(Route).filter(Route.status.in_(["active", "rerouted"])).first()
    if not route:
        route = db.query(Route).first()

    if not route:
        raise HTTPException(status_code=404, detail="No active route available")

    vehicle = db.query(Vehicle).filter(Vehicle.id == route.vehicle_id).first()
    hub = db.query(MicroHub).filter(MicroHub.id == route.hub_id).first()
    stops = db.query(RouteStop).filter(RouteStop.route_id == route.id).order_by(RouteStop.stop_sequence.asc()).all()

    return {
        "route_code": route.code,
        "status": route.status,
        "vehicle": {
            "code": vehicle.code if vehicle else "UF-V001",
            "type": vehicle.vehicle_type if vehicle else "van",
            "load_kg": vehicle.current_load_kg if vehicle else 45.0,
            "capacity_kg": vehicle.max_capacity_kg if vehicle else 200.0,
            "battery_pct": vehicle.battery_or_fuel_pct if vehicle else 88.0
        },
        "hub": {
            "name": hub.name if hub else "Shivajinagar Central Depot",
            "area": hub.area if hub else "Shivajinagar"
        },
        "total_distance_km": route.total_distance_km,
        "eta_min": route.estimated_time_min,
        "is_rerouted": route.is_rerouted,
        "stops": [{
            "id": s.id,
            "sequence": s.stop_sequence,
            "type": s.stop_type,
            "address": s.address,
            "area": s.area,
            "package_count": s.package_count,
            "status": s.status,
            "eta_min": s.eta_min,
            "reverse_desc": s.reverse_pickup_desc
        } for s in stops]
    }

@router.post("/update-stop")
def update_stop_status(payload: DriverActionRequest, db: Session = Depends(get_db)):
    """Updates a stop status in real-time when the driver arrives or completes a delivery/pickup."""
    stop = db.query(RouteStop).filter(RouteStop.id == payload.stop_id).first()
    if not stop:
        raise HTTPException(status_code=404, detail="Route stop not found")

    action_map = {
        "arrived": "arrived",
        "delivered": "completed",
        "pickup_completed": "completed",
        "failed": "failed"
    }
    stop.status = action_map.get(payload.action.lower(), "completed")
    db.commit()

    return {
        "success": True,
        "stop_id": stop.id,
        "new_status": stop.status,
        "message": f"Stop {stop.stop_sequence} marked as {stop.status}"
    }
