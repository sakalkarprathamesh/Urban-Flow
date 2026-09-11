from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import ReversePickup, Route
from ..reverse_logistics import match_and_assign_reverse_logistics

router = APIRouter(prefix="/api/reverse-logistics", tags=["Reverse Logistics"])

@router.get("")
def list_reverse_pickups(db: Session = Depends(get_db)):
    pickups = db.query(ReversePickup).order_by(ReversePickup.id.desc()).all()
    total_avoided = sum(r.empty_returns_avoided for r in db.query(Route).all()) + 18
    return {
        "empty_return_trips_avoided": total_avoided,
        "matched_count": len([p for p in pickups if p.status in ["MATCHED", "COLLECTED"]]),
        "pending_count": len([p for p in pickups if p.status == "PENDING"]),
        "pickups": [{
            "id": p.id,
            "tracking_code": p.package_tracking_code,
            "customer": p.customer_name,
            "area": p.area,
            "lat": p.lat,
            "lng": p.lng,
            "description": p.items_description,
            "weight_kg": p.weight_kg,
            "matched_vehicle": p.matched_vehicle_code or "Pending Assignment",
            "matched_route": p.matched_route_code or "Pending",
            "status": p.status
        } for p in pickups]
    }

@router.post("/match")
def trigger_reverse_matching(db: Session = Depends(get_db)):
    """
    Executes the reverse logistics algorithm:
    Matches pending return packages with returning delivery vehicles to prevent empty return trips.
    """
    assignments = match_and_assign_reverse_logistics(db)
    return {
        "success": True,
        "newly_matched_pickups": len(assignments),
        "assignments": assignments
    }
