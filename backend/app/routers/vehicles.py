from typing import List, Optional
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Vehicle, MicroHub, Route
from ..schemas import VehicleResponse

router = APIRouter(prefix="/api/vehicles", tags=["Vehicles"])

@router.get("", response_model=List[VehicleResponse])
def list_vehicles(
    status: Optional[str] = None,
    vehicle_type: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Vehicle)
    if status:
        query = query.filter(Vehicle.status == status)
    if vehicle_type:
        query = query.filter(Vehicle.vehicle_type == vehicle_type)
    return query.all()

@router.get("/summary")
def get_fleet_summary(db: Session = Depends(get_db)):
    vehicles = db.query(Vehicle).all()
    total = len(vehicles)
    in_transit = len([v for v in vehicles if v.status == "in_transit"])
    loading = len([v for v in vehicles if v.status == "loading"])
    available = len([v for v in vehicles if v.status == "available"])

    by_type = {}
    for v in vehicles:
        by_type[v.vehicle_type] = by_type.get(v.vehicle_type, 0) + 1

    avg_util = round(
        sum((v.current_load_kg / max(v.max_capacity_kg, 1.0)) * 100 for v in vehicles) / max(total, 1), 
        1
    )

    return {
        "total_fleet": total,
        "in_transit": in_transit,
        "loading": loading,
        "available": available,
        "average_utilization_pct": avg_util,
        "fleet_distribution": by_type
    }
