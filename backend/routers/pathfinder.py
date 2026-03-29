from fastapi import APIRouter, HTTPException

from backend.models.request_models import FindPathRequest, FindPathResponse
from backend.services.algorithms import bfs, dfs, ucs, astar
from backend.services.graph import NetworkGraph
from backend.services.traffic import update_weights

router = APIRouter()

GRAPH_FILE = "backend/data/network.json"
graph = NetworkGraph.from_json(GRAPH_FILE)


def choose_algorithm(choice: str, graph: NetworkGraph, start: str, goal: str):
    if choice == "bfs":
        return bfs.bfs(graph, start, goal), "BFS"
    if choice == "dfs":
        return dfs.dfs(graph, start, goal), "DFS"
    if choice == "ucs":
        return ucs.ucs(graph, start, goal), "UCS"
    if choice == "astar":
        return astar.astar(graph, start, goal), "A*"

    # auto decision
    if graph.is_unweighted():
        return bfs.bfs(graph, start, goal), "BFS"

    # Weighted graph: prefer A* for heuristic-guided efficiency
    path, cost, nodes = astar.astar(graph, start, goal)
    if path:
        return (path, cost, nodes), "A*"
    return ucs.ucs(graph, start, goal), "UCS"


@router.post("/find-path", response_model=FindPathResponse)
def find_path(request: FindPathRequest):
    start = request.start
    goal = request.goal

    if not graph.has_node(start) or not graph.has_node(goal):
        raise HTTPException(status_code=404, detail="Start or goal node not found")

    algorithm = (request.algorithm or "auto").lower()
    if algorithm not in {"auto", "bfs", "dfs", "ucs", "astar"}:
        raise HTTPException(status_code=400, detail="Unsupported algorithm")

    (path, cost, nodes_explored), algo_name = choose_algorithm(algorithm, graph, start, goal)

    if not path:
        raise HTTPException(status_code=404, detail="No path found")

    update_weights(graph, path)
    graph.persist(GRAPH_FILE)

    return FindPathResponse(
        algorithm=algo_name,
        path=path,
        cost=cost,
        nodes_explored=nodes_explored,
        message="Path computed and traffic updated",
    )


@router.get("/nodes")
def get_nodes():
    return graph.nodes()


@router.get("/graph")
def get_graph():
    return graph.adjacency

