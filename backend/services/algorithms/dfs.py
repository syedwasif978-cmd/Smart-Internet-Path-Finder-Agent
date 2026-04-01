from typing import Dict, List, Tuple


def dfs(graph, start: str, goal: str) -> Tuple[List[str], float, int]:
    """
    Depth-first branch-and-bound search that explores paths recursively
    and returns the least-traffic path (minimum total edge weight).
    This explores the graph but prunes when the current path cost
    already exceeds the best known cost.
    """
    best_path: List[str] = []
    best_cost = float('inf')
    nodes_explored = 0

    def visit(path: List[str], cost_so_far: float, visited: set):
        nonlocal best_path, best_cost, nodes_explored

        current = path[-1]
        nodes_explored += 1

        # Prune if cost already worse than best
        if cost_so_far >= best_cost:
            return

        if current == goal:
            # Found a complete path
            if cost_so_far < best_cost:
                best_cost = cost_so_far
                best_path = path.copy()
            return

        for neighbor, w in graph.neighbors(current).items():
            if neighbor in visited:
                continue
            visited.add(neighbor)
            visit(path + [neighbor], cost_so_far + (w or 0), visited)
            visited.remove(neighbor)

    visit([start], 0.0, {start})

    if best_path:
        return best_path, best_cost, nodes_explored
    return [], float('inf'), nodes_explored
