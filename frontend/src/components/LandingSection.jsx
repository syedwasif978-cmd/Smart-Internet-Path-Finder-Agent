import React from "react";
import { motion } from "framer-motion";
import ScrollReveal from "./ScrollReveal";
import "./LandingSection.css";

function LandingSection() {
  return (
    <div className="landing-section">
      <ScrollReveal>
        <div className="landing-container">
          <div className="landing-content">
            <div className="landing-headline">
              <h1 className="hero-title">
                Visualize How Data Travels<br />
                <span className="gradient-text">Across Your Network</span>
              </h1>
              <p className="hero-subtitle">
                AI-powered routing agent using A*, BFS, DFS & UCS to find optimal paths in real-time.
                Watch intelligent algorithms navigate multi-floor office networks with dynamic traffic simulation.
              </p>
            </div>

            <div className="landing-cta">
              <motion.button 
                className="btn-primary-landing"
                whileHover={{ scale: 1.05, boxShadow: "0 15px 35px rgba(148, 106, 139, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => document.getElementById('dashboard-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <span className="btn-icon">⚡</span>
                Try Simulation
              </motion.button>
              <motion.button 
                className="btn-secondary-landing"
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.8)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => document.getElementById('dashboard-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <span className="btn-icon">▶</span>
                Watch Demo
              </motion.button>
            </div>

            <div className="landing-stats glass-panel" style={{ padding: "20px 30px" }}>
              <div className="stat-item">
                <div className="stat-number">4</div>
                <div className="stat-label">Algorithms</div>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <div className="stat-number">13+</div>
                <div className="stat-label">Routers</div>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <div className="stat-number">4</div>
                <div className="stat-label">Floors</div>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <div className="stat-number">Live</div>
                <div className="stat-label">Traffic</div>
              </div>
            </div>
          </div>

          <div className="landing-visualization">
            <motion.div 
              className="network-diagram-container glass-card"
              style={{ padding: '20px' }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              whileHover={{ rotateY: 5, rotateX: 5 }}
            >
              <svg className="network-diagram" viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
                <rect x="20" y="20" width="360" height="420" fill="none" stroke="var(--muted-lavender)" strokeWidth="2" rx="10" />
                <line x1="20" y1="120" x2="380" y2="120" stroke="var(--muted-lavender)" strokeWidth="1" strokeDasharray="5,5" />
                <line x1="20" y1="220" x2="380" y2="220" stroke="var(--muted-lavender)" strokeWidth="1" strokeDasharray="5,5" />
                <line x1="20" y1="320" x2="380" y2="320" stroke="var(--muted-lavender)" strokeWidth="1" strokeDasharray="5,5" />

                <text x="35" y="110" fontSize="11" fill="var(--mauve)" fontWeight="600">F4</text>
                <text x="35" y="210" fontSize="11" fill="var(--mauve)" fontWeight="600">F3</text>
                <text x="35" y="310" fontSize="11" fill="var(--mauve)" fontWeight="600">F2</text>
                <text x="35" y="410" fontSize="11" fill="var(--mauve)" fontWeight="600">F1</text>

                <line x1="100" y1="60" x2="180" y2="60" stroke="var(--primary-purple)" strokeWidth="2" opacity="0.6" />
                <line x1="180" y1="60" x2="280" y2="60" stroke="var(--primary-purple)" strokeWidth="2" opacity="0.6" />
                <line x1="80" y1="160" x2="160" y2="160" stroke="var(--primary-purple)" strokeWidth="2" opacity="0.6" />
                <line x1="160" y1="160" x2="240" y2="160" stroke="var(--primary-purple)" strokeWidth="2" opacity="0.6" />
                <line x1="240" y1="160" x2="320" y2="160" stroke="var(--primary-purple)" strokeWidth="2" opacity="0.6" />
                <line x1="100" y1="60" x2="100" y2="160" stroke="var(--primary-purple)" strokeWidth="1.5" opacity="0.4" />
                <line x1="160" y1="160" x2="160" y2="260" stroke="var(--primary-purple)" strokeWidth="1.5" opacity="0.4" />
                <line x1="240" y1="160" x2="240" y2="260" stroke="var(--primary-purple)" strokeWidth="1.5" opacity="0.4" />
                <line x1="120" y1="260" x2="200" y2="260" stroke="var(--primary-purple)" strokeWidth="2" opacity="0.6" />
                <line x1="200" y1="260" x2="280" y2="260" stroke="var(--primary-purple)" strokeWidth="2" opacity="0.6" />
                <line x1="80" y1="360" x2="160" y2="360" stroke="var(--primary-purple)" strokeWidth="2" opacity="0.6" />
                <line x1="160" y1="360" x2="240" y2="360" stroke="var(--primary-purple)" strokeWidth="2" opacity="0.6" />
                <line x1="240" y1="360" x2="320" y2="360" stroke="var(--primary-purple)" strokeWidth="2" opacity="0.6" />

                <circle cx="100" cy="60" r="7" fill="var(--primary-purple)" />
                <circle cx="180" cy="60" r="7" fill="var(--primary-purple)" />
                <circle cx="280" cy="60" r="7" fill="var(--mauve)" />

                <circle cx="80" cy="160" r="7" fill="var(--muted-lavender)" />
                <circle cx="160" cy="160" r="7" fill="var(--primary-purple)" />
                <circle cx="240" cy="160" r="7" fill="var(--blush-pink)" />
                <circle cx="320" cy="160" r="7" fill="var(--mauve)" />

                <circle cx="120" cy="260" r="7" fill="var(--primary-purple)" />
                <circle cx="200" cy="260" r="7" fill="var(--muted-lavender)" />
                <circle cx="280" cy="260" r="7" fill="var(--mauve)" />

                <circle cx="80" cy="360" r="7" fill="var(--mauve)" />
                <circle cx="160" cy="360" r="7" fill="var(--primary-purple)" />
                <circle cx="240" cy="360" r="7" fill="var(--primary-purple)" />
                <circle cx="320" cy="360" r="7" fill="var(--blush-pink)" />

                <defs>
                  <style>{`
                    @keyframes pathAnimation {
                      0% { stroke-dashoffset: 1000; opacity: 0; }
                      10% { opacity: 1; }
                      90% { opacity: 1; }
                      100% { stroke-dashoffset: 0; opacity: 0; }
                    }
                    .animated-path {
                      stroke-dasharray: 1000;
                      animation: pathAnimation 3s infinite;
                    }
                  `}</style>
                </defs>
                <path
                  d="M 100 60 L 100 160 L 160 160 L 160 260 L 160 360"
                  stroke="var(--mauve)"
                  strokeWidth="3"
                  fill="none"
                  className="animated-path"
                  strokeLinecap="round"
                />
              </svg>
            </motion.div>
          </div>
        </div>
      </ScrollReveal>

    </div>
  );
}

export default LandingSection;
