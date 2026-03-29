from collections import deque
from typing import Dict, List, Tuple


def bfs(graph, start: str, goal: str) -> Tuple[List[str], float, int]:
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
            visited.add(neighbor)
            new_path = path + [neighbor]

            if neighbor == goal:
                return new_path, len(new_path) - 1, nodes_explored

            queue.append(new_path)

    return [], float('inf'), nodes_explored
