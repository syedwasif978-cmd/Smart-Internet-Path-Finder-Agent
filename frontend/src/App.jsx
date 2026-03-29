import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:8000";
const algorithms = ["auto", "bfs", "dfs", "ucs", "astar"];

function weightColor(weight) {
  if (weight < 2) return "#3CB371";
  if (weight < 4) return "#ADFF2F";
  if (weight < 7) return "#FFA500";
  return "#FF4500";
}

function App() {
  const [nodes, setNodes] = useState([]);
  const [graph, setGraph] = useState({});
  const [start, setStart] = useState("");
  const [goal, setGoal] = useState("");
  const [algorithm, setAlgorithm] = useState("auto");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadNodeData() {
      try {
        const [nodeResp, graphResp] = await Promise.all([
          axios.get(`${API_BASE}/nodes`),
          axios.get(`${API_BASE}/graph`),
        ]);
        setNodes(nodeResp.data);
        setGraph(graphResp.data);
        if (!start && nodeResp.data.length > 0) {
          setStart(nodeResp.data[0]);
          setGoal(nodeResp.data[nodeResp.data.length - 1]);
        }
      } catch (err) {
        setError("Failed to load node/graph data: " + (err.message || err));
      }
    }
    loadNodeData();
  }, []);

  const runAgent = async () => {
    setError("");
    setResult(null);

    if (!start || !goal) {
      setError("Please choose both start and goal routers.");
      return;
    }

    try {
      const response = await axios.post(`${API_BASE}/find-path`, {
        start,
        goal,
        algorithm,
      });
      setResult(response.data);
      const refreshed = await axios.get(`${API_BASE}/graph`);
      setGraph(refreshed.data);
    } catch (err) {
      const message = err.response?.data?.detail || err.message || "Request failed";
      setError(message);
    }
  };

  return (
    <div style={{ padding: 24, fontFamily: "Arial, sans-serif" }}>
      <h1>Smart Internet Path Finder Agent</h1>

      <div style={{ marginBottom: 12 }}>
        <label style={{ marginRight: 8 }}>Start:</label>
        <select value={start} onChange={(e) => setStart(e.target.value)}>
          <option value="">Select start</option>
          {nodes.map((node) => (
            <option key={node} value={node}>{node}</option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: 12 }}>
        <label style={{ marginRight: 8 }}>Goal:</label>
        <select value={goal} onChange={(e) => setGoal(e.target.value)}>
          <option value="">Select goal</option>
          {nodes.map((node) => (
            <option key={node} value={node}>{node}</option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: 12 }}>
        <label style={{ marginRight: 8 }}>Algorithm:</label>
        <select value={algorithm} onChange={(e) => setAlgorithm(e.target.value)}>
          {algorithms.map((alg) => (
            <option key={alg} value={alg}>{alg}</option>
          ))}
        </select>
      </div>

      <button onClick={runAgent} style={{ padding: "8px 16px" }}>
        Run Agent
      </button>

      {error && <div style={{ marginTop: 16, color: "red" }}>{error}</div>}

      {result && (
        <div style={{ marginTop: 24 }}>
          <h2>Result</h2>
          <p><strong>Algorithm:</strong> {result.algorithm}</p>
          <p><strong>Path:</strong> {result.path.join(" → ")}</p>
          <p><strong>Cost:</strong> {result.cost}</p>
          <p><strong>Nodes Explored:</strong> {result.nodes_explored}</p>
          <p>{result.message}</p>
        </div>
      )}

      <div style={{ marginTop: 24 }}>
        <h2>Graph edges (weights / traffic)</h2>
        {Object.keys(graph).length === 0 ? (
          <p>Loading graph...</p>
        ) : (
          <table border="1" cellPadding="6" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th>From</th>
                <th>To</th>
                <th>Weight</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(graph).flatMap(([u, neighbors]) =>
                Object.entries(neighbors).map(([v, w]) => (
                  <tr key={`${u}-${v}`}>
                    <td>{u}</td>
                    <td>{v}</td>
                    <td style={{ color: weightColor(w) }}>{w.toFixed(2)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      <div style={{ marginTop: 24 }}>
        <h2>Instructions</h2>
        <ul>
          <li>Pick source and destination routers from dropdowns</li>
          <li>Pick algorithm or leave auto for agent decision</li>
          <li>Click Run Agent and get best path + cost + explored nodes</li>
          <li>Graph table updates traffic weights after each path</li>
        </ul>
      </div>
    </div>
  );
}

export default App;
