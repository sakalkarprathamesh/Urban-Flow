from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
)
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(120), unique=True, index=True, nullable=False)
    role = Column(String(30), default="customer") # admin, business, driver, customer
    created_at = Column(DateTime, default=datetime.utcnow)

class Business(Base):
    __tablename__ = "businesses"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    category = Column(String(50)) # e-commerce, restaurant, pharmacy, retail, grocery
    default_pickup_lat = Column(Float, nullable=False)
    default_pickup_lng = Column(Float, nullable=False)
    contact = Column(String(50))
    packages = relationship("Package", back_populates="business")

class MicroHub(Base):
    __tablename__ = "micro_hubs"
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(30), unique=True, index=True) # e.g. HUB-01
    name = Column(String(120), nullable=False)
    area = Column(String(80), nullable=False) # e.g. Shivajinagar, Kothrud
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    max_capacity_kg = Column(Float, default=1000.0)
    current_load_kg = Column(Float, default=0.0)
    status = Column(String(30), default="active") # active, congested, maintenance
    operating_hours = Column(String(50), default="06:00 - 23:00")
    
    vehicles = relationship("Vehicle", back_populates="hub")
    clusters = relationship("DeliveryCluster", back_populates="hub")
    routes = relationship("Route", back_populates="hub")

class Vehicle(Base):
    __tablename__ = "vehicles"
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(30), unique=True, index=True) # e.g. UF-V021
    vehicle_type = Column(String(50), default="van") # van, mini_truck, motorcycle, ev_cargo
    max_capacity_kg = Column(Float, default=200.0)
    current_load_kg = Column(Float, default=0.0)
    status = Column(String(30), default="available") # available, in_transit, loading, maintenance
    current_lat = Column(Float, nullable=False)
    current_lng = Column(Float, nullable=False)
    battery_or_fuel_pct = Column(Float, default=95.0)
    assigned_hub_id = Column(Integer, ForeignKey("micro_hubs.id"), nullable=True)
    assigned_route_id = Column(Integer, nullable=True)
    
    hub = relationship("MicroHub", back_populates="vehicles")
    routes = relationship("Route", back_populates="vehicle")

class DeliveryCluster(Base):
    __tablename__ = "delivery_clusters"
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(30), unique=True, index=True) # e.g. UF-C014
    hub_id = Column(Integer, ForeignKey("micro_hubs.id"), nullable=True)
    total_weight_kg = Column(Float, default=0.0)
    package_count = Column(Integer, default=0)
    centroid_lat = Column(Float, nullable=False)
    centroid_lng = Column(Float, nullable=False)
    status = Column(String(30), default="consolidated") # forming, consolidated, dispatched
    created_at = Column(DateTime, default=datetime.utcnow)

    hub = relationship("MicroHub", back_populates="clusters")
    packages = relationship("Package", back_populates="cluster")

class Route(Base):
    __tablename__ = "routes"
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(30), unique=True, index=True) # e.g. UF-R019
    vehicle_id = Column(Integer, ForeignKey("vehicles.id"), nullable=True)
    hub_id = Column(Integer, ForeignKey("micro_hubs.id"), nullable=True)
    status = Column(String(30), default="planned") # planned, active, completed, rerouted
    total_distance_km = Column(Float, default=0.0)
    estimated_time_min = Column(Float, default=0.0)
    current_stop_index = Column(Integer, default=0)
    polyline_json = Column(Text, default="[]") # GeoJSON list of [lat, lng]
    is_rerouted = Column(Boolean, default=False)
    original_eta_min = Column(Float, default=0.0)
    rerouted_eta_min = Column(Float, default=0.0)
    empty_returns_avoided = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    vehicle = relationship("Vehicle", back_populates="routes")
    hub = relationship("MicroHub", back_populates="routes")
    stops = relationship("RouteStop", back_populates="route", cascade="all, delete-orphan")

class RouteStop(Base):
    __tablename__ = "route_stops"
    id = Column(Integer, primary_key=True, index=True)
    route_id = Column(Integer, ForeignKey("routes.id"), nullable=False)
    stop_sequence = Column(Integer, nullable=False)
    stop_type = Column(String(30), default="delivery") # pickup, delivery, reverse_pickup, hub_return
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    address = Column(String(200), default="")
    area = Column(String(80), default="")
    package_count = Column(Integer, default=1)
    status = Column(String(30), default="pending") # pending, arrived, completed, failed
    eta_min = Column(Float, default=0.0)
    reverse_pickup_desc = Column(String(200), default="")

    route = relationship("Route", back_populates="stops")

class Package(Base):
    __tablename__ = "packages"
    id = Column(Integer, primary_key=True, index=True)
    tracking_code = Column(String(40), unique=True, index=True) # UF-PKG-8821
    business_id = Column(Integer, ForeignKey("businesses.id"), nullable=True)
    sender_name = Column(String(120), default="Retail Partner")
    recipient_name = Column(String(120), default="Customer")
    pickup_lat = Column(Float, nullable=False)
    pickup_lng = Column(Float, nullable=False)
    dest_lat = Column(Float, nullable=False)
    dest_lng = Column(Float, nullable=False)
    dest_area = Column(String(80), default="Kothrud")
    dest_address = Column(String(200), default="Near Pune Hub")
    weight_kg = Column(Float, default=2.5)
    volume_m3 = Column(Float, default=0.01)
    priority = Column(String(20), default="STANDARD") # EXPRESS, STANDARD, ECONOMY
    deadline = Column(String(50), default="18:00")
    status = Column(String(40), default="CREATED")
    # CREATED -> ASSIGNED -> AT_MICRO_HUB -> CONSOLIDATED -> IN_TRANSIT -> DELIVERED -> RETURN_REQUESTED -> RETURNED
    assigned_hub_id = Column(Integer, ForeignKey("micro_hubs.id"), nullable=True)
    assigned_route_id = Column(Integer, ForeignKey("routes.id"), nullable=True)
    cluster_id = Column(Integer, ForeignKey("delivery_clusters.id"), nullable=True)
    is_reverse_eligible = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    business = relationship("Business", back_populates="packages")
    cluster = relationship("DeliveryCluster", back_populates="packages")

class TrafficEvent(Base):
    __tablename__ = "traffic_events"
    id = Column(Integer, primary_key=True, index=True)
    road_name = Column(String(120), nullable=False)
    area = Column(String(80), nullable=False)
    blocked_from_lat = Column(Float, nullable=False)
    blocked_from_lng = Column(Float, nullable=False)
    blocked_to_lat = Column(Float, nullable=False)
    blocked_to_lng = Column(Float, nullable=False)
    severity = Column(String(30), default="CRITICAL") # MODERATE, SEVERE, CRITICAL
    status = Column(String(30), default="ACTIVE") # ACTIVE, RESOLVED
    description = Column(String(255), default="Road closure due to metro pipeline work")
    created_at = Column(DateTime, default=datetime.utcnow)

class ReversePickup(Base):
    __tablename__ = "reverse_pickups"
    id = Column(Integer, primary_key=True, index=True)
    package_tracking_code = Column(String(40), default="")
    customer_name = Column(String(120), default="Customer Return")
    area = Column(String(80), default="Kothrud")
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    items_description = Column(String(255), default="E-commerce apparel return (size exchange)")
    weight_kg = Column(Float, default=1.8)
    return_dest_hub_id = Column(Integer, ForeignKey("micro_hubs.id"), nullable=True)
    matched_vehicle_code = Column(String(30), default="")
    matched_route_code = Column(String(30), default="")
    status = Column(String(30), default="MATCHED") # PENDING, MATCHED, COLLECTED, AT_HUB
    created_at = Column(DateTime, default=datetime.utcnow)

class SimulationRun(Base):
    __tablename__ = "simulation_runs"
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    package_count = Column(Integer, default=500)
    vehicle_count = Column(Integer, default=30)
    hub_count = Column(Integer, default=5)
    traffic_level = Column(String(30), default="Normal")
    conventional_results_json = Column(Text, default="{}")
    urban_flow_results_json = Column(Text, default="{}")

class NetworkProposal(Base):
    __tablename__ = "network_proposals"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    area = Column(String(80), nullable=False)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    estimated_capacity_kg = Column(Float, default=1200.0)
    distance_saved_pct = Column(Float, default=14.2)
    time_saved_pct = Column(Float, default=18.5)
    congestion_reduction_pct = Column(Float, default=21.0)
    created_at = Column(DateTime, default=datetime.utcnow)

class AiQuery(Base):
    __tablename__ = "ai_queries"
    id = Column(Integer, primary_key=True, index=True)
    query = Column(Text, nullable=False)
    response = Column(Text, nullable=False)
    provider = Column(String(50), default="Smart Logistics Analyst Engine")
    created_at = Column(DateTime, default=datetime.utcnow)
