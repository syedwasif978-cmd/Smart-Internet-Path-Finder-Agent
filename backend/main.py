from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import json
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from backend.routers.pathfinder import router as pathfinder_router

app = FastAPI(title="Smart Office Routing Agent")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(pathfinder_router, prefix="/api", tags=["pathfinder"])


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.post("/save-router-positions")
async def save_router_positions(request: Request):
    data = await request.json()
    try:
        save_path = os.path.join(os.path.dirname(__file__), '..', 'frontend', 'src', 'components', 'savedRouterPositions.json')
        positions_to_save = data.get('positions', data) if isinstance(data, dict) else data
        with open(os.path.abspath(save_path), 'w', encoding='utf-8') as f:
            json.dump(positions_to_save, f, indent=2)
        return {"status": "saved"}
    except Exception as e:
        return {"status": "error", "detail": str(e)}



@app.get("/load-router-positions")
async def load_router_positions():
    try:
        load_path = os.path.join(os.path.dirname(__file__), '..', 'frontend', 'src', 'components', 'savedRouterPositions.json')
        load_path = os.path.abspath(load_path)
        if os.path.exists(load_path):
            with open(load_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            positions = data.get('positions', data) if isinstance(data, dict) else data
            return {"status": "ok", "positions": positions}
        return {"status": "ok", "positions": {}}
    except Exception as e:
        return {"status": "error", "detail": str(e)}


# Serve React build folder as static files
STATIC_DIR = os.path.join(os.path.dirname(__file__), "..", "frontend", "build")

if os.path.exists(STATIC_DIR):
    app.mount("/", StaticFiles(directory=STATIC_DIR, html=True), name="static")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=False)



