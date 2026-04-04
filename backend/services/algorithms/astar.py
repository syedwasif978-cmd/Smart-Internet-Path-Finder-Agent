import heapq
from typing import List, Tuple

from backend.services.utils.heuristic import heuristic


def astar(graph, start: str, goal: str) -> Tuple[List[str], float, int]:
    """
    A* Search — priority queue ordered by f(n) = g(n) + h(n).
    g(n) = actual cost from start to n.
    h(n) = admissible heuristic estimate from n to goal (tree depth distance).
    Finds the optimal path while exploring fewer nodes than UCS by using
    the heuristic to guide expansion towards the goal.
    """
    # (f_score, g_cost, path)
    frontier = [(heuristic(start, goal), 0.0, [start])]
    visited: set = set()
    nodes_explored = 0

    while frontier:
        f, cost, path = heapq.heappop(frontier)
        current = path[-1]

        if current in visited:
            continue

        visited.add(current)
        nodes_explored += 1

        if current == goal:
            return path, cost, nodes_explored

        for neighbor, edge_cost in graph.neighbors(current).items():
            if neighbor not in visited:
                new_cost = cost + edge_cost
                h = heuristic(neighbor, goal)
                heapq.heappush(frontier, (new_cost + h, new_cost, path + [neighbor]))

    return [], float('inf'), nodes_explored
