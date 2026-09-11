from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..schemas import SimulationRequest
from ..simulation import run_logistics_simulation

router = APIRouter(prefix="/api/simulation", tags=["Simulation"])

@router.post("/run")
def execute_simulation(params: SimulationRequest, db: Session = Depends(get_db)):
    """
    Executes the dual-model city logistics simulation:
    Compares Conventional direct point-to-point delivery vs Urban Flow consolidated micro-hub network.
    """
    results = run_logistics_simulation(
        package_count=params.package_count,
        vehicle_count=params.vehicle_count,
        hub_count=params.hub_count,
        traffic_level=params.traffic_level,
        demand_multiplier=params.demand_multiplier
    )
    return results
