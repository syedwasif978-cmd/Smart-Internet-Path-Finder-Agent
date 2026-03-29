import heapq
from typing import List, Tuple


def ucs(graph, start: str, goal: str) -> Tuple[List[str], float, int]:
    frontier = [(0.0, [start])]
    visited_costs = {start: 0.0}
    nodes_explored = 0

    while frontier:
        cost, path = heapq.heappop(frontier)
        current = path[-1]

        if cost > visited_costs.get(current, float('inf')):
            continue

        nodes_explored += 1

        if current == goal:
            return path, cost, nodes_explored

        for neighbor, edge_cost in graph.neighbors(current).items():
            new_cost = cost + edge_cost
            if new_cost < visited_costs.get(neighbor, float('inf')):
                visited_costs[neighbor] = new_cost
                heapq.heappush(frontier, (new_cost, path + [neighbor]))

    return [], float('inf'), nodes_explored
