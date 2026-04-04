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


def get_algorithm_comparison(graph: NetworkGraph, start: str, goal: str):
    comparison = {}
    
    algorithms = [
        ('bfs', bfs.bfs),
        ('dfs', dfs.dfs),
        ('ucs', ucs.ucs),
        ('astar', astar.astar),
    ]
    
    for algo_name, algo_func in algorithms:
        try:
            path, cost, nodes_explored = algo_func(graph, start, goal)
            comparison[algo_name] = {
                'path': path,
                'cost': cost,
                'nodes_explored': nodes_explored,
            }
        except:
            comparison[algo_name] = {'path': [], 'cost': 0, 'nodes_explored': 0}
    
    return comparison


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

    algorithm_comparison = get_algorithm_comparison(graph, start, goal)
    update_weights(graph, path)
    
    # Persist graph changes (fails silently in serverless environments)
    try:
        graph.persist(GRAPH_FILE)
    except (OSError, IOError):
        pass  # Read-only file system in serverless environments

    response = FindPathResponse(
        algorithm=algo_name,
        path=path,
        cost=cost,
        nodes_explored=nodes_explored,
        message="Path computed and traffic updated",
        algorithm_comparison=algorithm_comparison,
    )
    
    return response


@router.get("/nodes")
def get_nodes():
    return graph.nodes()


@router.get("/graph")
def get_graph():
    return graph.adjacency

