# Urban Flow — Intelligent Urban Logistics Coordination Platform

> **"Today's roads move people. Urban Flow makes them intelligently move everything people need."** 🚚🏙️

Urban Flow is an intelligent urban logistics coordination platform based on the concept of a **"second road network for goods."** Modern cities have highly developed transportation systems for people, but the movement of goods is fragmented among individual delivery companies, restaurants, retailers, e-commerce platforms, pharmacies, and local businesses. 

Urban Flow creates a shared digital logistics layer that coordinates these movements across a simulated urban zone in **Pune, India**. The system does not replace existing delivery companies; instead, it acts as an intelligent coordination and optimization layer that identifies compatible deliveries, groups them, assigns them to appropriate micro-hubs and vehicles, creates efficient delivery routes, manages reverse logistics, and provides city-level analytics.

---

## 🌟 Key Features

1. **Smart City Command Center**: Dark-themed telemetry dashboard displaying live active packages, vehicle fleet utilization, active micro-hubs, simulated trips avoided, and carbon emissions saved.
2. **Interactive Pune Map (Leaflet)**: Custom dark geospatial map displaying 8 Pune micro-hubs (Shivajinagar, Kothrud, Hinjewadi, Viman Nagar, Hadapsar, Kalyani Nagar, Baner, Swargate), dynamic vehicle telemetry, and animated route lines.
3. **Delivery Clustering Algorithm**: Groups undelivered shipments by geographic proximity (Haversine density) and assigns them to optimal micro-hubs based on capacity and distance.
4. **Dynamic Rerouting Engine**: Simulates road closures (e.g. on Fergusson College Road) and dynamically recalculates routes in real-time, computing ETA deltas (+4.5 min) and detour waypoints.
5. **Reverse Logistics Piggybacking**: Pairs returning vehicles with pending package returns and merchant pickups in the delivery corridor, eliminating deadhead (empty return) journeys.
6. **Simulation Center (Before vs After)**: Dual-model engine comparing Conventional uncoordinated direct dispatch vs Urban Flow's consolidated network with Recharts comparative bar and area charts.
7. **Plan the Network (City Planning Tool)**: Simulates placing candidate micro-hubs (e.g. Wakad Junction, Magarpatta) and calculates system-wide distance and congestion reduction deltas.
8. **Grounded AI Logistics Assistant**: Provider-agnostic assistant grounded strictly on real database statistics (Database ➔ Backend ➔ Calculations ➔ Structured data ➔ AI explanation).
9. **Multi-Role Portals**: Dedicated switchable interfaces for **City Admin**, **Business** (bulk CSV consignments), **Driver** (mobile stop sequence with one-click actions), and **Customer** (progress tracking timeline).

---

## 🏛️ System Architecture

```
                    URBAN FLOW
                        │
              ┌─────────┴─────────┐
              │                   │
      Next.js Frontend        Mobile UI
        (TypeScript)          (Tailwind)
              │
              ▼ (REST APIs)
       FastAPI Backend (Python 3.9+)
              │
    ┌─────────┼──────────┬──────────┐
    ▼         ▼          ▼          ▼
Database   Routing    Simulation    AI Layer
SQLAlchemy  Pune       Dual Model  (Grounded
 SQLite    Graph VRP  Conv vs UF   Analysis)
```

---

## 🚀 Quickstart Guide

### Prerequisites
- Node.js 18+ & npm
- Python 3.9+

### 1. Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
API Documentation will be accessible at: `http://127.0.0.1:8000/docs`

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## 🧪 Automated Testing

To run the backend test suite:
```bash
cd backend
PYTHONPATH=. ./venv/bin/pytest -v
```
Verifies database seeding, clustering algorithms, dynamic rerouting, reverse logistics matching, simulation comparisons, and AI reasoning.

---

## 👨‍🏫 Faculty Demonstration Flow (Section 30)

1. **City Status Overview**: Open the command center showing 1,240 active packages, 30 vehicles, and 8 micro-hubs.
2. **Explore Map**: Demonstrate fragmented deliveries across Pune neighborhoods.
3. **Optimize Network**: Click **Optimize Network** to cluster packages into consolidated routes.
4. **Simulate Road Closure**: Click **Simulate Road Closure** on FC Road to watch real-time detour recalculation and ETA comparison.
5. **Reverse Logistics**: Run the reverse matcher to show return packages piggybacking on returning delivery vehicles.
6. **Simulation Center**: Open the Before vs After comparison to present quantifiable trips avoided and kilometers saved.
7. **AI Assistant**: Query *"Where should we build the next micro-hub and why?"* to show grounded, data-backed reasoning.

---

## 📄 License
MIT License • Developed for Urban Flow Project Prototype.
