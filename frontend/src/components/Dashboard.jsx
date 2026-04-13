import React, { useEffect, useState } from "react";
import axios from "axios";
import ControlPanel from "./ControlPanel";
import NetworkVisualization from "./NetworkVisualization";
import BuildingVisualization from "./BuildingVisualization";
import AlgorithmComparison from "./AlgorithmComparison";
import ScrollReveal from "./ScrollReveal";

const API_BASE = "/api";

function Dashboard() {
  const [nodes, setNodes] = useState([]);
  const [graph, setGraph] = useState({});
  const [start, setStart] = useState("");
  const [goal, setGoal] = useState("");
  const [algorithm, setAlgorithm] = useState("auto");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [graphUpdated, setGraphUpdated] = useState(0);

  useEffect(() => {
    loadNodeData();
    const interval = setInterval(() => {
      loadNodeData();
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (result) {
      loadNodeData();
    }
  }, [graphUpdated]);

  async function loadNodeData() {
    try {
      const [nodeResp, graphResp] = await Promise.all([
        axios.get(`${API_BASE}/nodes`),
        axios.get(`${API_BASE}/graph`),
      ]);
      setNodes(nodeResp.data);
      setGraph(graphResp.data);
      if (!start && nodeResp.data.length > 0) {
        setStart(nodeResp.data[0]);
        setGoal(nodeResp.data[nodeResp.data.length - 1]);
      }
    } catch (err) {
      setError("Failed to load network data: " + (err.message || err));
    }
  }

  const runAgent = async () => {
    setError("");
    setResult(null);
    setLoading(true);

    if (!start || !goal) {
      setError("❌ Please choose both start and goal routers.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_BASE}/find-path`, {
        start,
        goal,
        algorithm,
      });
      setResult(response.data);
      setGraphUpdated(prev => prev + 1);
    } catch (err) {
      const message = err.response?.data?.detail || err.message || "Request failed";
      setError("❌ " + message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="dashboard-section" className="app-content">
      {/* Left Control Panel */}
      <ScrollReveal delay={0.1} style={{ flex: '0 0 240px', minWidth: 0 }}>
        <ControlPanel
          nodes={nodes}
          start={start}
          setStart={setStart}
          goal={goal}
          setGoal={setGoal}
          algorithm={algorithm}
          setAlgorithm={setAlgorithm}
          onRunAgent={runAgent}
          loading={loading}
          error={error}
          result={result}
        />
      </ScrollReveal>

      <div className="visualization-panel">

        {/* Building Visualization - proportional flex */}
        <div style={{ flex: '2', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <ScrollReveal delay={0.2} className="visualization-container glass-card" style={{ flex: 1, padding: '14px' }}>
            <BuildingVisualization
              graph={graph}
              result={result}
              start={start}
              goal={goal}
            />
          </ScrollReveal>
        </div>

        {/* Search Result Tree */}
        <div style={{ flex: '2', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <ScrollReveal delay={0.3} className="visualization-container glass-card" style={{ flex: 1, padding: '14px' }}>
            <NetworkVisualization
              nodes={nodes}
              graph={graph}
              result={result}
              start={start}
              goal={goal}
            />
          </ScrollReveal>
        </div>

        {/* Algorithm Comparison Table */}
        {result && (
          <div style={{ flex: '3', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <ScrollReveal delay={0.4} className="visualization-container glass-card" style={{ flex: 1, padding: '14px' }}>
              <AlgorithmComparison
                result={result}
                selectedAlgorithm={algorithm}
              />
            </ScrollReveal>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
