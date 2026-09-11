import math
from typing import List, Tuple, Dict

# Pune Key Logistics Hubs & Delivery Points
PUNE_LANDMARKS: Dict[str, Dict] = {
    "HUB_01": {
        "name": "Shivajinagar Central Depot",
        "area": "Shivajinagar",
        "lat": 18.5314,
        "lng": 73.8446,
        "role": "Central Rail & Arterial Exchange Hub",
        "capacity_kg": 1500
    },
    "HUB_02": {
        "name": "Kothrud Micro-Hub",
        "area": "Kothrud",
        "lat": 18.5074,
        "lng": 73.8077,
        "role": "West Residential & Commercial Hub",
        "capacity_kg": 1000
    },
    "HUB_03": {
        "name": "Viman Nagar Air-Cargo Terminal Hub",
        "area": "Viman Nagar",
        "lat": 18.5679,
        "lng": 73.9143,
        "role": "East Air-Logistics & Tech Corridor Hub",
        "capacity_kg": 1200
    },
    "HUB_04": {
        "name": "Hinjewadi Tech Hub",
        "area": "Hinjewadi",
        "lat": 18.5912,
        "lng": 73.7389,
        "role": "North-West IT & Corporate Logistics Hub",
        "capacity_kg": 1400
    },
    "HUB_05": {
        "name": "Hadapsar Urban Depot",
        "area": "Hadapsar",
        "lat": 18.5089,
        "lng": 73.9260,
        "role": "South-East Industrial & E-commerce Hub",
        "capacity_kg": 1100
    },
    "HUB_06": {
        "name": "Kalyani Nagar Micro-Hub",
        "area": "Kalyani Nagar",
        "lat": 18.5463,
        "lng": 73.9034,
        "role": "North-East Urban Consolidation Point",
        "capacity_kg": 900
    },
    "HUB_07": {
        "name": "Baner Eco-Logistics Station",
        "area": "Baner",
        "lat": 18.5590,
        "lng": 73.7868,
        "role": "High-density Urban West Micro-Hub",
        "capacity_kg": 950
    },
    "HUB_08": {
        "name": "Swargate Transit Logistics Hub",
        "area": "Swargate",
        "lat": 18.5018,
        "lng": 73.8586,
        "role": "South Transit & Commercial Core Hub",
        "capacity_kg": 1300
    }
}

# Key intersection/neighborhood graph nodes in Pune
PUNE_ROAD_NODES = {
    "Shivajinagar": (18.5314, 73.8446),
    "Deccan": (18.5167, 73.8417),
    "FC_Road": (18.5245, 73.8402),
    "Kothrud": (18.5074, 73.8077),
    "Karve_Nagar": (18.4912, 73.8205),
    "Swargate": (18.5018, 73.8586),
    "Camp": (18.5186, 73.8789),
    "Station": (18.5284, 73.8739),
    "Kalyani_Nagar": (18.5463, 73.9034),
    "Viman_Nagar": (18.5679, 73.9143),
    "Hadapsar": (18.5089, 73.9260),
    "Magarpatta": (18.5158, 73.9272),
    "Aundh": (18.5626, 73.8087),
    "Baner": (18.5590, 73.7868),
    "Wakad": (18.5987, 73.7686),
    "Hinjewadi": (18.5912, 73.7389)
}

# Pune Primary Road Network Edges (Bidirectional)
PUNE_ROAD_EDGES = [
    ("Shivajinagar", "FC_Road", 1.8),
    ("FC_Road", "Deccan", 1.5),
    ("Deccan", "Kothrud", 3.8),
    ("Kothrud", "Karve_Nagar", 2.4),
    ("Karve_Nagar", "Swargate", 4.1),
    ("Deccan", "Swargate", 3.2),
    ("Swargate", "Camp", 3.5),
    ("Camp", "Station", 2.2),
    ("Shivajinagar", "Station", 3.4),
    ("Station", "Kalyani_Nagar", 4.6),
    ("Kalyani_Nagar", "Viman_Nagar", 3.1),
    ("Camp", "Hadapsar", 5.8),
    ("Hadapsar", "Magarpatta", 2.0),
    ("Magarpatta", "Kalyani_Nagar", 4.2),
    ("Shivajinagar", "Aundh", 5.2),
    ("Aundh", "Baner", 3.0),
    ("Baner", "Wakad", 4.5),
    ("Wakad", "Hinjewadi", 3.8),
    ("Baner", "Hinjewadi", 6.2),
    ("Kothrud", "Baner", 6.8)
]

def haversine_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Computes great-circle distance between two points in km, adjusted for urban road tortuosity."""
    R = 6371.0
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = math.sin(delta_phi / 2.0) ** 2 + \
        math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2.0) ** 2
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    
    # Pune road winding factor (~1.28)
    return round(R * c * 1.28, 2)

def estimate_travel_time_min(distance_km: float, traffic_level: str = "Normal") -> float:
    """Estimates travel time in minutes based on Pune average urban speeds."""
    speeds = {
        "Low": 28.0,      # km/h
        "Normal": 20.0,   # km/h (typical Pune city transit)
        "Heavy": 13.0,    # km/h (peak hour)
        "Gridlock": 8.0   # km/h (monsoon / bottlenecks)
    }
    speed = speeds.get(traffic_level, 20.0)
    minutes = (distance_km / speed) * 60.0
    return max(round(minutes, 1), 3.0)

def interpolate_points(pt1: Tuple[float, float], pt2: Tuple[float, float], steps: int = 4) -> List[List[float]]:
    """Generates intermediate coordinates along a road segment for smooth map polyline animation."""
    coords = []
    lat1, lng1 = pt1
    lat2, lng2 = pt2
    for i in range(steps + 1):
        ratio = i / float(steps)
        # Add slight natural curvature offset for realism
        curve_offset = math.sin(ratio * math.pi) * 0.0015
        cur_lat = lat1 + (lat2 - lat1) * ratio + curve_offset
        cur_lng = lng1 + (lng2 - lng1) * ratio + (curve_offset * 0.5)
        coords.append([round(cur_lat, 6), round(cur_lng, 6)])
    return coords
