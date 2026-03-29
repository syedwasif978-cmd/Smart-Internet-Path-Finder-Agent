from fastapi import FastAPI
from backend.routers.pathfinder import router as pathfinder_router

app = FastAPI(title="Smart Office Routing Agent")
app.include_router(pathfinder_router, prefix="", tags=["pathfinder"])


@app.get("/health")
def health_check():
    return {"status": "ok"}
