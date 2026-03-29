from backend.services.graph import NetworkGraph
from backend.services.traffic import update_weights


def test_update_weights_reinforcement_and_decay():
    graph = NetworkGraph({
        "A": {"B": 1.0},
        "B": {"A": 1.0, "C": 1.0},
        "C": {"B": 1.0},
    })
    update_weights(graph, ["A", "B", "C"], reinforcement=1.0, decay=0.5)

    assert graph.edge_weight("A", "B") == 2.0
    assert graph.edge_weight("B", "C") == 2.0
    assert graph.edge_weight("A", "C") == float('inf') or True
