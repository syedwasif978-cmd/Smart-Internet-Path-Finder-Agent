import React, { useEffect, useRef, useState } from "react";

function NetworkVisualization({ nodes, graph, result, start, goal }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const positionsRef = useRef({}); // Store positions persistently
  const prevGraphRef = useRef(null);
  const [positions, setPositions] = useState({});
  const [hoveredNode, setHoveredNode] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [canvasSize, setCanvasSize] = useState({ width: 600, height: 400 });
  const [trafficLevels, setTrafficLevels] = useState({});
  const [layout, setLayout] = useState('circle'); // circle or tree

  // Get only path nodes if result exists, otherwise empty
  const pathNodes = result?.path || [];

  // Initialize positions for all nodes when graph or nodes change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Force a consistent canvas height to avoid it shifting down
    const container = containerRef.current;
    const targetHeight = 520; // match building visualization height so panels align
    const targetWidth = container ? Math.max(500, container.getBoundingClientRect().width - 20) : 800;
    setCanvasSize({ width: targetWidth, height: targetHeight });
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const width = canvas.width;
    const height = canvas.height;

    // Circle layout for all nodes
    const newPositions = {};
    const nodeList = nodes && nodes.length ? nodes : Object.keys(graph || {});
    const n = nodeList.length || 1;
    const cx = width / 2;
    const cy = height / 2;
    const radius = Math.min(width, height) / 2 - 80;

    nodeList.forEach((node, i) => {
      const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
      const x = cx + Math.cos(angle) * radius;
      const y = cy + Math.sin(angle) * radius;
      newPositions[node] = { x, y };
    });

    positionsRef.current = newPositions;
    setPositions(newPositions);
    prevGraphRef.current = JSON.stringify(graph || {});

    // Generate a simple traffic level per node (for visualization)
    const t = {};
    nodeList.forEach((node) => {
      const r = Math.random();
      t[node] = r < 0.6 ? 'low' : r < 0.9 ? 'medium' : 'high';
    });
    setTrafficLevels(t);
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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || Object.keys(positions).length === 0) return;

    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.fillStyle = "rgba(232, 245, 242, 0.3)";
    ctx.fillRect(0, 0, width, height);

    // Track drawn edges to prevent duplicates
    const drawnEdges = new Set();

    // Draw ALL edges first (low-opacity) so the full topology is visible
    if (Object.keys(graph).length > 0) {
      Object.keys(graph).forEach((u) => {
        const nbrs = graph[u] || {};
        Object.keys(nbrs).forEach((v) => {
          // draw each undirected edge only once
          if (!positions[u] || !positions[v]) return;
          if (u > v) return; // simple dedupe

          const fromPos = positions[u];
          const toPos = positions[v];
          const weight = nbrs[v];

          const dx = toPos.x - fromPos.x;
          const dy = toPos.y - fromPos.y;
          const angle = Math.atan2(dy, dx);

          const nodeRadius = 30;
          const startX = fromPos.x + Math.cos(angle) * nodeRadius;
          const startY = fromPos.y + Math.sin(angle) * nodeRadius;
          const endX = toPos.x - Math.cos(angle) * nodeRadius;
          const endY = toPos.y - Math.sin(angle) * nodeRadius;

          // color by weight
          ctx.beginPath();
          ctx.strokeStyle = getEdgeColor(weight, false);
          ctx.lineWidth = 2;
          ctx.moveTo(startX, startY);
          ctx.lineTo(endX, endY);
          ctx.stroke();
        });
      });
    }

    // Highlight the chosen path with thicker colored edges
    if (pathNodes && pathNodes.length > 0) {
      for (let i = 0; i < pathNodes.length - 1; i++) {
        const from = pathNodes[i];
        const to = pathNodes[i + 1];
        if (!positions[from] || !positions[to]) continue;
        if (!graph[from] || !graph[from][to]) continue;

        const weight = graph[from][to];
        const fromPos = positions[from];
        const toPos = positions[to];
        const dx = toPos.x - fromPos.x;
        const dy = toPos.y - fromPos.y;
        const angle = Math.atan2(dy, dx);

        const nodeRadius = 30;
        const startX = fromPos.x + Math.cos(angle) * nodeRadius;
        const startY = fromPos.y + Math.sin(angle) * nodeRadius;
        const endX = toPos.x - Math.cos(angle) * nodeRadius;
        const endY = toPos.y - Math.sin(angle) * nodeRadius;

        // Draw highlighted edge
        ctx.beginPath();
        ctx.strokeStyle = "#ff6f00"; // highlight color (orange)
        ctx.lineWidth = 6;
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        // Arrow head
        const arrowSize = 12;
        ctx.beginPath();
        ctx.fillStyle = "#ff6f00";
        ctx.moveTo(endX, endY);
        ctx.lineTo(endX - arrowSize * Math.cos(angle - Math.PI / 7), endY - arrowSize * Math.sin(angle - Math.PI / 7));
        ctx.lineTo(endX - arrowSize * Math.cos(angle + Math.PI / 7), endY - arrowSize * Math.sin(angle + Math.PI / 7));
        ctx.closePath();
        ctx.fill();
      }
    }

    // Draw all nodes (visible before search). Color by traffic and highlight path nodes.
    Object.keys(positions).forEach((node) => {
      const pos = positions[node];
      if (!pos) return;

      const isStart = node === start;
      const isGoal = node === goal;
      const isInPath = pathNodes.includes(node);

      // determine node color (traffic influences fill)
      let fillColor = getNodeColor(node, isInPath, isStart, isGoal, hoveredNode);

      // Draw circle
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 30, 0, Math.PI * 2);
      ctx.fillStyle = fillColor;
      ctx.fill();

      // Draw border
      ctx.strokeStyle = getBorderColor(node, isInPath, isStart, isGoal);
      ctx.lineWidth = 3;
      ctx.stroke();

      // Draw label
      ctx.font = "bold 14px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "white";
      ctx.fillText(node, pos.x, pos.y);

      // Draw traffic density bar beneath the node
      const traffic = trafficLevels[node] || 'low';
      const barWidth = 48;
      const barHeight = 8;
      const barX = pos.x - barWidth / 2;
      const barY = pos.y + 36; // below circle

      // background
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      ctx.fillRect(barX - 1, barY - 1, barWidth + 2, barHeight + 2);
      // filled portion
      let pct = 0.33;
      if (traffic === 'low') pct = 0.33;
      if (traffic === 'medium') pct = 0.66;
      if (traffic === 'high') pct = 1.0;
      ctx.fillStyle = traffic === 'low' ? '#4caf50' : traffic === 'medium' ? '#ffc107' : '#f44336';
      ctx.fillRect(barX, barY, barWidth * pct, barHeight);
      // border
      ctx.strokeStyle = 'rgba(0,0,0,0.08)';
      ctx.lineWidth = 1;
      ctx.strokeRect(barX - 1, barY - 1, barWidth + 2, barHeight + 2);
    });

    function getEdgeColor(weight, isInPath) {
      if (isInPath) return "#4caf50";
      if (weight < 2) return "rgba(76, 175, 80, 0.6)";
      if (weight < 4) return "rgba(255, 193, 7, 0.6)";
      return "rgba(244, 67, 54, 0.6)";
    }

    function getWeightColor(weight) {
      if (weight < 2) return "#4caf50";
      if (weight < 4) return "#ffc107";
      return "#f44336";
    }

    function getNodeColor(node, isInPath, isStart, isGoal, hovered) {
      if (isStart) return "rgba(76, 175, 80, 0.9)";
      if (isGoal) return "rgba(255, 152, 0, 0.9)";
      if (isInPath) return "rgba(129, 199, 132, 0.8)";
      if (hovered === node) return "rgba(255, 193, 7, 0.8)";
      return "rgba(76, 175, 80, 0.7)";
    }

    function getBorderColor(node, isInPath, isStart, isGoal) {
      if (isStart) return "#4caf50";
      if (isGoal) return "#ffa726";
      if (isInPath) return "#81c784";
      return "#fff";
    }

    function isHighlightNode(node) {
      return node === start || node === goal || node === hoveredNode;
    }
  }, [pathNodes, graph, result, positions, start, goal]);

  const handleCanvasHover = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    setMousePos({ x, y });

    // Check if hovering over a path node
    let hovered = null;
    pathNodes.forEach((node) => {
      const pos = positions[node];
      if (!pos) return;
      const distance = Math.sqrt(
        Math.pow(pos.x - x, 2) + Math.pow(pos.y - y, 2)
      );
      if (distance < 35) {
        hovered = node;
      }
    });
    setHoveredNode(hovered);
  };

  const handleCanvasLeave = () => {
    setHoveredNode(null);
  };

  return (
    <div className="visualization-container" ref={containerRef} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="panel-header">🔗 Network Topology</div>
      <canvas
        ref={canvasRef}
        onMouseMove={handleCanvasHover}
        onMouseLeave={handleCanvasLeave}
        width={canvasSize.width}
        height={canvasSize.height}
        style={{
          cursor: hoveredNode ? "pointer" : "default",
          flex: 1,
          borderRadius: 10,
          border: "1px solid rgba(76, 175, 80, 0.2)",
          display: 'block',
          backgroundColor: 'rgba(232, 245, 242, 0.1)',
        }}
      />
      <div style={{ marginTop: 15, fontSize: 12, color: "#4caf50" }}>
        <div style={{ marginBottom: 8 }}>
          {hoveredNode && (
            <div style={{ color: "#2d7a3e" }}>
              📌 Hovering: <strong>{hoveredNode}</strong>
            </div>
          )}
        </div>
        <div>🟢 Green = optimal path | 🟩 Start | 🟧 destination</div>
      </div>
    </div>
  );
}

export default NetworkVisualization;
