from typing import List, Optional, Dict, Any
from pydantic import BaseModel, ConfigDict
from datetime import datetime

class PackageBase(BaseModel):
    sender_name: str = "Pune Retail Partner"
    recipient_name: str
    pickup_lat: float = 18.5314
    pickup_lng: float = 73.8446
    dest_lat: float
    dest_lng: float
    dest_area: str
    dest_address: str = ""
    weight_kg: float = 2.5
    volume_m3: float = 0.01
    priority: str = "STANDARD"
    deadline: str = "18:00"
    is_reverse_eligible: bool = False

class PackageCreate(PackageBase):
    pass

class PackageResponse(PackageBase):
    id: int
    tracking_code: str
    status: str
    assigned_hub_id: Optional[int] = None
    assigned_route_id: Optional[int] = None
    cluster_id: Optional[int] = None
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

class RouteStopResponse(BaseModel):
    id: int
    stop_sequence: int
    stop_type: str
    lat: float
    lng: float
    address: str
    area: str
    package_count: int
    status: str
    eta_min: float
    reverse_pickup_desc: Optional[str] = ""

    model_config = ConfigDict(from_attributes=True)

class RouteResponse(BaseModel):
    id: int
    code: str
    vehicle_id: Optional[int] = None
    hub_id: Optional[int] = None
    status: str
    total_distance_km: float
    estimated_time_min: float
    current_stop_index: int
    polyline_json: str
    is_rerouted: bool
    original_eta_min: float
    rerouted_eta_min: float
    empty_returns_avoided: int
    stops: List[RouteStopResponse] = []

    model_config = ConfigDict(from_attributes=True)

class MicroHubResponse(BaseModel):
    id: int
    code: str
    name: str
    area: str
    latitude: float
    longitude: float
    max_capacity_kg: float
    current_load_kg: float
    status: str
    operating_hours: str

    model_config = ConfigDict(from_attributes=True)

class VehicleResponse(BaseModel):
    id: int
    code: str
    vehicle_type: str
    max_capacity_kg: float
    current_load_kg: float
    status: str
    current_lat: float
    current_lng: float
    battery_or_fuel_pct: float
    assigned_hub_id: Optional[int] = None
    assigned_route_id: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)

class DeliveryClusterResponse(BaseModel):
    id: int
    code: str
    hub_id: Optional[int] = None
    total_weight_kg: float
    package_count: int
    centroid_lat: float
    centroid_lng: float
    status: str

    model_config = ConfigDict(from_attributes=True)

class SimulationRequest(BaseModel):
    package_count: int = 500
    vehicle_count: int = 30
    hub_count: int = 5
    traffic_level: str = "Normal"
    demand_multiplier: float = 1.0

class RoadClosureRequest(BaseModel):
    route_id: Optional[int] = None
    road_name: str = "Fergusson College Road"
    area: str = "FC Road / Deccan"

class NetworkProposalRequest(BaseModel):
    name: str
    area: str
    lat: float
    lng: float
    estimated_capacity_kg: float = 1200.0

class AiQueryRequest(BaseModel):
    query: str

class DriverActionRequest(BaseModel):
    stop_id: int
    action: str # arrived, delivered, pickup_completed, failed
