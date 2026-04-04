import React from "react";
import "./AlgorithmComparison.css";

function AlgorithmComparison({ result, selectedAlgorithm }) {
  if (!result || !result.algorithm_comparison) {
    return null;
  }

  const { algorithm_comparison, algorithm: selected } = result;
  
  // Sort algorithms by efficiency (nodes explored)
  const sortedAlgorithms = Object.entries(algorithm_comparison).sort(
    (a, b) => a[1].nodes_explored - b[1].nodes_explored
  );

  const getAlgorithmName = (key) => {
    const names = {
      bfs: "BFS",
      dfs: "DFS",
      ucs: "UCS",
      astar: "A*",
    };
    return names[key] || key.toUpperCase();
  };

  const getAlgorithmDescription = (key) => {
    const descriptions = {
      bfs: "Breadth-First Search",
      dfs: "Depth-First Search",
      ucs: "Uniform Cost Search",
      astar: "A* Heuristic Search",
    };
    return descriptions[key] || key;
  };

  const getAlgorithmIcon = (key) => {
    const icons = {
      bfs: "🔄",
      dfs: "🌳",
      ucs: "⚖️",
      astar: "🎯",
    };
    return icons[key] || "🔍";
  };

  // Calculate efficiency score (lower is better)
  const maxNodes = Math.max(...sortedAlgorithms.map(([_, data]) => data.nodes_explored));
  const efficiencyScore = (nodes) => {
    return Math.round(((maxNodes - nodes) / maxNodes) * 100);
  };

  return (
    <div className="algorithm-comparison-section">
      <div className="comparison-header">
        <h3 className="comparison-title">Algorithm Performance Comparison</h3>
        <p className="comparison-subtitle">
          Analyzing how each algorithm performed on the same search
        </p>
      </div>

      <div className="comparison-table-wrapper">
        <table className="comparison-table">
          <thead>
            <tr>
              <th className="col-algorithm">Algorithm</th>
              <th className="col-nodes">
                <span className="col-header-icon">📍</span> Nodes Visited
              </th>
              <th className="col-cost">
                <span className="col-header-icon">💰</span> Path Cost
              </th>
              <th className="col-efficiency">
                <span className="col-header-icon">⚡</span> Efficiency
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedAlgorithms.map(([key, data]) => {
              const isSelected = key === selected.toLowerCase();
              const efficiency = efficiencyScore(data.nodes_explored);

              return (
                <tr
                  key={key}
                  className={`comparison-row ${isSelected ? "selected" : ""}`}
                >
                  <td className="col-algorithm">
                    <div className="algorithm-name-cell">
                      <span className="algorithm-text">{getAlgorithmName(key)}</span>
                    </div>
                  </td>
                  <td className="col-nodes">
                    <div className="nodes-badge">
                      {data.nodes_explored}
                      {isSelected && <span className="selected-badge">✓</span>}
                    </div>
                  </td>
                  <td className="col-cost">
                    <span className="cost-value">{data.cost?.toFixed(2) || "N/A"}</span>
                  </td>
                  <td className="col-efficiency">
                    <div className="efficiency-bar">
                      <div
                        className="efficiency-fill"
                        style={{ width: `${efficiency}%` }}
                      ></div>
                      <span className="efficiency-text">{efficiency}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Summary Insights */}
      <div className="comparison-insights">
        <div className="insight-item">
          <div className="insight-icon">🏆</div>
          <div className="insight-content">
            <h4>Most Efficient</h4>
            <p>
              {getAlgorithmName(sortedAlgorithms[0][0])} explored{" "}
              <strong>{sortedAlgorithms[0][1].nodes_explored}</strong> nodes
            </p>
          </div>
        </div>

        <div className="insight-item">
          <div className="insight-icon">📊</div>
          <div className="insight-content">
            <h4>Your Selection</h4>
            <p>
              {getAlgorithmName(selected)} explored{" "}
              <strong>
                {
                  algorithm_comparison[selected.toLowerCase()]?.nodes_explored
                }
              </strong>{" "}
              nodes
            </p>
          </div>
        </div>

        <div className="insight-item">
          <div className="insight-icon">💡</div>
          <div className="insight-content">
            <h4>Insight</h4>
            <p>
              {sortedAlgorithms[0][0].toUpperCase()} is the most efficient for this search
              topology with minimal node exploration.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AlgorithmComparison;
