import React, { useEffect, useState } from "react";
import "./BuildingVisualization.css";

function BuildingVisualization({ graph, result, start, goal }) {
  const [hoveredRouter, setHoveredRouter] = useState(null);
  const [trafficLevels, setTrafficLevels] = useState({});
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  // Router positions overlaid on the image (x%, y% of image dimensions)
  // Positioned exactly on the white circles in the building image
  const routerPositions = {
    // Floor 4 routers - positions estimated from layout
    "C_F4": { x: 29, y: 13, router: "C", floor: 4 },
    "D_F4": { x: 50, y: 13, router: "D", floor: 4 },
    
    // Floor 3 routers - positioned on white circles
    "B_F3": { x: 27, y: 28, router: "B", floor: 3 },
    "C_F3": { x: 43, y: 28, router: "C", floor: 3 },
    "I_F3": { x: 59, y: 28, router: "I", floor: 3 },
    
    // Floor 2 routers - positioned on white circles
    "B_F2": { x: 27, y: 43, router: "B", floor: 2 },
    "F_F2": { x: 50, y: 43, router: "F", floor: 2 },
    
    // Floor 1 routers - positioned on white circles
    "A_F1": { x: 24, y: 58, router: "A", floor: 1 },
    "C_F1": { x: 43, y: 58, router: "C", floor: 1 },
    "E_F1": { x: 56, y: 58, router: "E", floor: 1 },
    
    // Floor 0 (Server) routers - positioned on white circles
    "Goal_F0": { x: 21, y: 76, router: "Goal", floor: 0 },
    "I_F0": { x: 68, y: 76, router: "I", floor: 0 },
  };

  // Generate random traffic levels
  const generateRandomTraffic = () => {
    const newTraffic = {};
    const allRouters = ["A", "B", "C", "D", "E", "F", "I", "Goal"];
    
    allRouters.forEach((router) => {
      const rand = Math.random();
      if (rand < 0.5) {
        newTraffic[router] = "low";
      } else if (rand < 0.8) {
        newTraffic[router] = "medium";
      } else {
        newTraffic[router] = "high";
      }
    });
    
    setTrafficLevels(newTraffic);
  };

  // Regenerate traffic on each search
  useEffect(() => {
    generateRandomTraffic();
  }, [result]);

  const isNodeInPath = (node) => {
    return result && result.path && result.path.includes(node);
  };

  const isHighlightedNode = (node) => {
    if (!result) return false;
    return node === start || node === goal || result.path.includes(node);
  };

  const getTrafficColor = (node) => {
    const level = trafficLevels[node];
    const colors = { low: "#2d8659", medium: "#ffc107", high: "#f44336" };
    return colors[level] || "#2d8659";
  };

  const handleImageLoad = (e) => {
    setImageSize({ width: e.target.width, height: e.target.height });
  };

  return (
    <div className="building-visualization">
      <div className="panel-header">Office Building Network</div>

      <div className="building-image-container">
        <img
          src="/building.png"
          alt="Building Layout"
          className="building-image"
          onLoad={handleImageLoad}
        />

        {/* Overlay routers on the image */}
        <div className="routers-overlay">
          {Object.values(routerPositions).map((pos) => {
            const router = pos.router;
            const isInPath = isNodeInPath(router);
            const isHighlighted = isHighlightedNode(router);
            const trafficColor = getTrafficColor(router);

            return (
              <React.Fragment key={`${pos.floor}-${router}`}>
                {/* Traffic Badge */}
                <div
                  style={{
                    position: "absolute",
                    left: `${pos.x}%`,
                    top: `calc(${pos.y}% - 22px)`,
                    transform: "translateX(12px)",
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    background: trafficColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "9px",
                    fontWeight: "bold",
                    color: "white",
                    boxShadow: `0 2px 8px rgba(0,0,0,0.2)`,
                    zIndex: 11,
                  }}
                >
                  {trafficLevels[router]?.substring(0, 1).toUpperCase() || "?"}
                </div>

                {/* Router Icon */}
                <div
                  style={{
                    position: "absolute",
                    left: `${pos.x}%`,
                    top: `${pos.y}%`,
                    transform: "translate(-50%, -50%)",
                    width: "16px",
                    height: "16px",
                    background: isInPath ? "#a8d5ba" : "#e8f5f0",
                    border: `2px solid ${trafficColor}`,
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "10px",
                    fontWeight: "bold",
                    color: trafficColor,
                    boxShadow: isInPath ? `0 0 12px ${trafficColor}` : "none",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                    zIndex: 10,
                  }}
                  className={isInPath ? "path-router-overlay" : ""}
                  onMouseEnter={() => setHoveredRouter(router)}
                  onMouseLeave={() => setHoveredRouter(null)}
                  title={`Router ${router} - ${trafficLevels[router]?.toUpperCase() || "UNKNOWN"} Traffic`}
                >
                  📶
                </div>

                {/* Blinking Star for Path */}
                {isInPath && (
                  <div
                    style={{
                      position: "absolute",
                      left: `calc(${pos.x}% + 16px)`,
                      top: `calc(${pos.y}% - 8px)`,
                      fontSize: "16px",
                      animation: "blinkStar 0.6s infinite",
                      zIndex: 12,
                      pointerEvents: "none",
                    }}
                    className="path-star"
                  >
                    ⭐
                  </div>
                )}

                {/* Router Label */}
                <div
                  style={{
                    position: "absolute",
                    left: `${pos.x}%`,
                    top: `calc(${pos.y}% + 12px)`,
                    transform: "translateX(-50%)",
                    fontSize: "12px",
                    fontWeight: "bold",
                    color: "#0f4f57",
                    background: "rgba(255,255,255,0.9)",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    minWidth: "16px",
                    textAlign: "center",
                    zIndex: 11,
                    pointerEvents: "none",
                  }}
                >
                  {router}
                </div>

                {/* Hover Halo */}
                {hoveredRouter === router && (
                  <div
                    style={{
                      position: "absolute",
                      left: `${pos.x}%`,
                      top: `${pos.y}%`,
                      transform: "translate(-50%, -50%)",
                      width: "40px",
                      height: "40px",
                      border: `2px solid ${trafficColor}`,
                      borderRadius: "50%",
                      opacity: 0.5,
                      pointerEvents: "none",
                      animation: "pulseHalo 1s infinite",
                      zIndex: 9,
                    }}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="building-legend">
        <div className="legend-item">
          <div style={{ width: "12px", height: "12px", background: "#2d8659", borderRadius: "2px" }}></div>
          <span>Low Traffic</span>
        </div>
        <div className="legend-item">
          <div style={{ width: "12px", height: "12px", background: "#ffc107", borderRadius: "2px" }}></div>
          <span>Medium Traffic</span>
        </div>
        <div className="legend-item">
          <div style={{ width: "12px", height: "12px", background: "#f44336", borderRadius: "2px" }}></div>
          <span>High Traffic</span>
        </div>
        <div className="legend-item">
          <span style={{ fontSize: "18px", marginRight: "5px" }}>⭐</span>
          <span>In Path</span>
        </div>
      </div>
    </div>
  );
}

export default BuildingVisualization;
