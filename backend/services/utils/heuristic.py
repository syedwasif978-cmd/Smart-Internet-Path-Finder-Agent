
from typing import Tuple


def node_position(node: str) -> Tuple[int, int]:
    # Simple heuristic from node name:
    # First character maps to x position, digits to y position. Fallback to 0.
    x = ord(node[0].upper()) - ord('A') if node else 0
    y = 0
    for ch in node[1:]:
        if ch.isdigit():
            y = y * 10 + int(ch)
    return x, y


def heuristic(from_node: str, to_node: str) -> float:
    from_x, from_y = node_position(from_node)
    to_x, to_y = node_position(to_node)
    return abs(from_x - to_x) + abs(from_y - to_y)
