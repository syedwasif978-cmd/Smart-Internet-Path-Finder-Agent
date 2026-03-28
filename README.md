🌐 Smart Internet Path Finder Agent
📌 Overview

This project simulates how data travels across the internet using an intelligent autonomous agent.

The system models a network of routers as a graph and uses classical AI search algorithms to determine the most optimal path between a source and a destination.

The agent dynamically selects the appropriate algorithm and adapts to changing network conditions such as congestion.

🎯 Objectives
Implement classical AI search algorithms (BFS, DFS, A*)
Design an autonomous agent capable of decision making
Simulate real-world network routing behavior
Provide an interactive GUI for visualization
🧠 Core Concept
Real World	Project Representation
Router	Node
Connection	Edge
Latency / Traffic	Weight
Routing	Search Algorithm
⚙️ Tech Stack
Backend: FastAPI
Frontend GUI: Tkinter
Language: Python
Algorithms: BFS, DFS, A*
🧩 System Architecture

The system follows an autonomous agent model:

User Input → Agent → Decision Module → Algorithm Execution → Result

🔄 Workflow
User selects:
Source router
Destination router
Agent defines goal:
Find optimal path
Decision Module:
If graph is weighted → use A*
If unweighted → use BFS
Algorithm Execution:
Search graph
Calculate path cost
Output:
Optimal route
Total cost
Nodes explored
🚦 Dynamic Network Simulation

To simulate real-world conditions:

Edge weights change dynamically
Represents traffic/congestion
Agent recalculates optimal path
🤖 Autonomous Agent Behavior

The system behaves as an intelligent agent by:

Receiving user goals
Analyzing the environment (graph)
Selecting appropriate algorithm
Executing search
Returning optimal solution

🧮 Algorithms Used
🔹 Breadth First Search (BFS)
Used for unweighted graphs
Guarantees shortest path in terms of edges
🔹 Depth First Search (DFS)
Explores deep paths first
Useful for exploration
🔹 A* Search
Uses cost + heuristic
Finds optimal path efficiently
Best for weighted graphs

📊 Features
Graph-based network simulation
Multiple algorithm support
Automatic algorithm selection
Traffic/congestion simulation
Path visualization
Performance comparison

🖥️ GUI Features
Interactive network display
Node selection (source/destination)
Run agent button
Highlight optimal path
Display metrics:
Cost
Nodes explored
📡 API Design (FastAPI)
Endpoint: /find-path

Request:

{
  "start": "A",
  "goal": "D"
}

Response:

{
  "path": ["A", "C", "E", "D"],
  "cost": 6,
  "nodes_explored": 5
}
🧪 Example Scenario

Network:

A → B (2)
A → C (3)
C → E (2)
E → D (1)

Result:

Optimal Path: A → C → E → D
Cost: 6
🧭 Swimlane Diagram
🏗️ Project Structure
project/
│
├── backend/
│   ├── main.py
│   ├── algorithms/
│   │   ├── astar.py
│   │   ├── bfs.py
│   │   ├── dfs.py
│   ├── graph.py
│
├── frontend/
│   ├── gui.py
│
├── README.md

📈 Future Enhancements
Real-time data integration
Advanced heuristics
Multi-agent routing
Web-based visualization

🎓 Learning Outcomes
Understanding of AI search algorithms
Autonomous agent design
Graph-based problem modeling
Backend + GUI integration
