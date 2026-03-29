from typing import List, Optional

from pydantic import BaseModel, Field


class FindPathRequest(BaseModel):
    start: str = Field(..., example="A")
    goal: str = Field(..., example="Goal")
    algorithm: Optional[str] = Field(None, example="auto")


class FindPathResponse(BaseModel):
    algorithm: str
    path: List[str]
    cost: float
    nodes_explored: int
    message: str
