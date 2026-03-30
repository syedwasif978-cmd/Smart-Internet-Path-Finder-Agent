import React from "react";

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
    <div className="control-panel">
      <div className="panel-header">⚙️ Control Center</div>

      {/* Start Router Selection */}
      <div className="form-group">
        <label className="form-label">🚀 Source Router</label>
        <select
          className="form-select"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          disabled={loading}
        >
          <option value="">Select starting router...</option>
          {nodes.map((node) => (
            <option key={node} value={node}>
              🔷 {node}
            </option>
          ))}
        </select>
      </div>

      {/* Goal Router Selection */}
      <div className="form-group">
        <label className="form-label">🎯 Destination Router</label>
        <select
          className="form-select"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          disabled={loading}
        >
          <option value="">Select destination router...</option>
          {nodes.map((node) => (
            <option key={node} value={node}>
              🔷 {node}
            </option>
          ))}
        </select>
      </div>

      {/* Algorithm Selection */}
      <div className="form-group">
        <label className="form-label">🧠 Algorithm</label>
        <select
          className="form-select"
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value)}
          disabled={loading}
        >
          {algorithms.map((alg) => (
            <option key={alg} value={alg}>
              {alg === "auto" && "🔄 Auto (Smart Decision)"}
              {alg === "bfs" && "📊 BFS (Breadth-First)"}
              {alg === "dfs" && "🔗 DFS (Depth-First)"}
              {alg === "ucs" && "⚖️ UCS (Uniform Cost)"}
              {alg === "astar" && "⭐ A* (Heuristic)"}
            </option>
          ))}
        </select>
      </div>

      {/* Run Button */}
      <button
        className="btn btn-primary"
        onClick={onRunAgent}
        disabled={loading || !start || !goal}
      >
        {loading ? (
          <>
            <span className="loading"></span>
            Searching...
          </>
        ) : (
          "🚀 FIND OPTIMAL PATH"
        )}
      </button>

      {/* Error Message */}
      {error && <div className="alert-error">{error}</div>}

      {/* Result Display */}
      {result && (
        <div className="result-section">
          <div className="result-title">✨ Path Found!</div>

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

          <div className="result-item" style={{ marginTop: 12, color: "#60c864" }}>
            ✅ {result.message}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="info-text" style={{ marginTop: 30 }}>
        💡 <strong>How to use:</strong>
        <br />
        1. Select a source router
        <br />
        2. Choose a destination
        <br />
        3. Pick an algorithm or let AI decide
        <br />
        4. Click "Find Optimal Path"
        <br />
        5. Watch the magic happen on the right! 🪄
      </div>
    </div>
  );
}

export default ControlPanel;
