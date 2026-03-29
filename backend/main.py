from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
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


# Serve React build folder as static files
STATIC_DIR = os.path.join(os.path.dirname(__file__), "..", "frontend", "build")
print(f"DEBUG: Looking for static files in: {STATIC_DIR}")
print(f"DEBUG: Static dir exists: {os.path.exists(STATIC_DIR)}")

if os.path.exists(STATIC_DIR):
    print(f"DEBUG: Mounting static files from {STATIC_DIR}")
    app.mount("/", StaticFiles(directory=STATIC_DIR, html=True), name="static")
else:
    print(f"WARNING: Static directory not found at {STATIC_DIR}")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=False)



