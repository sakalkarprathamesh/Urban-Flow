export interface DashboardStats {
  active_packages: number;
  packages_in_transit: number;
  packages_consolidated: number;
  consolidation_rate_pct: number;
  active_vehicles: number;
  vehicles_in_transit: number;
  active_micro_hubs: number;
  active_routes: number;
  average_vehicle_utilization_pct: number;
  simulated_trips_avoided: number;
  simulated_distance_saved_km: number;
  simulated_co2_saved_kg: number;
  empty_returns_avoided: number;
  active_traffic_incidents: number;
  reverse_pickups_matched: number;
}

export interface MicroHub {
  id: number;
  code: string;
  name: string;
  area: string;
  lat: number;
  lng: number;
  latitude?: number;
  longitude?: number;
  max_capacity_kg: number;
  current_load_kg: number;
  capacity?: number;
  current_load?: number;
  utilization_pct: number;
  status: string;
  operating_hours?: string;
  location_name?: string;
}

export interface Vehicle {
  id: number;
  code: string;
  type: string;
  lat: number;
  lng: number;
  latitude?: number;
  longitude?: number;
  status: string;
  current_load_kg: number;
  max_capacity_kg: number;
  utilization_pct: number;
  battery_pct: number;
  route_id?: number | null;
  is_electric?: boolean;
}

export interface RouteStop {
  id: number;
  sequence_order: number;
  address: string;
  is_completed: boolean;
}

export interface RouteData {
  id: number;
  code: string;
  vehicle_id?: number | null;
  hub_id?: number | null;
  status: string;
  distance_km: number;
  total_distance_km?: number;
  eta_min: number;
  total_duration_min?: number;
  is_rerouted: boolean;
  original_eta: number;
  rerouted_eta: number;
  empty_returns_avoided: number;
  polyline: [number, number][];
  stops?: RouteStop[];
}

export interface DeliveryCluster {
  id: number;
  code?: string;
  cluster_code?: string;
  lat: number;
  lng: number;
  latitude?: number;
  longitude?: number;
  package_count: number;
  total_weight_kg: number;
  hub_id?: number | null;
  assigned_hub_id?: number | null;
  status: string;
}

export interface TrafficEvent {
  id: number;
  road?: string;
  road_name?: string;
  area: string;
  from_lat?: number;
  from_lng?: number;
  to_lat?: number;
  to_lng?: number;
  latitude?: number;
  longitude?: number;
  severity: string;
  description: string;
}

export interface PackageItem {
  id: number;
  tracking_code: string;
  tracking_number?: string;
  sender_name: string;
  recipient_name: string;
  pickup_lat: number;
  pickup_lng: number;
  dest_lat: number;
  dest_lng: number;
  dest_area: string;
  dest_address: string;
  weight_kg: number;
  size_category?: string;
  priority: string;
  deadline: string;
  status: string;
  cluster_id?: number | null;
  assigned_hub_id?: number | null;
  assigned_vehicle_id?: number | null;
  is_reverse_eligible: boolean;
  estimated_delivery_time?: string;
}

export interface ReversePickupItem {
  id: number;
  customer?: string;
  tracking_number?: string;
  area?: string;
  pickup_area?: string;
  pickup_address?: string;
  lat?: number;
  lng?: number;
  item?: string;
  status: string;
  vehicle_code?: string;
  matched_route?: string;
  weight_kg?: number;
  assigned_hub_id?: number | null;
  assigned_vehicle_id?: number | null;
}

export interface MapDataResponse {
  hubs: MicroHub[];
  vehicles: Vehicle[];
  routes: RouteData[];
  clusters: DeliveryCluster[];
  traffic_events: TrafficEvent[];
  destinations: {
    lat: number;
    lng: number;
    weight: number;
    area: string;
    status: string;
    tracking_code: string;
  }[];
  reverse_pickups: ReversePickupItem[];
}

export interface SimulationResult {
  inputs: {
    package_count: number;
    vehicle_count: number;
    hub_count: number;
    traffic_level: string;
    demand_multiplier: number;
  };
  conventional: {
    vehicles: number;
    trips: number;
    total_distance_km: number;
    avg_utilization_pct: number;
    empty_returns: number;
    avg_delivery_time_min: number;
    packages_consolidated: number;
    co2_emissions_kg: number;
  };
  urban_flow: {
    vehicles: number;
    trips: number;
    total_distance_km: number;
    avg_utilization_pct: number;
    empty_returns: number;
    avg_delivery_time_min: number;
    packages_consolidated: number;
    co2_emissions_kg: number;
  };
  deltas: {
    trips_avoided: number;
    distance_saved_km: number;
    distance_saved_pct: number;
    empty_returns_avoided: number;
    co2_saved_kg: number;
    utilization_gain_pct: number;
  };
  hourly_distribution: {
    hour: string;
    conventional_trips: number;
    urban_flow_trips: number;
    consolidated: number;
  }[];
  neighborhood_breakdown: {
    name: string;
    packages: number;
    saved_km: number;
  }[];
}
