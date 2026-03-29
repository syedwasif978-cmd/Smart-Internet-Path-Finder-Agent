import heapq
from typing import List, Tuple

from backend.services.utils.heuristic import heuristic


def astar(graph, start: str, goal: str) -> Tuple[List[str], float, int]:
    frontier = [(heuristic(start, goal), 0.0, [start])]
    visited_costs = {start: 0.0}
    nodes_explored = 0

    while frontier:
        _, cost, path = heapq.heappop(frontier)
        current = path[-1]

        if current == goal:
            nodes_explored += 1
            return path, cost, nodes_explored

        if cost > visited_costs.get(current, float('inf')):
            continue

        nodes_explored += 1

        for neighbor, edge_cost in graph.neighbors(current).items():
            new_cost = cost + edge_cost
            if new_cost < visited_costs.get(neighbor, float('inf')):
                visited_costs[neighbor] = new_cost
                priority = new_cost + heuristic(neighbor, goal)
                heapq.heappush(frontier, (priority, new_cost, path + [neighbor]))

    return [], float('inf'), nodes_explored
