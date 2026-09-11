import math
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from .models import Package, DeliveryCluster, MicroHub, Vehicle
from .pune_geo import haversine_distance_km

def find_optimal_micro_hub(
    centroid_lat: float, 
    centroid_lng: float, 
    cluster_weight: float, 
    db: Session
) -> MicroHub:
    """
    Selects the optimal micro-hub considering:
    1. Weighted distance to cluster centroid
    2. Remaining storage capacity
    3. Operating status
    (Closest hub is NOT automatically chosen if congested or lacking capacity)
    """
    hubs = db.query(MicroHub).all()
    if not hubs:
        return None

    best_hub = None
    best_score = float("inf")

    for hub in hubs:
        if hub.status == "maintenance":
            continue
            
        remaining_capacity = hub.max_capacity_kg - hub.current_load_kg
        if remaining_capacity < cluster_weight:
            continue # insufficient capacity

        dist = haversine_distance_km(centroid_lat, centroid_lng, hub.latitude, hub.longitude)
        # Capacity congestion penalty: penalty increases sharply as hub approaches 90% capacity
        utilization_ratio = hub.current_load_kg / max(hub.max_capacity_kg, 1.0)
        congestion_penalty = 1.0 + (utilization_ratio ** 2) * 2.5

        # Score balances geographic proximity with hub availability
        score = dist * congestion_penalty

        if score < best_score:
            best_score = score
            best_hub = hub

    # Fallback to the nearest active hub if all are close to full
    if not best_hub:
        active_hubs = [h for h in hubs if h.status != "maintenance"]
        if active_hubs:
            best_hub = min(active_hubs, key=lambda h: haversine_distance_km(centroid_lat, centroid_lng, h.latitude, h.longitude))
        else:
            best_hub = hubs[0]

    return best_hub

def cluster_unassigned_deliveries(db: Session, max_radius_km: float = 2.8) -> List[DeliveryCluster]:
    """
    Identifies undelivered packages, groups them by geographic proximity,
    creates DeliveryCluster records, and assigns them to optimal micro-hubs.
    """
    # Packages that are in CREATED state and not yet assigned to a cluster
    unassigned_pkgs = db.query(Package).filter(
        Package.status.in_(["CREATED", "ASSIGNED"]),
        Package.cluster_id == None
    ).all()

    if not unassigned_pkgs:
        return []

    # Simple greedy spatial density clustering
    visited = set()
    new_clusters = []
    cluster_count_current = db.query(DeliveryCluster).count()

    for i, pkg in enumerate(unassigned_pkgs):
        if pkg.id in visited:
            continue

        cluster_members = [pkg]
        visited.add(pkg.id)

        # Look for nearby packages
        for other in unassigned_pkgs:
            if other.id not in visited:
                d = haversine_distance_km(pkg.dest_lat, pkg.dest_lng, other.dest_lat, other.dest_lng)
                if d <= max_radius_km:
                    cluster_members.append(other)
                    visited.add(other.id)

        # Compute cluster centroid and aggregate metrics
        centroid_lat = sum(p.dest_lat for p in cluster_members) / len(cluster_members)
        centroid_lng = sum(p.dest_lng for p in cluster_members) / len(cluster_members)
        total_weight = sum(p.weight_kg for p in cluster_members)

        # Choose best micro-hub
        optimal_hub = find_optimal_micro_hub(centroid_lat, centroid_lng, total_weight, db)
        hub_id = optimal_hub.id if optimal_hub else None

        cluster_code = f"UF-C{cluster_count_current + len(new_clusters) + 1:03d}"
        cluster = DeliveryCluster(
            code=cluster_code,
            hub_id=hub_id,
            total_weight_kg=round(total_weight, 2),
            package_count=len(cluster_members),
            centroid_lat=round(centroid_lat, 6),
            centroid_lng=round(centroid_lng, 6),
            status="consolidated"
        )
        db.add(cluster)
        db.flush() # obtain cluster.id

        # Update packages
        for p in cluster_members:
            p.cluster_id = cluster.id
            p.assigned_hub_id = hub_id
            p.status = "CONSOLIDATED"

        if optimal_hub:
            optimal_hub.current_load_kg = round(optimal_hub.current_load_kg + total_weight, 2)

        new_clusters.append(cluster)

    db.commit()
    return new_clusters
