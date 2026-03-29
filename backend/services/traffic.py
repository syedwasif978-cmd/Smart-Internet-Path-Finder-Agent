from typing import List


def update_weights(graph, path: List[str], reinforcement: float = 1.0, decay: float = 0.1, min_weight: float = 1.0, max_weight: float = 10.0):
    if not path:
        return

    # Reinforce edges in used path
    for i in range(len(path) - 1):
        u, v = path[i], path[i + 1]
        current = graph.edge_weight(u, v)
        new_weight = min(max_weight, current + reinforcement)
        graph.set_edge_weight(u, v, new_weight)

    # Apply decay to all other edges
    for u in graph.nodes():
        for v, current in graph.neighbors(u).items():
            if v in path and u in path:
                # edge in path might be handled already
                continue
            new_weight = max(min_weight, current - decay)
            graph.set_edge_weight(u, v, new_weight)
