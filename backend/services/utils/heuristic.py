"""
Tree-depth heuristic for the office network.

The graph is a tree rooted at A with Goal as the target leaf.
The heuristic h(n) = remaining_depth(n) * MIN_EDGE_WEIGHT gives an
admissible (never over-estimates) lower bound on the cost to reach Goal.

Depth from Goal (level 0 = Goal):
  Goal  -> 0
  J, K  -> 1
  F, H  -> 2
  C, D  -> 3
  B     -> 4
  A     -> 5
  E, G, I, L -> dead-end branches; use same depth estimate as siblings
"""

from typing import Dict

# Minimum edge weight in the network (used to keep heuristic admissible)
MIN_EDGE = 10.0

# Hops from each node to Goal along the *shortest* tree path
_DEPTH_TO_GOAL: Dict[str, int] = {
    "Goal": 0,
    "J":    1,
    "K":    1,
    "F":    2,
    "H":    2,
    "L":    2,   # J->L is a dead end but estimate conservatively
    "C":    3,
    "D":    3,
    "G":    4,   # D->G dead end; use D's depth + 1
    "I":    4,   # E->I dead end
    "E":    3,   # same level as D
    "B":    4,
    "A":    5,
}


def heuristic(from_node: str, to_node: str) -> float:
    """
    Admissible heuristic: estimated minimum cost from from_node to to_node.
    Uses precomputed tree depths when to_node is 'Goal',
    otherwise falls back to 0 (still admissible).
    """
    if to_node == "Goal":
        depth = _DEPTH_TO_GOAL.get(from_node, 5)
        return depth * MIN_EDGE
    # Generic fallback: 0 is always admissible
    return 0.0
