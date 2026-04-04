from collections import deque
from typing import List, Tuple


def bfs(graph, start: str, goal: str) -> Tuple[List[str], float, int]:
    """
    Breadth-First Search — FIFO queue, explores level by level.
    Ignores edge weights for expansion order.
    Returns the path with the fewest hops (not necessarily least cost).
    Path cost is calculated as the sum of edge weights along the found path.
    """
    if start == goal:
        return [start], 0.0, 1

    queue = deque([[start]])
    visited = {start}
    nodes_explored = 0

    while queue:
        path = queue.popleft()
        current = path[-1]
        nodes_explored += 1

        for neighbor in graph.neighbors(current):
            if neighbor in visited:
                continue

            new_path = path + [neighbor]

            if neighbor == goal:
                nodes_explored += 1
                cost = sum(
                    graph.edge_weight(new_path[i], new_path[i + 1])
                    for i in range(len(new_path) - 1)
                )
                return new_path, cost, nodes_explored

            visited.add(neighbor)
            queue.append(new_path)

    return [], float('inf'), nodes_explored
