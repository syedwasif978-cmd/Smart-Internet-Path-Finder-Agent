import pytest

from backend.services.graph import NetworkGraph
from backend.services.algorithms import bfs, dfs, ucs, astar


@pytest.fixture(scope="module")
def graph():
    return NetworkGraph.from_json("backend/data/network.json")


def test_bfs_shortest_hops(graph):
    path, cost, nodes_explored = bfs.bfs(graph, "A", "Goal")
    assert path[0] == "A" and path[-1] == "Goal"
    assert cost == len(path) - 1
    assert nodes_explored > 0


def test_dfs_returns_path(graph):
    path, cost, nodes_explored = dfs.dfs(graph, "A", "Goal")
    assert path
    assert nodes_explored > 0


def test_ucs_min_cost(graph):
    path, cost, nodes_explored = ucs.ucs(graph, "A", "Goal")
    assert cost <= 10
    assert path[0] == "A"
    assert path[-1] == "Goal"


def test_astar_heuristic(graph):
    path, cost, nodes_explored = astar.astar(graph, "A", "Goal")
    assert path and cost != float('inf')


def test_no_path():
    graph = NetworkGraph({"A": {}, "B": {}})
    path, cost, nodes_explored = bfs.bfs(graph, "A", "B")
    assert path == []
    assert cost == float('inf')
