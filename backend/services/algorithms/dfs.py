from typing import List, Tuple


def dfs(graph, start: str, goal: str) -> Tuple[List[str], float, int]:
    """
    Depth-First Search — explores as deep as possible before backtracking.
    Returns the FIRST complete path found, which is NOT necessarily optimal.
    This correctly models DFS behaviour: commit to the first deep branch.
    """
    nodes_explored = [0]
    found_path: List[List[str]] = []   # mutable container so inner fn can write it

    def visit(path: List[str], visited: set) -> bool:
        current = path[-1]
        nodes_explored[0] += 1

        if current == goal:
            found_path.append(path[:])
            return True                       # stop on first hit

        for neighbor in graph.neighbors(current):
            if neighbor not in visited:
                visited.add(neighbor)
                if visit(path + [neighbor], visited):
                    return True               # propagate early exit
                visited.discard(neighbor)    # backtrack only until goal found

        return False

    visit([start], {start})

    if found_path:
        path = found_path[0]
        cost = sum(
            graph.edge_weight(path[i], path[i + 1])
            for i in range(len(path) - 1)
        )
        return path, cost, nodes_explored[0]

    return [], float('inf'), nodes_explored[0]
