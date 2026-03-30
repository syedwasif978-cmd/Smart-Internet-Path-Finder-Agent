import React, { useEffect, useState } from "react";
import "./BuildingVisualization.css";

function BuildingVisualization({ graph, result, start, goal }) {
  const [hoveredRouter, setHoveredRouter] = useState(null);

  // Floor structure: distribute 12 routers across 4 floors
  const floors = [
    {
      floor: 4,
      label: "Floor 4 (Executives)",
      emoji: "👔",
      routers: ["G", "H"],
      yStart: 80,
    },
    {
      floor: 3,
      label: "Floor 3 (Management)",
      emoji: "👨‍💼",
      routers: ["D", "E", "F"],
      yStart: 300,
    },
    {
      floor: 2,
      label: "Floor 2 (Development)",
      emoji: "💻",
      routers: ["B", "C", "I", "J"],
      yStart: 520,
    },
    {
      floor: 1,
      label: "Floor 1 (Open Space)",
      emoji: "👥",
      routers: ["A", "K", "L"],
      yStart: 740,
    },
    {
      floor: 0,
      label: "Server Room",
      emoji: "🖥️",
      routers: ["Goal"],
      yStart: 930,
    },
  ];

  const getTrafficLevel = (node) => {
    if (!graph[node]) return "low";
    const weights = Object.values(graph[node]);
    if (weights.length === 0) return "low";
    const avgWeight = weights.reduce((a, b) => a + b, 0) / weights.length;
    if (avgWeight < 2) return "low";
    if (avgWeight < 3) return "medium";
    return "high";
  };

  const isNodeInPath = (node) => {
    return result && result.path && result.path.includes(node);
  };

  const isHighlightedNode = (node) => {
    if (!result) return false;
    return node === start || node === goal || result.path.includes(node);
  };

  const getTrafficColor = (level) => {
    const colors = { low: "#4caf50", medium: "#ffc107", high: "#f44336" };
    return colors[level] || colors.low;
  };

  // SVG Router Icon Component
  const RouterIcon = ({ cx, cy, isActive, isInPath, trafficLevel }) => {
    return (
      <g>
        {/* Antenna 1 */}
        <line
          x1={cx - 16}
          y1={cy - 20}
          x2={cx - 20}
          y2={cy - 35}
          stroke={isInPath ? "#4caf50" : getTrafficColor(trafficLevel)}
          strokeWidth="3"
          className={isActive ? "antenna-pulse" : ""}
        />
        {/* Antenna 2 */}
        <line
          x1={cx + 16}
          y1={cy - 20}
          x2={cx + 20}
          y2={cy - 35}
          stroke={isInPath ? "#4caf50" : getTrafficColor(trafficLevel)}
          strokeWidth="3"
          className={isActive ? "antenna-pulse" : ""}
        />
        {/* Router body */}
        <rect
          x={cx - 22}
          y={cy - 16}
          width="44"
          height="32"
          rx="5"
          fill={isInPath ? "#81c784" : "#e8f5e9"}
          stroke={isInPath ? "#4caf50" : getTrafficColor(trafficLevel)}
          strokeWidth={isActive ? 4 : 3}
          className={isActive ? "router-glow" : ""}
        />
        {/* Router lights (indicator) */}
        <circle cx={cx - 10} cy={cy - 4} r="3" fill="#4caf50" opacity="0.8" />
        <circle cx={cx + 10} cy={cy - 4} r="3" fill={getTrafficColor(trafficLevel)} opacity="0.8" />
        {/* WiFi symbol */}
        <path
          d={`M ${cx} ${cy + 10} Q ${cx - 5} ${cy + 15} ${cx - 8} ${cy + 18}`}
          fill="none"
          stroke={isInPath ? "#4caf50" : "#2d7a3e"}
          strokeWidth="2"
        />
        <path
          d={`M ${cx} ${cy + 10} Q ${cx + 5} ${cy + 15} ${cx + 8} ${cy + 18}`}
          fill="none"
          stroke={isInPath ? "#4caf50" : "#2d7a3e"}
          strokeWidth="2"
        />
      </g>
    );
  };

  return (
    <div className="building-visualization">
      <div className="panel-header">🏢 Office Building Network</div>

      <svg className="building-svg" viewBox="0 0 1300 1250">
        <defs>
          <linearGradient id="buildingGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: "#d4edda", stopOpacity: 0.9 }} />
            <stop offset="100%" style={{ stopColor: "#c3e6cb", stopOpacity: 0.9 }} />
          </linearGradient>

          <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <linearGradient id="windowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: "#b3e5fc", stopOpacity: 0.4 }} />
            <stop offset="100%" style={{ stopColor: "#81d4fa", stopOpacity: 0.6 }} />
          </linearGradient>
        </defs>

        {/* Building base */}
        <rect x="160" y="60" width="980" height="1130" rx="20" fill="url(#buildingGrad)" stroke="#4caf50" strokeWidth="4" />

        {/* Building outline */}
        <rect x="190" y="80" width="920" height="1080" rx="15" fill="none" stroke="#81c784" strokeWidth="3" opacity="0.6" />

        {/* Floors with offices and routers */}
        {floors.map((floorData, idx) => (
          <g key={idx}>
            {/* Floor separator line */}
            {idx < floors.length - 1 && (
              <>
                <line
                  x1="190"
                  y1={floorData.yStart + 220}
                  x2="1090"
                  y2={floorData.yStart + 220}
                  stroke="#a5d6a7"
                  strokeWidth="3"
                  opacity="0.4"
                />
                <rect
                  x="175"
                  y={floorData.yStart + 220}
                  width="930"
                  height="2"
                  fill="#81c784"
                  opacity="0.3"
                />
              </>
            )}

            {/* Windows grid for each floor */}
            {[...Array(7)].map((_, w) => (
              <g key={w}>
                {/* Window */}
                <rect
                  x={200 + w * 126}
                  y={floorData.yStart + 15}
                  width="100"
                  height="75"
                  rx="4"
                  fill="url(#windowGrad)"
                  stroke="#4caf50"
                  strokeWidth="2"
                  opacity="0.6"
                />
                {/* Window panes */}
                <line
                  x1={200 + w * 126 + 50}
                  y1={floorData.yStart + 15}
                  x2={200 + w * 126 + 50}
                  y2={floorData.yStart + 90}
                  stroke="#4caf50"
                  strokeWidth="1"
                  opacity="0.4"
                />
              </g>
            ))}

            {/* Floor label */}
            <rect x="30" y={floorData.yStart + 5} width="120" height="210" rx="10" fill="#c8e6c9" stroke="#4caf50" strokeWidth="3" />
            <text x="90" y={floorData.yStart + 50} fontSize="22" fontWeight="bold" fill="#2d7a3e" textAnchor="middle">
              F{floorData.floor}
            </text>
            <text x="90" y={floorData.yStart + 110} fontSize="42" textAnchor="middle">
              {floorData.emoji}
            </text>

            {/* Routers on this floor */}
            {floorData.routers.map((router, routerIdx) => {
              const totalRouters = floorData.routers.length;
              // Calculate spacing based on number of routers per floor
              const spacing = totalRouters === 2 ? 250 : totalRouters === 3 ? 200 : 160;
              const startX = totalRouters === 2 ? 400 : totalRouters === 3 ? 370 : 340;
              const xPos = startX + routerIdx * spacing;
              const trafficLevel = getTrafficLevel(router);
              const isInPath = isNodeInPath(router);
              const isHighlighted = isHighlightedNode(router);

              return (
                <g key={router}>
                  {/* Halo effect */}
                  {isHighlighted && (
                    <circle cx={xPos} cy={floorData.yStart + 130} r="65" fill="none" stroke="#4caf50" strokeWidth="3" opacity="0.2" className="router-halo" />
                  )}

                  {/* Office/desk indicator */}
                  <rect
                    x={xPos - 42}
                    y={floorData.yStart + 90}
                    width="84"
                    height="80"
                    rx="5"
                    fill="#ffffff"
                    stroke={isInPath ? "#4caf50" : "#c8e6c9"}
                    strokeWidth="2"
                    opacity="0.95"
                  />

                  {/* Router icon */}
                  <RouterIcon cx={xPos} cy={floorData.yStart + 120} isActive={isHighlighted} isInPath={isInPath} trafficLevel={trafficLevel} />

                  {/* Router label */}
                  <text x={xPos} y={floorData.yStart + 190} fontSize="18" fill="#2d3436" textAnchor="middle" fontWeight="700">
                    {router}
                  </text>

                  {/* Path indicator star */}
                  {isInPath && <text x={xPos - 30} y={floorData.yStart + 95} fontSize="20" fill="#ffc107" className="path-star">
                    ⭐
                  </text>}

                  {/* Hover tooltip */}
                  {hoveredRouter === router && (
                    <g>
                      <rect
                        x={xPos - 70}
                        y={floorData.yStart - 70}
                        width="140"
                        height="60"
                        rx="8"
                        fill="#ffffff"
                        stroke="#4caf50"
                        strokeWidth="2"
                        filter="drop-shadow(0 4px 8px rgba(0,0,0,0.2))"
                      />
                      <text x={xPos} y={floorData.yStart - 45} fontSize="16" fontWeight="bold" fill="#2d7a3e" textAnchor="middle">
                        {router}
                      </text>
                      <text x={xPos} y={floorData.yStart - 23} fontSize="14" fill="#4caf50" textAnchor="middle">
                        {trafficLevel === "high" ? "🔴 High" : trafficLevel === "medium" ? "🟠 Med" : "🟢 Low"}
                      </text>
                    </g>
                  )}

                  {/* Interactive area */}
                  <circle cx={xPos} cy={floorData.yStart + 120} r="28" fill="transparent" style={{ cursor: "pointer" }} onMouseEnter={() => setHoveredRouter(router)} onMouseLeave={() => setHoveredRouter(null)} />
                </g>
              );
            })}
          </g>
        ))}

        {/* Building entrance */}
        <rect x="540" y="1050" width="220" height="90" rx="10" fill="#a5d6a7" stroke="#4caf50" strokeWidth="3" />
        <text x="650" y="1080" fontSize="36" textAnchor="middle" dominantBaseline="middle">
          🚪
        </text>
        <text x="650" y="1125" fontSize="16" textAnchor="middle" fill="#2d7a3e" fontWeight="600">
          Entrance
        </text>
      </svg>

      {/* Legend */}
      <div className="building-legend">
        <div className="legend-item">
          <div className="legend-box" style={{ background: "#4caf50" }}></div>
          <span>Low Traffic</span>
        </div>
        <div className="legend-item">
          <div className="legend-box" style={{ background: "#ffc107" }}></div>
          <span>Medium Traffic</span>
        </div>
        <div className="legend-item">
          <div className="legend-box" style={{ background: "#f44336" }}></div>
          <span>High Traffic</span>
        </div>
        <div className="legend-item">
          <span>⭐ In Path</span>
        </div>
      </div>
    </div>
  );
}

export default BuildingVisualization;
