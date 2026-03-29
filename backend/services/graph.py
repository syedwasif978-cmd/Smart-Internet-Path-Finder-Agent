import json
from typing import Dict, List, Tuple

class NetworkGraph:
    def __init__(self, adjacency: Dict[str, Dict[str, float]]):
        self.adjacency = adjacency

    @classmethod
    def from_json(cls, path: str):
        with open(path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        adjacency: Dict[str, Dict[str, float]] = {}
        for node in data.get('nodes', []):
            adjacency[node] = {}
        for edge in data.get('edges', []):
            u = edge['from']
            v = edge['to']
            w = float(edge['weight'])
            adjacency.setdefault(u, {})[v] = w
            adjacency.setdefault(v, {})[u] = w
        return cls(adjacency)

    def neighbors(self, node: str) -> Dict[str, float]:
        return self.adjacency.get(node, {})

    def edge_weight(self, from_node: str, to_node: str) -> float:
        return self.adjacency.get(from_node, {}).get(to_node, float('inf'))

    def nodes(self) -> List[str]:
        return list(self.adjacency.keys())

    def has_node(self, node: str) -> bool:
        return node in self.adjacency

    def is_unweighted(self) -> bool:
        weights = set()
        for dsts in self.adjacency.values():
            weights.update(dsts.values())
            if len(weights) > 1:
                return False
        return len(weights) <= 1

    def set_edge_weight(self, from_node: str, to_node: str, weight: float):
        if from_node in self.adjacency and to_node in self.adjacency[from_node]:
            self.adjacency[from_node][to_node] = weight
        if to_node in self.adjacency and from_node in self.adjacency[to_node]:
            self.adjacency[to_node][from_node] = weight

    def persist(self, path: str):
        edges: List[Dict[str, float]] = []
        seen = set()
        for u, neighbors in self.adjacency.items():
            for v, w in neighbors.items():
                if (v, u) not in seen:
                    edges.append({'from': u, 'to': v, 'weight': w})
                    seen.add((u, v))
        data = {'nodes': self.nodes(), 'edges': edges}
        with open(path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2)
