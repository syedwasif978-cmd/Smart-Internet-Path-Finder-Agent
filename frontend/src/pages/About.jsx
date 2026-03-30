import React from "react";
import { Link } from "react-router-dom";
import "./About.css";

function About() {
  const authors = [
    {
      name: "Shazil Zaib",
      nickname: "Safaid Bhund Wala",
      role: "Lead Developer",
      emoji: "👨‍💻",
    },
    {
      name: "Haseeb Asghar",
      nickname: "Anti Army",
      role: "Algorithm Specialist",
      emoji: "🎯",
    },
    {
      name: "Ahmed Khan",
      nickname: "King & Takluman",
      role: "UI/UX Designer",
      emoji: "🎨",
    },
    {
      name: "Syed Wasif",
      nickname: "Ghareeb Banda",
      role: "Backend Engineer",
      emoji: "⚙️",
    },
  ];

  return (
    <div className="about-container">
      <div className="dynamic-background"></div>

      <div className="about-content">
        <Link to="/" className="back-button">
          ← Back to Dashboard
        </Link>

        <div className="about-card">
          <div className="about-header">
            <h1 className="about-title">
              <span className="header-icon">🌐</span>
              Smart Internet Path Finder
            </h1>
            <p className="about-subtitle">
              Intelligent Network Routing Agent Using Advanced Pathfinding Algorithms
            </p>
          </div>

          <section className="about-section">
            <h2 className="section-title">📋 Project Overview</h2>
            <div className="section-content">
              <p>
                Smart Internet Path Finder is an advanced intelligent agent system designed to find optimal network routes using sophisticated pathfinding algorithms. The system analyzes complex network topologies and determines the most efficient paths for data transmission across interconnected office networks.
              </p>
            </div>
          </section>

          <section className="about-section">
            <h2 className="section-title">🎯 Key Features</h2>
            <div className="features-grid">
              <div className="feature-item">
                <span className="feature-icon">⚡</span>
                <h3>Multiple Algorithms</h3>
                <p>BFS, DFS, UCS, A* & Smart Auto-Selection</p>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🏢</span>
                <h3>Building Visualization</h3>
                <p>Interactive 5-floor office network layout</p>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🔗</span>
                <h3>Network Topology</h3>
                <p>Real-time graph visualization with 12+ nodes</p>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🎨</span>
                <h3>Dynamic UI</h3>
                <p>Beautiful animations and responsive design</p>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📊</span>
                <h3>Traffic Analysis</h3>
                <p>Real-time traffic level monitoring</p>
              </div>
              <div className="feature-item">
                <span className="feature-icon">⚙️</span>
                <h3>Smart Agent</h3>
                <p>AI-powered algorithm selection</p>
              </div>
            </div>
          </section>

          <section className="about-section">
            <h2 className="section-title">👥 Development Team</h2>
            <div className="authors-grid">
              {authors.map((author, idx) => (
                <div key={idx} className="author-card">
                  <div className="author-icon">{author.emoji}</div>
                  <h3 className="author-name">{author.name}</h3>
                  <p className="author-nickname">"{author.nickname}"</p>
                  <p className="author-role">{author.role}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="about-section">
            <h2 className="section-title">🛠️ Technology Stack</h2>
            <div className="tech-stack">
              <div className="tech-category">
                <h4>Frontend</h4>
                <ul>
                  <li>React 18.3</li>
                  <li>Canvas API</li>
                  <li>SVG Graphics</li>
                  <li>CSS3 Animations</li>
                </ul>
              </div>
              <div className="tech-category">
                <h4>Backend</h4>
                <ul>
                  <li>Python FastAPI</li>
                  <li>Graph Algorithms</li>
                  <li>RESTful API</li>
                  <li>Real-time Updates</li>
                </ul>
              </div>
              <div className="tech-category">
                <h4>Algorithms</h4>
                <ul>
                  <li>Breadth-First Search</li>
                  <li>Depth-First Search</li>
                  <li>Uniform Cost Search</li>
                  <li>A* Search</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="about-section last-section">
            <h2 className="section-title">📈 Project Objectives</h2>
            <div className="objectives-list">
              <div className="objective-item">
                <span className="objective-number">1</span>
                <p>Develop an intelligent pathfinding system for network optimization</p>
              </div>
              <div className="objective-item">
                <span className="objective-number">2</span>
                <p>Implement and compare multiple graph traversal algorithms</p>
              </div>
              <div className="objective-item">
                <span className="objective-number">3</span>
                <p>Create an intuitive and visually appealing user interface</p>
              </div>
              <div className="objective-item">
                <span className="objective-number">4</span>
                <p>Provide real-time traffic monitoring and path optimization</p>
              </div>
              <div className="objective-item">
                <span className="objective-number">5</span>
                <p>Demonstrate AI-powered algorithm selection capabilities</p>
              </div>
            </div>
          </section>
        </div>

        <Link to="/" className="cta-button">
          🚀 Launch Dashboard
        </Link>
      </div>
    </div>
  );
}

export default About;
