import React from "react";
import { motion } from "framer-motion";

const algorithms = ["auto", "bfs", "dfs", "ucs", "astar"];

function ControlPanel({
  nodes,
  start,
  setStart,
  goal,
  setGoal,
  algorithm,
  setAlgorithm,
  onRunAgent,
  loading,
  error,
  result,
}) {
  return (
    <div className="control-panel glass-panel">
      <div className="panel-header">Routing Command Center</div>

      <div className="form-group">
        <label className="form-label">Source Router</label>
        <select
          className="form-select glass-card"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          disabled={loading}
          style={{ padding: "12px", border: "1px solid rgba(255,255,255,0.5)" }}
        >
          <option value="">Select starting router...</option>
          {nodes.map((node) => (
            <option key={node} value={node}>
              {node}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Destination Router</label>
        <select
          className="form-select glass-card"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          disabled={loading}
          style={{ padding: "12px", border: "1px solid rgba(255,255,255,0.5)" }}
        >
          <option value="">Select destination router...</option>
          {nodes.map((node) => (
            <option key={node} value={node}>
              {node}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Algorithm</label>
        <select
          className="form-select glass-card"
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value)}
          disabled={loading}
          style={{ padding: "12px", border: "1px solid rgba(255,255,255,0.5)" }}
        >
          {algorithms.map((alg) => (
            <option key={alg} value={alg}>
              {alg === "auto" && "Auto (Smart Decision)"}
              {alg === "bfs" && "BFS (Breadth-First)"}
              {alg === "dfs" && "DFS (Depth-First)"}
              {alg === "ucs" && "UCS (Uniform Cost)"}
              {alg === "astar" && "A* (Heuristic)"}
            </option>
          ))}
        </select>
      </div>

      <motion.button
        className="btn-glass"
        style={{ width: "100%", padding: "14px 10px", marginTop: "20px", fontSize: "0.9rem", whiteSpace: "nowrap" }}
        onClick={onRunAgent}
        disabled={loading || !start || !goal}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {loading ? (
          <>
            <span className="loading"></span>
            Searching...
          </>
        ) : (
          "FIND OPTIMAL PATH"
        )}
      </motion.button>

      {error && <div className="alert-error" style={{ marginTop: "20px" }}>{error}</div>}

      {result && (
        <div className="result-section glass-card" style={{ marginTop: "20px" }}>
          <div className="result-title">Path Found</div>

          <div className="result-item">
            <strong>Algorithm:</strong>
            <span className="result-value">{result.algorithm}</span>
          </div>

          <div className="result-item">
            <strong>Path:</strong>
            <span className="result-value">
              {result.path.join(" → ")}
            </span>
          </div>

          <div className="result-item">
            <strong>Total Cost:</strong>
            <span className="result-value">{result.cost.toFixed(2)}</span>
          </div>

          <div className="result-item">
            <strong>Nodes Explored:</strong>
            <span className="result-value">{result.nodes_explored}</span>
          </div>

          <div className="result-item" style={{ marginTop: 12, color: "var(--primary-purple)", fontWeight: 600 }}>
            ✅ {result.message}
          </div>
        </div>
      )}

      <div className="info-text" style={{ marginTop: 30 }}>
        💡 <strong>How to use:</strong>
        <br />
        1. Select a source router<br />
        2. Choose a destination<br />
        3. Pick an algorithm or let AI decide<br />
        4. Click "Find Optimal Path"<br />
        5. Watch the magic happen on the right! 🪄
      </div>
    </div>
  );
}

export default ControlPanel;
