import heapq
from typing import List, Tuple


def ucs(graph, start: str, goal: str) -> Tuple[List[str], float, int]:
    """
    Uniform Cost Search — priority queue ordered by cumulative path cost g(n).
    Always expands the cheapest unexplored node next.
    Guaranteed to find the minimum-cost path (optimal).
    """
    frontier = [(0.0, [start])]   # (cost, path)
    visited: set = set()
    nodes_explored = 0

    while frontier:
        cost, path = heapq.heappop(frontier)
        current = path[-1]

        if current in visited:
            continue

        visited.add(current)
        nodes_explored += 1

        if current == goal:
            return path, cost, nodes_explored

        for neighbor, edge_cost in graph.neighbors(current).items():
            if neighbor not in visited:
                heapq.heappush(frontier, (cost + edge_cost, path + [neighbor]))

    return [], float('inf'), nodes_explored
