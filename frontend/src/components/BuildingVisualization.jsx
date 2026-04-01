import React, { useEffect, useState, useRef } from "react";
import "./BuildingVisualization.css";

function BuildingVisualization({ graph, result, start, goal }) {
  const [hoveredRouter, setHoveredRouter] = useState(null);
  const [trafficLevels, setTrafficLevels] = useState({});
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [scale, setScale] = useState(90); // percent scale for the building image (default smaller)

  // Default router positions overlaid on the image (x%, y% of image dimensions)
  const defaultPositions = {
    // Floor 4
    C_F4: { x: 40, y: 12, router: "C", floor: 4 },
    D_F4: { x: 60, y: 12, router: "D", floor: 4 },

    // Floor 3
    B_F3: { x: 28, y: 28, router: "B", floor: 3 },
    C_F3: { x: 50, y: 28, router: "C", floor: 3 },
    I_F3: { x: 72, y: 28, router: "I", floor: 3 },

    // Floor 2
    B_F2: { x: 35, y: 44, router: "B", floor: 2 },
    F_F2: { x: 65, y: 44, router: "F", floor: 2 },

    // Floor 1
    A_F1: { x: 28, y: 60, router: "A", floor: 1 },
    C_F1: { x: 50, y: 60, router: "C", floor: 1 },
    E_F1: { x: 72, y: 60, router: "E", floor: 1 },

    // Floor 0 (Server)
    Goal_F0: { x: 38, y: 78, router: "Goal", floor: 0 },
    I_F0: { x: 68, y: 78, router: "I", floor: 0 },
    // Additional routers added so all alphabet routers are visible
    G_F3: { x: 75, y: 34, router: "G", floor: 3 },
    H_F2: { x: 58, y: 46, router: "H", floor: 2 },
    J_F0: { x: 78, y: 80, router: "J", floor: 0 },
    K_F1: { x: 18, y: 62, router: "K", floor: 1 },
    L_F4: { x: 88, y: 12, router: "L", floor: 4 },
  };

  const [positions, setPositions] = useState(defaultPositions);
  const imgRef = useRef(null);

  // Generate random traffic levels
  const generateRandomTraffic = () => {
    const newTraffic = {};
    const allRouters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "Goal"];

    allRouters.forEach((r) => {
      const rand = Math.random();
      if (rand < 0.5) newTraffic[r] = "low";
      else if (rand < 0.85) newTraffic[r] = "medium";
      else newTraffic[r] = "high";
    });

    setTrafficLevels(newTraffic);
  };

  // Regenerate traffic on each search result change
  useEffect(() => {
    generateRandomTraffic();
  }, [result]);

  // Try to load saved positions from backend on mount (if user saved them previously)
  useEffect(() => {
    fetch('/load-router-positions')
      .then((r) => r.json())
      .then((data) => {
        if (data && data.positions && Object.keys(data.positions).length > 0) {
          setPositions(data.positions);
        }
      })
      .catch(() => {});
  }, []);

  const isNodeInPath = (node) => {
    return result && result.path && result.path.includes(node);
  };

  const isHighlightedNode = (node) => {
    if (!result) return false;
    return node === start || node === goal || (result.path && result.path.includes(node));
  };

  const getTrafficColor = (node) => {
    const level = trafficLevels[node];
    const colors = { low: "#2d8659", medium: "#ffc107", high: "#f44336" };
    return colors[level] || "#2d8659";
  };

  const handleImageLoad = (e) => {
    setImageSize({ width: e.target.naturalWidth, height: e.target.naturalHeight });
  };

  return (
    <div className="building-visualization">
      <div className="panel-header">Office Building Network</div>

      {/* Image size control for fine-tuning overlay alignment */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: 8 }}>
        <label style={{ fontSize: 12, color: "#2d2d2d", minWidth: 80 }}>Image size</label>
        <input type="range" min={60} max={110} value={scale} onChange={(e) => setScale(Number(e.target.value))} />
        <span style={{ fontSize: 12, color: "#2d2d2d", minWidth: 36, textAlign: "right" }}>{scale}%</span>
      </div>

      <div className="building-image-container">
        <img ref={imgRef} src="/building.png" alt="Building Layout" className="building-image" onLoad={handleImageLoad} style={{ width: `${scale}%`, maxWidth: "100%" }} />

        {/* Overlay routers on the image */}
        <div className="routers-overlay">
          {Object.entries(positions).map(([key, pos]) => {
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
                    top: `calc(${pos.y}% - 28px)`,
                    transform: "translateX(10px)",
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                    background: trafficColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "11px",
                    fontWeight: "700",
                    color: "white",
                    boxShadow: `0 2px 10px rgba(0,0,0,0.18)`,
                    zIndex: 14,
                  }}
                >
                  {trafficLevels[router]?.substring(0, 1).toUpperCase() || "?"}
                </div>

                {/* Router Icon (large, labeled) */}
                <div
                  style={{
                    position: "absolute",
                    left: `${pos.x}%`,
                    top: `${pos.y}%`,
                    transform: "translate(-50%, -50%)",
                    width: "34px",
                    height: "34px",
                    background: "#ffffff",
                    border: `3px solid ${trafficColor}`,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "14px",
                    fontWeight: "800",
                    color: trafficColor,
                    boxShadow: isInPath ? `0 0 18px ${trafficColor}` : `0 2px 8px rgba(0,0,0,0.12)`,
                    transition: "all 0.18s ease",
                    cursor: editMode ? "grabbing" : "pointer",
                    zIndex: 13,
                  }}
                  className={isInPath ? "path-router-overlay router-marker" : "router-position-wrapper router-marker"}
                  onMouseEnter={() => setHoveredRouter(router)}
                  onMouseLeave={() => setHoveredRouter(null)}
                  title={`Router ${router} - ${trafficLevels[router]?.toUpperCase() || "UNKNOWN"} Traffic`}
                >
                  {router}
                </div>

                {/* Blinking Star for Path */}
                {isInPath && (
                  <div
                    style={{
                      position: "absolute",
                      left: `calc(${pos.x}% + 20px)`,
                      top: `calc(${pos.y}% - 12px)`,
                      fontSize: "18px",
                      animation: "blinkStar 0.6s infinite",
                      zIndex: 15,
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
                    top: `calc(${pos.y}% + 26px)`,
                    transform: "translateX(-50%)",
                    fontSize: "12px",
                    fontWeight: "700",
                    color: "#0f4f57",
                    background: "rgba(255,255,255,0.95)",
                    padding: "2px 6px",
                    borderRadius: "6px",
                    minWidth: "20px",
                    textAlign: "center",
                    zIndex: 12,
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
                      width: "56px",
                      height: "56px",
                      border: `3px solid ${trafficColor}`,
                      borderRadius: "50%",
                      opacity: 0.35,
                      pointerEvents: "none",
                      animation: "pulseHalo 1s infinite",
                      zIndex: 11,
                    }}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Positions are loaded from saved file; editing disabled in this build */}

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
