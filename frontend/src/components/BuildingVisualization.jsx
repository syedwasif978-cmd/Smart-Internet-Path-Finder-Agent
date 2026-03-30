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
      yStart: 120,
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
      yStart: 480,
    },
    {
      floor: 1,
      label: "Floor 1 (Open Space)",
      emoji: "👥",
      routers: ["A", "K", "L"],
      yStart: 660,
    },
    {
      floor: 0,
      label: "Server Room",
      emoji: "🖥️",
      routers: ["Goal"],
      yStart: 800,
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
          x1={cx - 12}
          y1={cy - 15}
          x2={cx - 15}
          y2={cy - 25}
          stroke={isInPath ? "#4caf50" : getTrafficColor(trafficLevel)}
          strokeWidth="2"
          className={isActive ? "antenna-pulse" : ""}
        />
        {/* Antenna 2 */}
        <line
          x1={cx + 12}
          y1={cy - 15}
          x2={cx + 15}
          y2={cy - 25}
          stroke={isInPath ? "#4caf50" : getTrafficColor(trafficLevel)}
          strokeWidth="2"
          className={isActive ? "antenna-pulse" : ""}
        />
        {/* Router body */}
        <rect
          x={cx - 16}
          y={cy - 12}
          width="32"
          height="24"
          rx="4"
          fill={isInPath ? "#81c784" : "#e8f5e9"}
          stroke={isInPath ? "#4caf50" : getTrafficColor(trafficLevel)}
          strokeWidth={isActive ? 3 : 2}
          className={isActive ? "router-glow" : ""}
        />
        {/* Router lights (indicator) */}
        <circle cx={cx - 8} cy={cy - 4} r="2" fill="#4caf50" opacity="0.8" />
        <circle cx={cx + 8} cy={cy - 4} r="2" fill={getTrafficColor(trafficLevel)} opacity="0.8" />
        {/* WiFi symbol */}
        <path
          d={`M ${cx} ${cy + 8} Q ${cx - 4} ${cy + 12} ${cx - 6} ${cy + 14}`}
          fill="none"
          stroke={isInPath ? "#4caf50" : "#2d7a3e"}
          strokeWidth="1.5"
        />
        <path
          d={`M ${cx} ${cy + 8} Q ${cx + 4} ${cy + 12} ${cx + 6} ${cy + 14}`}
          fill="none"
          stroke={isInPath ? "#4caf50" : "#2d7a3e"}
          strokeWidth="1.5"
        />
      </g>
    );
  };

  return (
    <div className="building-visualization">
      <div className="panel-header">🏢 Office Building Network</div>

      <svg className="building-svg" viewBox="0 0 1000 900">
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
        <rect x="150" y="50" width="700" height="750" rx="15" fill="url(#buildingGrad)" stroke="#4caf50" strokeWidth="3" />

        {/* Building outline */}
        <rect x="160" y="60" width="680" height="730" rx="12" fill="none" stroke="#81c784" strokeWidth="2" opacity="0.6" />

        {/* Floors with offices and routers */}
        {floors.map((floorData, idx) => (
          <g key={idx}>
            {/* Floor background/separator */}
            {idx < floors.length - 1 && (
              <>
                <line
                  x1="160"
                  y1={floorData.yStart + 140}
                  x2="840"
                  y2={floorData.yStart + 140}
                  stroke="#a5d6a7"
                  strokeWidth="2"
                  opacity="0.4"
                />
                <rect
                  x="150"
                  y={floorData.yStart + 140}
                  width="700"
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
                  x={180 + w * 90}
                  y={floorData.yStart + 20}
                  width="70"
                  height="50"
                  rx="3"
                  fill="url(#windowGrad)"
                  stroke="#4caf50"
                  strokeWidth="1"
                  opacity="0.6"
                />
                {/* Window panes */}
                <line
                  x1={180 + w * 90 + 35}
                  y1={floorData.yStart + 20}
                  x2={180 + w * 90 + 35}
                  y2={floorData.yStart + 70}
                  stroke="#4caf50"
                  strokeWidth="0.5"
                  opacity="0.4"
                />
              </g>
            ))}

            {/* Floor label */}
            <rect x="50" y={floorData.yStart + 20} width="80" height="100" rx="8" fill="#c8e6c9" stroke="#4caf50" strokeWidth="2" />
            <text x="90" y={floorData.yStart + 45} fontSize="16" fontWeight="bold" fill="#2d7a3e" textAnchor="middle">
              F{floorData.floor}
            </text>
            <text x="90" y={floorData.yStart + 75} fontSize="28" textAnchor="middle">
              {floorData.emoji}
            </text>

            {/* Routers on this floor */}
            {floorData.routers.map((router, routerIdx) => {
              const totalRouters = floorData.routers.length;
              const spacing = 500 / (totalRouters + 1);
              const xPos = 250 + (routerIdx + 1) * spacing;
              const trafficLevel = getTrafficLevel(router);
              const isInPath = isNodeInPath(router);
              const isHighlighted = isHighlightedNode(router);

              return (
                <g key={router}>
                  {/* Halo effect */}
                  {isHighlighted && (
                    <circle cx={xPos} cy={floorData.yStart + 90} r="55" fill="none" stroke="#4caf50" strokeWidth="2" opacity="0.2" className="router-halo" />
                  )}

                  {/* Office/desk indicator */}
                  <rect
                    x={xPos - 35}
                    y={floorData.yStart + 60}
                    width="70"
                    height="60"
                    rx="4"
                    fill={isInPath ? "rgba(129, 199, 132, 0.2)" : "rgba(232, 245, 242, 0.5)"}
                    stroke={isInPath ? "#4caf50" : "#a5d6a7"}
                    strokeWidth="1"
                  />

                  {/* Router icon */}
                  <RouterIcon cx={xPos} cy={floorData.yStart + 80} isActive={isHighlighted} isInPath={isInPath} trafficLevel={trafficLevel} />

                  {/* Router label */}
                  <text x={xPos} y={floorData.yStart + 130} fontSize="13" fill="#2d3436" textAnchor="middle" fontWeight="700">
                    {router}
                  </text>

                  {/* Path indicator star */}
                  {isInPath && <text x={xPos - 25} y={floorData.yStart + 65} fontSize="16" fill="#ffc107" className="path-star">
                    ⭐
                  </text>}

                  {/* Hover tooltip */}
                  {hoveredRouter === router && (
                    <g>
                      <rect
                        x={xPos - 55}
                        y={floorData.yStart - 50}
                        width="110"
                        height="45"
                        rx="6"
                        fill="#ffffff"
                        stroke="#4caf50"
                        strokeWidth="2"
                        filter="drop-shadow(0 4px 8px rgba(0,0,0,0.2))"
                      />
                      <text x={xPos} y={floorData.yStart - 35} fontSize="13" fontWeight="bold" fill="#2d7a3e" textAnchor="middle">
                        {router}
                      </text>
                      <text x={xPos} y={floorData.yStart - 18} fontSize="11" fill="#4caf50" textAnchor="middle">
                        {trafficLevel === "high" ? "🔴 High" : trafficLevel === "medium" ? "🟠 Med" : "🟢 Low"}
                      </text>
                    </g>
                  )}

                  {/* Interactive area */}
                  <circle cx={xPos} cy={floorData.yStart + 80} r="22" fill="transparent" style={{ cursor: "pointer" }} onMouseEnter={() => setHoveredRouter(router)} onMouseLeave={() => setHoveredRouter(null)} />
                </g>
              );
            })}
          </g>
        ))}

        {/* Building entrance */}
        <rect x="420" y="800" width="160" height="70" rx="8" fill="#a5d6a7" stroke="#4caf50" strokeWidth="2" />
        <text x="500" y="825" fontSize="28" textAnchor="middle" dominantBaseline="middle">
          🚪
        </text>
        <text x="500" y="855" fontSize="11" textAnchor="middle" fill="#2d7a3e" fontWeight="600">
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
