# 🌐 Smart Office Internet Path Finder Agent

## 📌 Overview
This project simulates how data travels across an office internet network using an intelligent autonomous agent.  

The system models a network of routers across multiple floors as a graph and applies classical AI search algorithms to determine the most optimal path between a source and a destination.  

The agent dynamically selects the appropriate algorithm and adapts to changing network conditions such as congestion, updating traffic density after each request.

---

## 🎯 Objectives
- Implement classical AI search algorithms (BFS, DFS, UCS, A*)
- Design an autonomous agent capable of decision making
- Simulate real-world office network routing behavior
- Provide an interactive GUI for visualization
- Demonstrate dynamic traffic density updates (reinforcement + decay)

---

## 🧠 Core Concept

| Real World        | Project Representation |
|------------------|-------------------------|
| Router           | Node                    |
| Connection       | Edge                    |
| Latency/Traffic  | Weight                  |
| Routing          | Search Algorithm        |

---

## ⚙️ Tech Stack
- **Backend:** FastAPI (Python)  
- **Frontend:** React (with graph visualization libraries)  
- **Programming Language:** Python  
- **Algorithms:** BFS, DFS, UCS, A*  

---

## 🧩 System Architecture

<pre>
   ┌───────────────┐
│   User Input   │
│ (Source, Goal) │
└───────┬───────┘
│
▼
┌───────────────┐
│     Agent      │
│  (Autonomous)  │
└───────┬───────┘
│
▼
┌───────────────┐
│ Decision Module│
│  Algorithm Chooser
│  - BFS (unweighted)
│  - UCS (weighted)
│  - A* (heuristic)
└───────┬───────┘
│
▼
┌───────────────┐
│ Algorithm Exec │
│  Runs search   │
│  Calculates cost
│  Tracks nodes  │
└───────┬───────┘
│
▼
┌───────────────┐
│ Traffic Update │
│ Reinforcement +│
│ Decay logic    │
│ Dynamic weights│
└───────┬───────┘
│
▼
┌───────────────┐
│     Output     │
│ Optimal Path   │
│ Path Cost      │
│ Nodes Explored │
└───────┬───────┘
│
▼
┌───────────────┐
│     Frontend   │
│   React GUI    │
│ GraphView +    │
│ Visualization  │
└───────────────┘
</pre>

---

## 🔄 Workflow
1. User selects:
   - Source router
   - Destination router  

2. Agent defines goal:
   - Find optimal path  

3. Decision Module:
   - If graph is weighted → use A*
   - If unweighted → use BFS  
   - If weighted with varying costs → use UCS  

4. Algorithm Execution:
   - Search graph
   - Calculate path cost  

5. Output:
   - Optimal route
   - Total cost
   - Nodes explored  

---

## ▶️ Quick Start

### 🚀 Integrated Single-Link Startup

The entire application (frontend + backend) runs from **one command** on a single port:

#### Windows
```bash
START.bat
```

#### Mac/Linux
```bash
bash START.sh
```

#### Direct Python
```bash
python run.py
```

✅ Access the app at: **`http://localhost:8000`**

---

### 📡 API Endpoints (for testing/integration)
- `GET /api/health`
- `GET /api/nodes`
- `GET /api/graph`
- `POST /api/find-path` with JSON body:
  - `{ "start": "A", "goal": "Goal", "algorithm": "auto" }`

---

### 🔧 Manual Development Setup

If you prefer to run backend and frontend separately:

**Backend:**
```bash
cd backend
pip install -r ../requirements.txt
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

**Frontend (separate terminal):**
```bash
cd frontend
npm install
npm start
```

---

## 🚦 Dynamic Network Simulation
- Edge weights change dynamically to simulate traffic/congestion.  
- After each request:
  - **Reinforcement:** Increase weights on edges used in the path.  
  - **Decay:** Decrease weights slightly on unused edges.  
  - **Normalization:** Keep weights within a fixed range (e.g., 1–10).  
- Agent recalculates optimal path accordingly.  

---

## 🤖 Autonomous Agent Behavior
The system behaves as an intelligent agent by:
- Receiving user goals  
- Analyzing the environment (graph)  
- Selecting appropriate algorithm  
- Executing search  
- Returning optimal solution  

---

## 🧮 Algorithms Used
### 🔹 Breadth First Search (BFS)
- Used for unweighted graphs  
- Guarantees shortest path (least edges)  

### 🔹 Depth First Search (DFS)
- Explores deeper paths first  
- Useful for traversal and exploration  

### 🔹 Uniform Cost Search (UCS)
- Expands the lowest-cost node first  
- Optimal for weighted graphs  

### 🔹 A* Search
- Uses cost + heuristic (e.g., floor distance)  
- Efficient and optimal for weighted graphs  

---

## 📊 Features
- Graph-based office network simulation  
- Multiple algorithm support  
- Automatic algorithm selection based on traffic  
- Dynamic traffic density updates after each request  
- Path visualization with cost and nodes explored  
- Performance comparison (time, nodes explored, path cost)  

---

## 🖥️ GUI Features
- Interactive network display  
- Node selection (source & destination)  
- "Run Agent" button  
- Highlight optimal path  
- Display:
  - Path cost  
  - Nodes explored  
- Dynamic edge colors (green = low traffic, red = high traffic)

---
## 📡 API Design (FastAPI)

### Endpoint: `/find-path`

#### Request
```json
{
  "start": "A",
  "goal": "D"
}
```
#### Response:
```json
{
  "path": ["A", "B", "C", "D"],
  "cost": 8,
  "nodes_explored": 12
}
```
---

## 📁 Project Structure

<pre>
smart-office-routing-agent/
│
├── backend/                         # FastAPI backend
│   ├── main.py                       # Entry point for FastAPI app
│   ├── routers/
│   │   └── pathfinder.py             # /find-path endpoint logic
│   ├── services/
│   │   ├── graph.py                  # Graph structure (routers, floors, edges)
│   │   ├── algorithms/
│   │   │   ├── bfs.py
│   │   │   ├── dfs.py
│   │   │   ├── ucs.py
│   │   │   └── astar.py
│   │   └── traffic.py                # Reinforcement + decay traffic update logic
│   ├── models/
│   │   └── request_models.py         # Pydantic schemas for requests/responses
│   ├── data/
│   │   └── network.json              # Initial office network graph (routers, connections, weights)
│   └── utils/
│       └── heuristic.py              # Heuristic functions for A* (e.g., floor distance)
│
├── frontend/                         # React frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── GraphView.jsx         # Visualizes routers + traffic density
│   │   │   ├── RouterSelector.jsx    # Source/destination dropdowns
│   │   │   └── ResultPanel.jsx       # Shows path, cost, nodes explored
│   │   ├── pages/
│   │   │   └── Home.jsx              # Main simulation page
│   │   ├── services/
│   │   │   └── api.js                # Axios calls to FastAPI backend
│   │   ├── utils/
│   │   │   └── graphUtils.js         # Graph rendering helpers
│   │   └── App.jsx
│   └── package.json
│
├── docs/                             # Documentation
│   ├── project_report.md              # 4–6 page report (problem, algorithms, agent design, APIs)
│   ├── architecture_diagram.png
│   └── traffic_update_logic.md        # Explanation of reinforcement + decay method
│
├── tests/                            # Testing
│   ├── test_algorithms.py             # Unit tests for BFS, DFS, UCS, A*
│   ├── test_traffic.py                # Tests for traffic update logic
│   └── test_api.py                    # Endpoint tests
│
├── Dockerfile                         # Containerize backend
├── docker-compose.yml                 # Combine backend + frontend
└── README.md                          # Setup + usage instructions

</pre>
