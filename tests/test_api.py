from fastapi.testclient import TestClient
from backend.main import app


client = TestClient(app)


def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_find_path_auto():
    response = client.post("/find-path", json={"start": "A", "goal": "Goal"})
    assert response.status_code == 200
    data = response.json()
    assert data["path"][0] == "A"
    assert data["path"][-1] == "Goal"
    assert data["cost"] >= 0


def test_find_path_invalid_node():
    response = client.post("/find-path", json={"start": "X", "goal": "Goal"})
    assert response.status_code == 404
