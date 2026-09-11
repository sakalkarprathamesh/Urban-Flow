import random
import json
from sqlalchemy.orm import Session
from .models import (
    MicroHub, Vehicle, Business, Package, DeliveryCluster, 
    Route, RouteStop, ReversePickup, TrafficEvent
)
from .pune_geo import PUNE_LANDMARKS, interpolate_points

def seed_database(db: Session):
    # Check if already seeded
    if db.query(MicroHub).count() > 0:
        return

    # 1. Seed Micro-Hubs
    hubs_map = {}
    for code, data in PUNE_LANDMARKS.items():
        hub = MicroHub(
            code=code,
            name=data["name"],
            area=data["area"],
            latitude=data["lat"],
            longitude=data["lng"],
            max_capacity_kg=data["capacity_kg"],
            current_load_kg=round(data["capacity_kg"] * random.uniform(0.35, 0.72), 1),
            status="active",
            operating_hours="06:00 - 23:00"
        )
        db.add(hub)
        db.flush()
        hubs_map[code] = hub

    # 2. Seed Businesses
    businesses_data = [
        {"name": "Pune Daily Fresh Market", "category": "grocery", "lat": 18.5020, "lng": 73.8580, "contact": "+91 98230 11223"},
        {"name": "Symbiosis Tech & Electronics", "category": "e-commerce", "lat": 18.5670, "lng": 73.9130, "contact": "+91 98230 22334"},
        {"name": "Deccan MedLife Pharmaceuticals", "category": "pharmacy", "lat": 18.5200, "lng": 73.8430, "contact": "+91 98230 33445"},
        {"name": "Kothrud Fashion & Lifestyle", "category": "retail", "lat": 18.5050, "lng": 73.8050, "contact": "+91 98230 44556"},
        {"name": "Hinjewadi Cloud Kitchens", "category": "restaurant", "lat": 18.5900, "lng": 73.7370, "contact": "+91 98230 55667"}
    ]
    businesses = []
    for b in businesses_data:
        biz = Business(
            name=b["name"],
            category=b["category"],
            default_pickup_lat=b["lat"],
            default_pickup_lng=b["lng"],
            contact=b["contact"]
        )
        db.add(biz)
        db.flush()
        businesses.append(biz)

    # 3. Seed Vehicles (30 realistic delivery vehicles)
    vehicle_types = [
        ("van", 600.0),
        ("ev_cargo", 450.0),
        ("mini_truck", 850.0),
        ("motorcycle", 40.0)
    ]
    hub_keys = list(hubs_map.keys())
    vehicles = []

    for i in range(1, 31):
        v_type, cap = random.choice(vehicle_types)
        assigned_hub = hubs_map[hub_keys[(i - 1) % len(hub_keys)]]
        
        # Slight jitter around assigned hub
        jitter_lat = assigned_hub.latitude + random.uniform(-0.008, 0.008)
        jitter_lng = assigned_hub.longitude + random.uniform(-0.008, 0.008)

        status = "in_transit" if i <= 14 else ("loading" if i <= 20 else "available")
        current_load = round(cap * random.uniform(0.55, 0.88), 1) if status == "in_transit" else 0.0

        veh = Vehicle(
            code=f"UF-V{i:03d}",
            vehicle_type=v_type,
            max_capacity_kg=cap,
            current_load_kg=current_load,
            status=status,
            current_lat=round(jitter_lat, 6),
            current_lng=round(jitter_lng, 6),
            battery_or_fuel_pct=round(random.uniform(70.0, 100.0), 1),
            assigned_hub_id=assigned_hub.id
        )
        db.add(veh)
        vehicles.append(veh)

    db.flush()

    # 4. Seed Delivery Clusters
    sample_clusters = [
        {"code": "UF-C001", "hub_code": "HUB_01", "weight": 64.5, "count": 14, "lat": 18.5250, "lng": 73.8420}, # FC Rd / Deccan
        {"code": "UF-C002", "hub_code": "HUB_02", "weight": 82.0, "count": 18, "lat": 18.5080, "lng": 73.8110}, # Kothrud
        {"code": "UF-C003", "hub_code": "HUB_03", "weight": 76.5, "count": 16, "lat": 18.5650, "lng": 73.9100}, # Viman Nagar
        {"code": "UF-C004", "hub_code": "HUB_04", "weight": 110.0, "count": 22, "lat": 18.5880, "lng": 73.7420}, # Hinjewadi Phase 1
        {"code": "UF-C005", "hub_code": "HUB_07", "weight": 52.0, "count": 11, "lat": 18.5560, "lng": 73.7890}  # Baner
    ]
    created_clusters = {}
    for c in sample_clusters:
        hub = hubs_map[c["hub_code"]]
        cl = DeliveryCluster(
            code=c["code"],
            hub_id=hub.id,
            total_weight_kg=c["weight"],
            package_count=c["count"],
            centroid_lat=c["lat"],
            centroid_lng=c["lng"],
            status="consolidated"
        )
        db.add(cl)
        db.flush()
        created_clusters[c["code"]] = cl

    # 5. Seed Packages (120+ realistic packages across Pune neighborhoods)
    neighborhood_coords = {
        "Shivajinagar": (18.5314, 73.8446),
        "FC Road / Deccan": (18.5245, 73.8402),
        "Kothrud": (18.5074, 73.8077),
        "Karve Nagar": (18.4912, 73.8205),
        "Viman Nagar": (18.5679, 73.9143),
        "Kalyani Nagar": (18.5463, 73.9034),
        "Hinjewadi": (18.5912, 73.7389),
        "Baner": (18.5590, 73.7868),
        "Aundh": (18.5626, 73.8087),
        "Swargate": (18.5018, 73.8586),
        "Hadapsar": (18.5089, 73.9260),
        "Magarpatta": (18.5158, 73.9272)
    }

    pkg_priorities = ["STANDARD", "EXPRESS", "ECONOMY"]
    package_names = [
        "Noise Cancelling Headphones", "Fresh Organic Produce Box", "Prescription Antibiotics & Vitamins",
        "Designer Casual Shirt", "Smartphone Screen Replacement", "Artisan Sourdough Bakery Pack",
        "Business Legal Documents", "Coffee Beans 1kg Pack", "Smartwatch & Charging Dock",
        "Baby Diaper Monthly Bundle", "Ergonomic Desk Accessories", "Blood Glucose Monitoring Kit"
    ]

    all_packages = []
    pkg_id_counter = 8000

    areas = list(neighborhood_coords.keys())
    for i in range(120):
        pkg_id_counter += 1
        area_name = areas[i % len(areas)]
        base_lat, base_lng = neighborhood_coords[area_name]
        
        # Jitter around neighborhood
        dest_lat = round(base_lat + random.uniform(-0.009, 0.009), 6)
        dest_lng = round(base_lng + random.uniform(-0.009, 0.009), 6)

        biz = businesses[i % len(businesses)]
        weight = round(random.uniform(0.5, 12.0), 1)
        prio = random.choice(pkg_priorities)

        # Distribute statuses across lifecycle
        if i < 45:
            st = "CONSOLIDATED"
        elif i < 75:
            st = "IN_TRANSIT"
        elif i < 95:
            st = "DELIVERED"
        elif i < 105:
            st = "CREATED"
        elif i < 112:
            st = "ASSIGNED"
        else:
            st = "RETURN_REQUESTED"

        # Assign cluster if consolidated
        assigned_cl = None
        if "FC Road" in area_name or "Shivajinagar" in area_name:
            assigned_cl = created_clusters["UF-C001"]
        elif "Kothrud" in area_name or "Karve" in area_name:
            assigned_cl = created_clusters["UF-C002"]
        elif "Viman" in area_name or "Kalyani" in area_name:
            assigned_cl = created_clusters["UF-C003"]
        elif "Hinjewadi" in area_name:
            assigned_cl = created_clusters["UF-C004"]
        elif "Baner" in area_name or "Aundh" in area_name:
            assigned_cl = created_clusters["UF-C005"]

        pkg = Package(
            tracking_code=f"UF-PKG-{pkg_id_counter}",
            business_id=biz.id,
            sender_name=biz.name,
            recipient_name=f"Resident {chr(65 + (i % 26))}. {101 + i}",
            pickup_lat=biz.default_pickup_lat,
            pickup_lng=biz.default_pickup_lng,
            dest_lat=dest_lat,
            dest_lng=dest_lng,
            dest_area=area_name,
            dest_address=f"Plot {12 + (i * 3)}, Near {area_name} Market, Pune",
            weight_kg=weight,
            volume_m3=round(weight * 0.003, 3),
            priority=prio,
            deadline="17:30" if prio == "EXPRESS" else "20:00",
            status=st,
            assigned_hub_id=assigned_cl.hub_id if assigned_cl else hubs_map["HUB_01"].id,
            cluster_id=assigned_cl.id if assigned_cl and st in ["CONSOLIDATED", "IN_TRANSIT", "DELIVERED"] else None,
            is_reverse_eligible=(st == "RETURN_REQUESTED" or random.random() < 0.25)
        )
        db.add(pkg)
        all_packages.append(pkg)

    db.flush()

    # 6. Seed Active Demo Route (UF-R001 - ready for Road Closure & Reverse Logistics Demo)
    demo_hub = hubs_map["HUB_01"] # Shivajinagar
    demo_veh = vehicles[0]        # UF-V001
    
    # Path: Shivajinagar Hub -> FC Road Stop 1 -> Deccan Stop 2 -> Kothrud Stop 3 -> Return to Hub
    stops_info = [
        {"area": "FC Road", "lat": 18.5245, "lng": 73.8402, "address": "FC Road Shopping Complex, Deccan Gymkhana"},
        {"area": "Deccan", "lat": 18.5167, "lng": 73.8417, "address": "Bhandarkar Road Corner, Deccan"},
        {"area": "Kothrud", "lat": 18.5074, "lng": 73.8077, "address": "Paud Road Tech Park, Kothrud"}
    ]

    route_polyline = []
    cur_p = (demo_hub.latitude, demo_hub.longitude)
    for s in stops_info:
        nxt = (s["lat"], s["lng"])
        route_polyline.extend(interpolate_points(cur_p, nxt, steps=3))
        cur_p = nxt
    # Back to hub
    route_polyline.extend(interpolate_points(cur_p, (demo_hub.latitude, demo_hub.longitude), steps=3))

    demo_route = Route(
        code="UF-R001",
        vehicle_id=demo_veh.id,
        hub_id=demo_hub.id,
        status="active",
        total_distance_km=14.6,
        estimated_time_min=28.0,
        current_stop_index=1,
        polyline_json=json.dumps(route_polyline),
        is_rerouted=False,
        original_eta_min=28.0,
        rerouted_eta_min=28.0,
        empty_returns_avoided=0
    )
    db.add(demo_route)
    db.flush()

    demo_veh.assigned_route_id = demo_route.id
    demo_veh.status = "in_transit"

    # Add stops
    for idx, s in enumerate(stops_info):
        r_stop = RouteStop(
            route_id=demo_route.id,
            stop_sequence=idx + 1,
            stop_type="delivery",
            lat=s["lat"],
            lng=s["lng"],
            address=s["address"],
            area=s["area"],
            package_count=3,
            status="pending" if idx > 0 else "arrived",
            eta_min=round((idx + 1) * 8.5, 1)
        )
        db.add(r_stop)

    # Hub return stop
    db.add(RouteStop(
        route_id=demo_route.id,
        stop_sequence=len(stops_info) + 1,
        stop_type="hub_return",
        lat=demo_hub.latitude,
        lng=demo_hub.longitude,
        address=f"{demo_hub.name} (Depot Return)",
        area=demo_hub.area,
        package_count=0,
        status="pending",
        eta_min=28.0
    ))

    # 7. Seed Pending Reverse Pickups
    reverse_samples = [
        {"area": "Kothrud", "lat": 18.5085, "lng": 73.8090, "desc": "Footwear size exchange return", "wt": 1.4, "cust": "Aditi Joshi"},
        {"area": "FC Road / Deccan", "lat": 18.5230, "lng": 73.8390, "desc": "Defective electronics return to Hub 01", "wt": 2.2, "cust": "Rahul Deshmukh"},
        {"area": "Viman Nagar", "lat": 18.5660, "lng": 73.9120, "desc": "E-Commerce apparel return", "wt": 0.9, "cust": "Pooja Kulkarni"},
        {"area": "Hinjewadi", "lat": 18.5890, "lng": 73.7400, "desc": "Office IT hardware return", "wt": 3.8, "cust": "Vikram Shinde"}
    ]
    for rs in reverse_samples:
        rp = ReversePickup(
            package_tracking_code=f"UF-RET-{random.randint(1000, 9999)}",
            customer_name=rs["cust"],
            area=rs["area"],
            lat=rs["lat"],
            lng=rs["lng"],
            items_description=rs["desc"],
            weight_kg=rs["wt"],
            return_dest_hub_id=demo_hub.id,
            status="PENDING"
        )
        db.add(rp)

    db.commit()
