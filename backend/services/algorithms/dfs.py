from typing import Dict, List, Tuple


def dfs(graph, start: str, goal: str) -> Tuple[List[str], float, int]:
    stack = [[start]]
    visited = set()
    nodes_explored = 0

    while stack:
        path = stack.pop()
        current = path[-1]

        if current in visited:
            continue

        visited.add(current)
        nodes_explored += 1

        if current == goal:
            return path, sum(graph.edge_weight(path[i], path[i+1]) for i in range(len(path)-1)), nodes_explored

        for neighbor in sorted(graph.neighbors(current), reverse=True):
            if neighbor not in visited:
                stack.append(path + [neighbor])

    return [], float('inf'), nodes_explored
