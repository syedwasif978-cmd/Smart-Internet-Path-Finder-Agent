import React, { useEffect, useRef, useState } from "react";
import "./NetworkVisualization.css";

function NetworkVisualization({ nodes, graph, result, start, goal }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const positionsRef = useRef({}); 
  const prevGraphRef = useRef(null);
  const animationRef = useRef(0); // for pulsing animation
  const [positions, setPositions] = useState({});
  const [hoveredNode, setHoveredNode] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [canvasSize, setCanvasSize] = useState({ width: 600, height: 400 });
  const [trafficDensity, setTrafficDensity] = useState({}); // Real traffic percentages
  const [layout, setLayout] = useState('tree');

  const pathNodes = result?.path || [];

  // Fetch real-time traffic density from backend
  useEffect(() => {
    const fetchTraffic = async () => {
      try {
        const nodeList = nodes && nodes.length ? nodes : Object.keys(graph || {});
        const traffic = {};

        let minWeight = Number.POSITIVE_INFINITY;
        let maxWeight = Number.NEGATIVE_INFINITY;
        if (graph) {
          Object.values(graph).forEach((neighbors) => {
            Object.values(neighbors).forEach((weight) => {
              if (typeof weight === 'number') {
                minWeight = Math.min(minWeight, weight);
                maxWeight = Math.max(maxWeight, weight);
              }
            });
          });
        }

        if (!Number.isFinite(minWeight) || !Number.isFinite(maxWeight)) {
          minWeight = 0;
          maxWeight = 10;
        }

        nodeList.forEach(node => {
          let totalWeight = 0;
          let edgeCount = 0;

          if (graph && graph[node]) {
            Object.values(graph[node]).forEach(weight => {
              totalWeight += weight || 0;
              edgeCount++;
            });
          }

          const avgWeight = edgeCount > 0 ? totalWeight / edgeCount : 0;
          let normalized = maxWeight > minWeight ? (avgWeight - minWeight) / (maxWeight - minWeight) : avgWeight / 10;
          normalized = Math.min(1, Math.max(0, normalized));
          // Use gamma curve to compress mid/high values so most nodes appear lower (more green)
          const gamma = 2.0;
          traffic[node] = Math.round(Math.pow(normalized, gamma) * 100);
        });

        setTrafficDensity(traffic);
      } catch (err) {
        console.error("Error calculating traffic:", err);
      }
    };

    fetchTraffic();
    const interval = setInterval(fetchTraffic, 1000); // Update every second
    return () => clearInterval(interval);
  }, [nodes, graph]);

  // Initialize positions for all nodes. Prefer saved fixed positions (from backend)
  // and fall back to the tree layout if none are found.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const container = containerRef.current;
    const targetHeight = 520;
    const targetWidth = container ? Math.max(500, container.getBoundingClientRect().width - 20) : 800;
    setCanvasSize({ width: targetWidth, height: targetHeight });
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const width = canvas.width;
    const height = canvas.height;

    const nodeList = nodes && nodes.length ? nodes : Object.keys(graph || {});

    const applyTreeLayout = () => {
      const newPositions = {};
      const visited = new Set();
      const levels = {};
      const queue = [{ node: 'Goal', level: 0 }];

      while (queue.length > 0) {
        const { node, level } = queue.shift();
        if (visited.has(node)) continue;
        visited.add(node);
        levels[node] = level;

        if (graph && graph[node]) {
          Object.keys(graph[node]).forEach((neighbor) => {
            if (!visited.has(neighbor)) {
              queue.push({ node: neighbor, level: level + 1 });
            }
          });
        }
      }

      nodeList.forEach((node) => {
        if (!visited.has(node)) {
          levels[node] = Math.max(...Object.values(levels), 0) + 1;
        }
      });

      const levelCounts = {};
      Object.values(levels).forEach((level) => {
        levelCounts[level] = (levelCounts[level] || 0) + 1;
      });

      const levelIndices = {};
      nodeList.forEach((node) => {
        const level = levels[node];
        levelIndices[level] = (levelIndices[level] || 0) + 1;
        const indexInLevel = levelIndices[level] - 1;
        const countAtLevel = levelCounts[level];

        const y = 60 + level * (height / Math.max(3, Object.keys(levelCounts).length));
        const x = (indexInLevel + 0.5) * (width / Math.max(1, countAtLevel));

        newPositions[node] = { x, y };
      });

      positionsRef.current = newPositions;
      setPositions(newPositions);
      prevGraphRef.current = JSON.stringify(graph || {});
    };

    // Try to load saved positions from the backend; saved positions use percentage
    // coordinates (0-100). Map them to canvas pixels. If none exist, use tree layout.
    fetch('/load-router-positions')
      .then((r) => r.json())
      .then((data) => {
        const saved = data && data.positions ? data.positions : {};
        if (saved && Object.keys(saved).length > 0) {
          const newPositions = {};
          const routerSeen = {};

          // saved is a dict like { "C_F4": { x: 70.29, y: 28.14, router: "C", floor: 4 }, ... }
          Object.values(saved).forEach((entry) => {
            const router = entry.router || entry.name;
            if (!router) return;
            if (routerSeen[router]) return; // keep first occurrence
            routerSeen[router] = true;
            const px = Math.round((entry.x / 100) * width);
            const py = Math.round((entry.y / 100) * height);
            newPositions[router] = { x: px, y: py };
          });

          // Fill missing nodes with fallback positions
          nodeList.forEach((n, idx) => {
            if (!newPositions[n]) {
              const x = ((idx + 0.5) / Math.max(1, nodeList.length)) * width;
              const y = height - 80;
              newPositions[n] = { x, y };
            }
          });

          positionsRef.current = newPositions;
          setPositions(newPositions);
          prevGraphRef.current = JSON.stringify(graph || {});
        } else {
          applyTreeLayout();
        }
      })
      .catch((err) => {
        console.error("Failed to load saved router positions; using tree layout", err);
        applyTreeLayout();
      });
  }, [nodes, JSON.stringify(graph)]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (canvas && container) {
        const { width, height } = container.getBoundingClientRect();
        const newWidth = width - 20;
        const newHeight = height - 80;
        setCanvasSize({ width: newWidth, height: newHeight });
        canvas.width = newWidth;
        canvas.height = newHeight;
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Animation loop for pulsing effects
  useEffect(() => {
    let animationId;
    const animate = () => {
      animationRef.current = (animationRef.current + 0.02) % (Math.PI * 2);
      animationId = requestAnimationFrame(animate);
    };
    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);

  // Main canvas drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || Object.keys(positions).length === 0) return;

    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    // Compute categories by quantiles (20% high, 30% medium, 50% low)
    const categories = {};
    const catNodes = Object.keys(positions);
    if (catNodes.length > 0) {
      const vals = catNodes.map((n) => trafficDensity[n] || 0);
      const sorted = vals.slice().sort((a, b) => b - a);
      const nNodes = catNodes.length;
      let highCount = Math.round(nNodes * 0.2);
      let medCount = Math.round(nNodes * 0.3);
      if (highCount + medCount > nNodes) medCount = nNodes - highCount;
      const highThreshold = highCount > 0 ? sorted[highCount - 1] : Number.POSITIVE_INFINITY;
      const medThreshold = highCount + medCount > 0 ? sorted[highCount + medCount - 1] : -1;
      catNodes.forEach((node) => {
        const v = trafficDensity[node] || 0;
        if (v >= highThreshold) categories[node] = "high";
        else if (v >= medThreshold) categories[node] = "medium";
        else categories[node] = "low";
      });
    }

    // Beautiful gradient background
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "rgba(240, 250, 250, 0.5)");
    gradient.addColorStop(1, "rgba(224, 242, 240, 0.5)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    const drawnEdges = new Set();

    // Draw all edges first with gradient effect
    if (Object.keys(graph).length > 0) {
      Object.keys(graph).forEach((u) => {
        const nbrs = graph[u] || {};
        Object.keys(nbrs).forEach((v) => {
          if (!positions[u] || !positions[v]) return;
          if (u > v) return;

          const fromPos = positions[u];
          const toPos = positions[v];
          const weight = nbrs[v];

          const dx = toPos.x - fromPos.x;
          const dy = toPos.y - fromPos.y;
          const angle = Math.atan2(dy, dx);

          const nodeRadius = 40;
          const startX = fromPos.x + Math.cos(angle) * nodeRadius;
          const startY = fromPos.y + Math.sin(angle) * nodeRadius;
          const endX = toPos.x - Math.cos(angle) * nodeRadius;
          const endY = toPos.y - Math.sin(angle) * nodeRadius;

          // Edge gradient
          const edgeGradient = ctx.createLinearGradient(startX, startY, endX, endY);
          const edgeColor = weight < 3 ? ['#4caf50', '#81c784'] : weight < 6 ? ['#ffc107', '#ffb300'] : ['#ff6f00', '#ff5722'];
          edgeGradient.addColorStop(0, edgeColor[0]);
          edgeGradient.addColorStop(1, edgeColor[1]);

          ctx.beginPath();
          ctx.strokeStyle = edgeGradient;
          ctx.lineWidth = 2.5;
          ctx.lineCap = 'round';
          ctx.moveTo(startX, startY);
          ctx.lineTo(endX, endY);
          ctx.stroke();
        });
      });
    }

    // Draw path with animation
    if (pathNodes && pathNodes.length > 0) {
      for (let i = 0; i < pathNodes.length - 1; i++) {
        const from = pathNodes[i];
        const to = pathNodes[i + 1];
        if (!positions[from] || !positions[to]) continue;
        if (!graph[from] || !graph[from][to]) continue;

        const fromPos = positions[from];
        const toPos = positions[to];
        const dx = toPos.x - fromPos.x;
        const dy = toPos.y - fromPos.y;
        const angle = Math.atan2(dy, dx);

        const nodeRadius = 40;
        const startX = fromPos.x + Math.cos(angle) * nodeRadius;
        const startY = fromPos.y + Math.sin(angle) * nodeRadius;
        const endX = toPos.x - Math.cos(angle) * nodeRadius;
        const endY = toPos.y - Math.sin(angle) * nodeRadius;

        // Glowing path animation
        const glowAlpha = 0.7 + 0.3 * Math.sin(animationRef.current);
        ctx.beginPath();
        ctx.strokeStyle = `rgba(255, 111, 0, ${glowAlpha})`;
        ctx.lineWidth = 8;
        ctx.lineCap = 'round';
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        // Solid path on top
        ctx.beginPath();
        ctx.strokeStyle = '#ff6f00';
        ctx.lineWidth = 5;
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        // Arrow head
        const arrowSize = 15;
        ctx.beginPath();
        ctx.fillStyle = '#ff6f00';
        ctx.moveTo(endX, endY);
        ctx.lineTo(endX - arrowSize * Math.cos(angle - Math.PI / 6), endY - arrowSize * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(endX - arrowSize * Math.cos(angle + Math.PI / 6), endY - arrowSize * Math.sin(angle + Math.PI / 6));
        ctx.closePath();
        ctx.fill();
      }
    }

    // Draw all nodes as stylized routers with antenna
    Object.keys(positions).forEach((node) => {
      const pos = positions[node];
      if (!pos) return;

      const isStart = node === start;
      const isGoal = node === goal;
      const isInPath = pathNodes.includes(node);
      const isHovered = hoveredNode === node;

      const traffic = trafficDensity[node] || 0;
      const pulseEffectSize = isHovered ? 8 : 4;
      const pulseOpacity = 0.5 + 0.5 * Math.sin(animationRef.current);

      // Pulsing aura
      if (isInPath || isHovered) {
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 40 + pulseEffectSize, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 111, 0, ${pulseOpacity * 0.4})`;
        ctx.lineWidth = 3;
        ctx.stroke();
      }

      // Node body (rectangle like a router)
      const routerWidth = 36;
      const routerHeight = 28;
      const cornerRadius = 6;

      // Background gradient
      let bgGradient = ctx.createLinearGradient(pos.x - routerWidth / 2, pos.y - routerHeight / 2, pos.x + routerWidth / 2, pos.y + routerHeight / 2);
      if (isGoal) {
        bgGradient.addColorStop(0, '#ff9800');
        bgGradient.addColorStop(1, '#ff6f00');
      } else if (isStart) {
        bgGradient.addColorStop(0, '#4caf50');
        bgGradient.addColorStop(1, '#388e3c');
      } else if (isInPath) {
        bgGradient.addColorStop(0, '#66bb6a');
        bgGradient.addColorStop(1, '#4caf50');
      } else {
        bgGradient.addColorStop(0, '#64b5f6');
        bgGradient.addColorStop(1, '#42a5f5');
      }

      // Draw rounded rectangle
      ctx.beginPath();
      ctx.moveTo(pos.x - routerWidth / 2 + cornerRadius, pos.y - routerHeight / 2);
      ctx.lineTo(pos.x + routerWidth / 2 - cornerRadius, pos.y - routerHeight / 2);
      ctx.quadraticCurveTo(pos.x + routerWidth / 2, pos.y - routerHeight / 2, pos.x + routerWidth / 2, pos.y - routerHeight / 2 + cornerRadius);
      ctx.lineTo(pos.x + routerWidth / 2, pos.y + routerHeight / 2 - cornerRadius);
      ctx.quadraticCurveTo(pos.x + routerWidth / 2, pos.y + routerHeight / 2, pos.x + routerWidth / 2 - cornerRadius, pos.y + routerHeight / 2);
      ctx.lineTo(pos.x - routerWidth / 2 + cornerRadius, pos.y + routerHeight / 2);
      ctx.quadraticCurveTo(pos.x - routerWidth / 2, pos.y + routerHeight / 2, pos.x - routerWidth / 2, pos.y + routerHeight / 2 - cornerRadius);
      ctx.lineTo(pos.x - routerWidth / 2, pos.y - routerHeight / 2 + cornerRadius);
      ctx.quadraticCurveTo(pos.x - routerWidth / 2, pos.y - routerHeight / 2, pos.x - routerWidth / 2 + cornerRadius, pos.y - routerHeight / 2);
      ctx.closePath();
      ctx.fillStyle = bgGradient;
      ctx.fill();
      ctx.strokeStyle = isHovered ? '#fff' : 'rgba(255,255,255,0.6)';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Router antenna (ports)
      const antennLen = 12;
      ctx.strokeStyle = 'rgba(255,255,255,0.9)';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      
      // Left antenna
      ctx.beginPath();
      ctx.moveTo(pos.x - routerWidth / 2 - 2, pos.y - routerHeight / 2 + 4);
      ctx.lineTo(pos.x - routerWidth / 2 - antennLen, pos.y - routerHeight / 2 - 4);
      ctx.stroke();
      
      // Right antenna
      ctx.beginPath();
      ctx.moveTo(pos.x + routerWidth / 2 + 2, pos.y - routerHeight / 2 + 4);
      ctx.lineTo(pos.x + routerWidth / 2 + antennLen, pos.y - routerHeight / 2 - 4);
      ctx.stroke();

      // Router label
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#fff';
      ctx.fillText(node, pos.x, pos.y - 2);

      // Traffic density bar and value beneath
      const barWidth = 50;
      const barHeight = 6;
      const barX = pos.x - barWidth / 2;
      const barY = pos.y + 20;

      // Bar background
      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      ctx.fillRect(barX - 1, barY - 1, barWidth + 2, barHeight + 2);

      // Traffic indicator color based on quantiles
      const cat = categories[node] || 'low';
      let trafficColor = cat === 'high' ? '#f44336' : cat === 'medium' ? '#ffc107' : '#4caf50';

      // Filled bar
      ctx.fillStyle = trafficColor;
      ctx.fillRect(barX, barY, (barWidth * traffic) / 100, barHeight);

      // Bar border
      ctx.strokeStyle = 'rgba(0,0,0,0.3)';
      ctx.lineWidth = 1;
      ctx.strokeRect(barX - 1, barY - 1, barWidth + 2, barHeight + 2);

      // Traffic percentage value
      ctx.font = '11px Arial';
      ctx.fillStyle = '#333';
      ctx.textAlign = 'center';
      ctx.fillText(`${traffic}%`, pos.x, barY + 12);
    });
  }, [pathNodes, graph, positions, start, goal, trafficDensity, hoveredNode]);

  const handleCanvasHover = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    setMousePos({ x, y });

    let hovered = null;
    Object.keys(positions).forEach((node) => {
      const pos = positions[node];
      if (!pos) return;
      const distance = Math.sqrt(Math.pow(pos.x - x, 2) + Math.pow(pos.y - y, 2));
      if (distance < 45) {
        hovered = node;
      }
    });
    setHoveredNode(hovered);
  };

  const handleCanvasLeave = () => {
    setHoveredNode(null);
  };

  const renderPathTree = () => {
    if (!pathNodes || pathNodes.length === 0) {
      return (
        <div className="nv-empty">
          <strong>No path computed yet.</strong>
          <div className="nv-empty-sub">Press "Find Optimal Path" to visualize a route.</div>
        </div>
      );
    }

    // compute cumulative costs along the path (fallback if graph direction is reversed)
    const cumulative = [];
    let cum = 0;
    for (let i = 0; i < pathNodes.length; i++) {
      if (i === 0) {
        cumulative.push(0);
        continue;
      }
      const u = pathNodes[i - 1];
      const v = pathNodes[i];
      const w = (graph && graph[u] && graph[u][v]) || (graph && graph[v] && graph[v][u]) || 0;
      cum += Number.isFinite(w) ? w : 0;
      cumulative.push(cum);
    }

    const nodeItems = pathNodes.map((node, idx) => ({
      id: node,
      index: idx + 1,
      cost: cumulative[idx],
      traffic: trafficDensity[node] || 0,
    }));

    const getTrafficClass = (n) => {
      const t = n.traffic;
      if (t >= 70) return 'high';
      if (t >= 35) return 'medium';
      return 'low';
    };

    return (
      <div className="nv-tree-container">
        <ul className="nv-tree" aria-label="Search result tree">
          {nodeItems.map((n, i) => {
            const isStart = i === 0;
            const isGoal = i === nodeItems.length - 1;
            const inPath = true;
            const trafficClass = getTrafficClass(n);
            return (
              <li
                key={n.id + '-' + i}
                className={`nv-tree-item ${isStart ? 'nv-start' : ''} ${isGoal ? 'nv-goal' : ''} ${inPath ? 'nv-inpath' : ''}`}
                onMouseEnter={() => setHoveredNode(n.id)}
                onMouseLeave={() => setHoveredNode(null)}
                onClick={() => setHoveredNode(n.id)}
              >
                <div className="nv-badge" aria-hidden>
                  <span className="nv-badge-num">{n.index}</span>
                </div>
                <div className="nv-node">
                  <div className="nv-node-name">{n.id}</div>
                  <div className="nv-node-meta">
                    <div className="nv-cost">Cost: <span className="nv-cost-val">{n.cost}</span></div>
                    <div className={`nv-traffic-pill ${trafficClass}`}>{n.traffic}%</div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  const summaryLabel = result ? result.algorithm : "Unknown";

  return (
    <div
      className="visualization-container"
      ref={containerRef}
      style={{ height: "100%", display: "flex", flexDirection: "column" }}
    >
      <div className="panel-header" style={{ fontSize: "1.07rem", letterSpacing: "0.5px" }}>
        🌲 Search Result Tree
      </div>
      <div
        style={{
          padding: "13px",
          display: "grid",
          gridTemplateColumns: "repeat(5, minmax(120px, 1fr))",
          gap: "10px",
          marginBottom: "10px",
          borderRadius: "10px",
          border: "1px solid #c9dff1",
          background: "linear-gradient(160deg, rgba(243,248,253,0.95) 0%, rgba(225,241,253,0.95) 100%)",
          boxShadow: "0 8px 16px rgba(14,45,83,0.08)",
        }}
      >
        <div style={{ color: "#2073a8", fontWeight: 700 }}>Algorithm</div>
        <div style={{ color: "#2073a8", fontWeight: 700 }}>Source</div>
        <div style={{ color: "#2073a8", fontWeight: 700 }}>Destination</div>
        <div style={{ color: "#2073a8", fontWeight: 700 }}>Cost</div>
        <div style={{ color: "#2073a8", fontWeight: 700 }}>Explored</div>
        <div style={{ color: "#1b4f66", fontWeight: 600 }}>{summaryLabel}</div>
        <div style={{ color: "#1b4f66", fontWeight: 600 }}>{start || "-"}</div>
        <div style={{ color: "#1b4f66", fontWeight: 600 }}>{goal || "-"}</div>
        <div style={{ color: "#1b4f66", fontWeight: 600 }}>{result?.cost ?? "-"}</div>
        <div style={{ color: "#1b4f66", fontWeight: 600 }}>{result?.nodes_explored ?? "-"}</div>
      </div>

      {renderPathTree()}

      <div style={{ fontSize: "13px", color: "#4f6372", marginTop: "12px", textAlign: "center" }}>
        This tree shows the chosen route from start to goal in sequential step order.
      </div>
    </div>
  );
}

export default NetworkVisualization;
