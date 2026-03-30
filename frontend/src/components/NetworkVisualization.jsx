import React, { useEffect, useRef, useState } from "react";

function NetworkVisualization({ nodes, graph, result, start, goal }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const positionsRef = useRef({}); // Store positions persistently
  const prevPathRef = useRef(null);
  const [positions, setPositions] = useState({});
  const [hoveredNode, setHoveredNode] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [canvasSize, setCanvasSize] = useState({ width: 600, height: 400 });

  // Get only path nodes if result exists, otherwise empty
  const pathNodes = result?.path || [];
  
  // Initialize positions for nodes only when path changes
  useEffect(() => {
    // Only recalculate if path actually changed
    const pathKey = pathNodes.sort().join("-");
    if (pathKey === prevPathRef.current && Object.keys(positionsRef.current).length > 0) {
      return;
    }

    if (pathNodes.length === 0) return;

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
    
    // Arrange path nodes in a horizontal line for clarity
    const newPositions = {};
    const nodeCount = pathNodes.length;
    const spacing = (width - 100) / Math.max(nodeCount - 1, 1);
    
    pathNodes.forEach((node, idx) => {
      const x = 50 + idx * spacing;
      const y = height / 2;
      
      newPositions[node] = {
        x: Math.max(40, Math.min(width - 40, x)),
        y: Math.max(40, Math.min(height - 40, y))
      };
    });

    // Store in ref and update state
    positionsRef.current = newPositions;
    setPositions(newPositions);
    prevPathRef.current = pathNodes.sort().join("-");
  }, [pathNodes]);

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

    // Draw edges ONLY for path nodes
    if (Object.keys(graph).length > 0 && pathNodes.length > 0) {
      // Only draw edges between consecutive path nodes
      for (let i = 0; i < pathNodes.length - 1; i++) {
        const from = pathNodes[i];
        const to = pathNodes[i + 1];

        if (!positions[from] || !positions[to]) continue;
        if (!graph[from] || !graph[from][to]) continue;

        const weight = graph[from][to];
        const fromPos = positions[from];
        const toPos = positions[to];

        // Calculate edge angle
        const dx = toPos.x - fromPos.x;
        const dy = toPos.y - fromPos.y;
        const angle = Math.atan2(dy, dx);
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Shorten line to not overlap with nodes (radius 30)
        const nodeRadius = 30;
        const startX = fromPos.x + Math.cos(angle) * nodeRadius;
        const startY = fromPos.y + Math.sin(angle) * nodeRadius;
        const endX = toPos.x - Math.cos(angle) * nodeRadius;
        const endY = toPos.y - Math.sin(angle) * nodeRadius;

        // Draw edge line
        ctx.beginPath();
        ctx.strokeStyle = "#2d8659";
        ctx.lineWidth = 4;
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        // Draw arrow head at end
        const arrowSize = 15;
        ctx.beginPath();
        ctx.fillStyle = "#2d8659";
        ctx.moveTo(endX, endY);
        ctx.lineTo(endX - arrowSize * Math.cos(angle - Math.PI / 6), endY - arrowSize * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(endX - arrowSize * Math.cos(angle + Math.PI / 6), endY - arrowSize * Math.sin(angle + Math.PI / 6));
        ctx.closePath();
        ctx.fill();

        // Draw weight label
        const midX = (startX + endX) / 2;
        const midY = (startY + endY) / 2;
        
        // Offset label perpendicularly from the edge to avoid overlap
        const offset = 20;
        const labelX = midX - Math.sin(angle) * offset;
        const labelY = midY + Math.cos(angle) * offset;
        
        // Draw background box for readability
        const labelText = weight.toFixed(1);
        ctx.font = "bold 13px 'Arial', sans-serif";
        const metrics = ctx.measureText(labelText);
        const textWidth = metrics.width;
        const textHeight = 14;
        const padding = 4;
        
        // Draw background
        ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
        ctx.fillRect(
          labelX - textWidth / 2 - padding,
          labelY - textHeight / 2 - padding,
          textWidth + padding * 2,
          textHeight + padding * 2
        );
        
        // Draw border around label
        ctx.strokeStyle = "rgba(45, 134, 89, 0.5)";
        ctx.lineWidth = 1;
        ctx.strokeRect(
          labelX - textWidth / 2 - padding,
          labelY - textHeight / 2 - padding,
          textWidth + padding * 2,
          textHeight + padding * 2
        );
        
        // Draw text
        ctx.fillStyle = "#2d8659";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(labelText, labelX, labelY);
      }
    }

    // Draw nodes
    pathNodes.forEach((node) => {
      const pos = positions[node];
      if (!pos) return;

      const isStart = node === start;
      const isGoal = node === goal;

      // Draw circle
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 30, 0, Math.PI * 2);
      
      if (isStart) {
        ctx.fillStyle = "#3a9f6d"; // Bright green for start
      } else if (isGoal) {
        ctx.fillStyle = "#1a4d32"; // Dark green for goal
      } else {
        ctx.fillStyle = "#2d8659"; // Regular green for path nodes
      }
      
      ctx.fill();

      // Draw border
      ctx.strokeStyle = "#1a4d32";
      ctx.lineWidth = 3;
      ctx.stroke();

      // Draw label
      ctx.font = "bold 16px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "white";
      ctx.fillText(node, pos.x, pos.y);
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
