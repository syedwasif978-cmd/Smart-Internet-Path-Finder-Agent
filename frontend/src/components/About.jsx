import React from "react";
import { Link } from "react-router-dom";
import "./About.css";

function About() {
  const authors = [
    {
      name: "Shazil Zaib",
      nickname: "Safaid Bhund Wala",
      role: "Lead Developer",
      description: "Full-stack architect and project lead",
    },
    {
      name: "Haseeb Asghar",
      nickname: "Anti Army",
      role: "Algorithm Specialist",
      description: "Graph algorithms & pathfinding expert",
    },
    {
      name: "Ahmed Khan",
      nickname: "King & Takluman",
      role: "UI/UX Designer",
      description: "Frontend design & user experience",
    },
    {
      name: "Syed Wasif",
      nickname: "Ghareeb Banda",
      role: "Backend Engineer",
      description: "API development & database design",
    },
  ];

  const features = [
    { title: "Network Visualization", desc: "Interactive topology display" },
    { title: "Building Layout", desc: "Office network distribution" },
    { title: "Multiple Algorithms", desc: "A*, BFS, DFS, UCS support" },
    { title: "Real-time Updates", desc: "Live traffic monitoring" },
    { title: "Optimal Routing", desc: "Smart path finding" },
    { title: "Modern Stack", desc: "React + FastAPI" },
  ];

  const techStack = [
    {
      category: "Frontend",
      techs: ["React 18.3", "Canvas API", "SVG Graphics", "React Router"],
    },
    {
      category: "Backend",
      techs: ["FastAPI", "Python 3.10+", "Graph Algorithms", "JSON"],
    },
    {
      category: "Algorithms",
      techs: ["A* Search", "BFS", "DFS", "Uniform Cost Search"],
    },
  ];

  const objectives = [
    "Build intelligent network routing system",
    "Visualize dynamic path finding algorithms",
    "Optimize network traffic flow",
    "Provide educational tool for algorithms",
    "Create professional web interface",
  ];

  return (
    <div className="about-page">
      <div className="dynamic-background"></div>

      <div className="about-container">
        {/* Back to Dashboard */}
        <Link to="/" className="back-link">
          ← Back to Dashboard
        </Link>

        {/* Overview Section */}
        <section className="about-section">
          <h2 className="section-title">📖 Project Overview</h2>
          <div className="overview-content">
            <p>
              <strong>Smart Internet Path Finder</strong> is an intelligent network routing agent
              that visualizes real-time pathfinding algorithms. It combines advanced graph
              algorithms with modern web technologies to provide an interactive learning and
              monitoring platform for network optimization.
            </p>
            <p>
              The system demonstrates how intelligent routing works in complex network topologies,
              making it perfect for educational purposes and network administrators alike.
            </p>
          </div>
        </section>

        {/* Features Section */}
        <section className="about-section">
          <h2 className="section-title">✨ Key Features</h2>
          <div className="features-grid">
            {features.map((feature, idx) => (
              <div key={idx} className="feature-card">
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section className="about-section">
          <h2 className="section-title">Project Team</h2>
          <div className="authors-grid">
            {authors.map((author, idx) => (
              <div key={idx} className="author-card">
                <div className="author-avatar">{author.role.charAt(0)}</div>
                <h3 className="author-name">{author.name}</h3>
                <p className="author-nickname">"{author.nickname}"</p>
                <p className="author-role">{author.role}</p>
                <p className="author-desc">{author.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tech Stack Section */}
        <section className="about-section">
          <h2 className="section-title">🛠️ Technology Stack</h2>
          <div className="tech-stack">
            {techStack.map((stack, idx) => (
              <div key={idx} className="tech-category">
                <h4>{stack.category}</h4>
                <ul>
                  {stack.techs.map((tech, tidx) => (
                    <li key={tidx}>
                      <span className="checkmark">✓</span> {tech}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Objectives Section */}
        <section className="about-section">
          <h2 className="section-title">🎯 Project Objectives</h2>
          <ol className="objectives-list">
            {objectives.map((obj, idx) => (
              <li key={idx}>
                <span className="obj-number">{idx + 1}</span>
                {obj}
              </li>
            ))}
          </ol>
        </section>

        {/* Footer */}
        <footer className="about-footer">
          <p>
            Made with ❤️ by the Smart Internet Path Finder Team
          </p>
          <p className="footer-year">© 2024 All Rights Reserved</p>
        </footer>
      </div>
    </div>
  );
}

export default About;
