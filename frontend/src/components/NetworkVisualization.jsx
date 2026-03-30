import React, { useEffect, useRef, useState } from "react";

function NetworkVisualization({ nodes, graph, result, start, goal }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [positions, setPositions] = useState({});
  const [hoveredNode, setHoveredNode] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [canvasSize, setCanvasSize] = useState({ width: 600, height: 400 });

  // Initialize positions for nodes with better spread
  useEffect(() => {
    if (nodes.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Get actual canvas size from container
    const container = containerRef.current;
    if (container) {
      const { width, height } = container.getBoundingClientRect();
      setCanvasSize({ width: width - 20, height: height - 80 });
      canvas.width = width - 20;
      canvas.height = height - 80;
    }

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Calculate radius based on canvas size
    const maxRadius = Math.min(width, height) / 2.5;
    
    const newPositions = {};
    nodes.forEach((node, idx) => {
      // Use golden angle for better distribution
      const goldenAngle = Math.PI * (3 - Math.sqrt(5)); // ~2.39996
      const angle = idx * goldenAngle;
      
      // Use square root for even area distribution
      const radius = maxRadius * Math.sqrt(idx / nodes.length);
      
      let x = centerX + Math.cos(angle) * radius;
      let y = centerY + Math.sin(angle) * radius;
      
      // Add small random offset for visual variety
      const randomOffset = 15;
      x += (Math.random() - 0.5) * randomOffset;
      y += (Math.random() - 0.5) * randomOffset;
      
      // Ensure point is within canvas bounds with margin
      const margin = 50;
      x = Math.max(margin, Math.min(width - margin, x));
      y = Math.max(margin, Math.min(height - margin, y));

      newPositions[node] = { x, y };
    });

    setPositions(newPositions);
  }, [nodes]);

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

    // Draw edges first
    if (Object.keys(graph).length > 0) {
      Object.entries(graph).forEach(([from, neighbors]) => {
        if (!positions[from]) return;

        Object.entries(neighbors).forEach(([to, weight]) => {
          if (!positions[to]) return;

          // Create canonical edge key to prevent duplicates
          const edgeKey = [from, to].sort().join("-");
          if (drawnEdges.has(edgeKey)) return; // Skip if already drawn
          drawnEdges.add(edgeKey);

          const fromPos = positions[from];
          const toPos = positions[to];

          // Check if edge is in the optimal path
          const isInPath =
            result &&
            result.path &&
            (
              (result.path.indexOf(from) < result.path.indexOf(to) &&
                result.path.includes(from) &&
                result.path.includes(to)) ||
              (result.path.indexOf(to) < result.path.indexOf(from) &&
                result.path.includes(from) &&
                result.path.includes(to))
            );

          // Draw edge
          ctx.beginPath();
          ctx.strokeStyle = getEdgeColor(weight, isInPath);
          ctx.lineWidth = isInPath ? 4 : 2;
          ctx.moveTo(fromPos.x, fromPos.y);
          ctx.lineTo(toPos.x, toPos.y);
          ctx.stroke();

          // Draw weight label only once per edge
          const midX = (fromPos.x + toPos.x) / 2;
          const midY = (fromPos.y + toPos.y) / 2;
          ctx.fillStyle = getWeightColor(weight);
          ctx.font = "bold 12px Arial";
          ctx.textAlign = "center";
          ctx.fillText(weight.toFixed(1), midX, midY - 10);
        });
      });
    }

    // Draw nodes
    nodes.forEach((node) => {
      const pos = positions[node];
      if (!pos) return;

      const isStart = node === start;
      const isGoal = node === goal;
      const isInPath =
        result && result.path && result.path.includes(node);

      // Draw circle
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, isHighlightNode(node) ? 35 : 28, 0, Math.PI * 2);
      ctx.fillStyle = getNodeColor(node, isInPath, isStart, isGoal, hoveredNode);
      ctx.fill();

      // Draw border
      ctx.strokeStyle = getBorderColor(node, isInPath, isStart, isGoal);
      ctx.lineWidth = isHighlightNode(node) ? 4 : 2;
      ctx.stroke();

      // Draw glow effect when in path
      if (isInPath) {
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 42, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(76, 175, 80, 0.3)`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Draw label
      ctx.fillStyle = "#fff";
      ctx.font = "bold 14px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Emoji + letter
      if (node === "Goal") {
        ctx.font = "24px Arial";
        ctx.fillText("🎯", pos.x, pos.y);
      } else {
        ctx.fillText(node, pos.x, pos.y);
      }
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
  }, [nodes, graph, result, positions, hoveredNode, start, goal]);

  const handleCanvasHover = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    // Scale mouse coordinates relative to canvas internal resolution
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    setMousePos({ x, y });

    // Check if hovering over a node
    let hovered = null;
    nodes.forEach((node) => {
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
    <div className="visualization-container" ref={containerRef}>
      <div className="panel-header">🔗 Network Topology</div>
      <canvas
        ref={canvasRef}
        onMouseMove={handleCanvasHover}
        onMouseLeave={handleCanvasLeave}
        style={{
          cursor: hoveredNode ? "pointer" : "default",
          flex: 1,
          borderRadius: 10,
          border: "1px solid rgba(76, 175, 80, 0.2)",
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
