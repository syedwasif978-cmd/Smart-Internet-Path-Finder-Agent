# 🌐 Smart Internet Path Finder Agent

## 📌 Overview
This project simulates how data travels across the internet using an intelligent autonomous agent.

The system models a network of routers as a graph and applies classical AI search algorithms to determine the most optimal path between a source and a destination.

The agent dynamically selects the appropriate algorithm and adapts to changing network conditions such as congestion.

---

## 🎯 Objectives
- Implement classical AI search algorithms (BFS, DFS, A*)
- Design an autonomous agent capable of decision making
- Simulate real-world network routing behavior
- Provide an interactive GUI for visualization

---

## 🧠 Core Concept

| Real World        | Project Representation |
|------------------|----------------------|
| Router           | Node                 |
| Connection       | Edge                 |
| Latency/Traffic  | Weight               |
| Routing          | Search Algorithm     |

---

## ⚙️ Tech Stack
- Backend: FastAPI  
- Frontend GUI: Tkinter  
- Programming Language: Python  
- Algorithms: BFS, DFS, A*  

---

## 🧩 System Architecture

User Input → Agent → Decision Module → Algorithm Execution → Result

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

4. Algorithm Execution:
   - Search graph
   - Calculate path cost  

5. Output:
   - Optimal route
   - Total cost
   - Nodes explored  

---

## 🚦 Dynamic Network Simulation
- Edge weights can change dynamically  
- Simulates traffic/congestion  
- Agent recalculates optimal path accordingly  

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

### 🔹 A* Search
- Uses cost + heuristic  
- Efficient and optimal for weighted graphs  

---

## 📊 Features
- Graph-based network simulation  
- Multiple algorithm support  
- Automatic algorithm selection  
- Traffic/congestion simulation  
- Path visualization  
- Performance comparison  

---

## 🖥️ GUI Features
- Interactive network display  
- Node selection (source & destination)  
- "Run Agent" button  
- Highlight optimal path  
- Display:
  - Path cost  
  - Nodes explored  

---

## 📡 API Design (FastAPI)

### Endpoint: `/find-path`

#### Request
```json
{
  "start": "A",
  "goal": "D"
}
