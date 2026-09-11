import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database import init_db, SessionLocal
from app.models import MicroHub, Vehicle, Package, DeliveryCluster, Route

client = TestClient(app)

@pytest.fixture(scope="module", autouse=True)
def setup_database():
    init_db()

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["platform"] == "Urban Flow"

def test_dashboard_stats():
    response = client.get("/api/dashboard/stats")
    assert response.status_code == 200
    data = response.json()
    assert data["active_micro_hubs"] >= 8
    assert data["active_vehicles"] >= 30
    assert "simulated_trips_avoided" in data
    assert "simulated_distance_saved_km" in data

def test_map_data():
    response = client.get("/api/dashboard/map-data")
    assert response.status_code == 200
    data = response.json()
    assert len(data["hubs"]) >= 8
    assert len(data["vehicles"]) >= 30
    assert len(data["destinations"]) > 0

def test_clustering_trigger():
    response = client.post("/api/deliveries/optimize")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True

def test_road_closure_simulation():
    response = client.post("/api/routes/simulate-road-closure", json={
        "road_name": "Fergusson College Road",
        "area": "FC Road / Deccan"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "new_optimized_eta_min" in data
    assert data["new_optimized_eta_min"] >= data["original_eta_min"]

def test_reverse_logistics():
    response = client.get("/api/reverse-logistics")
    assert response.status_code == 200
    data = response.json()
    assert "empty_return_trips_avoided" in data

    # Test trigger match
    match_res = client.post("/api/reverse-logistics/match")
    assert match_res.status_code == 200

def test_simulation_engine():
    response = client.post("/api/simulation/run", json={
        "package_count": 500,
        "vehicle_count": 30,
        "hub_count": 5,
        "traffic_level": "Normal",
        "demand_multiplier": 1.0
    })
    assert response.status_code == 200
    data = response.json()
    assert "conventional" in data
    assert "urban_flow" in data
    assert "deltas" in data
    assert data["deltas"]["trips_avoided"] > 0
    assert data["deltas"]["distance_saved_km"] > 0

def test_ai_query():
    response = client.post("/api/ai/ask", json={
        "query": "Where should we build the next micro-hub and why?"
    })
    assert response.status_code == 200
    data = response.json()
    assert "response" in data
    assert len(data["response"]) > 20
