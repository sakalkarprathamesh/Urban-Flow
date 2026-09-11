from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import MicroHub, Vehicle, Route, DeliveryCluster
from ..schemas import MicroHubResponse

router = APIRouter(prefix="/api/hubs", tags=["Micro-Hubs"])

@router.get("", response_model=List[MicroHubResponse])
def list_hubs(db: Session = Depends(get_db)):
    return db.query(MicroHub).all()

@router.get("/{hub_id}")
def get_hub_detail(hub_id: int, db: Session = Depends(get_db)):
    hub = db.query(MicroHub).filter(MicroHub.id == hub_id).first()
    if not hub:
        raise HTTPException(status_code=404, detail="Micro-Hub not found")

    assigned_vehicles = db.query(Vehicle).filter(Vehicle.assigned_hub_id == hub.id).all()
    active_routes = db.query(Route).filter(Route.hub_id == hub.id, Route.status.in_(["active", "rerouted"])).all()
    clusters = db.query(DeliveryCluster).filter(DeliveryCluster.hub_id == hub.id).all()

    utilization_pct = round((hub.current_load_kg / max(hub.max_capacity_kg, 1.0)) * 100, 1)

    return {
        "id": hub.id,
        "code": hub.code,
        "name": hub.name,
        "area": hub.area,
        "latitude": hub.latitude,
        "longitude": hub.longitude,
        "max_capacity_kg": hub.max_capacity_kg,
        "current_load_kg": hub.current_load_kg,
        "utilization_pct": utilization_pct,
        "status": hub.status,
        "operating_hours": hub.operating_hours,
        "vehicles_count": len(assigned_vehicles),
        "active_routes_count": len(active_routes),
        "clusters_count": len(clusters),
        "vehicles": [{
            "code": v.code,
            "type": v.vehicle_type,
            "status": v.status,
            "load_kg": v.current_load_kg,
            "capacity_kg": v.max_capacity_kg
        } for v in assigned_vehicles]
    }
