import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import "./Header.css";

function Header() {
  const location = useLocation();

  const links = [
    { path: "/", label: "Dashboard" },
    { path: "/about", label: "About Project" }
  ];

  return (
    <header className="app-header glass-nav">
      <div className="header-content">
        <div className="header-left">
          <h1 className="project-title">
            Smart Path Finder
          </h1>
          <p className="project-subtitle">Intelligent Network Agent</p>
        </div>

        <nav className="header-nav">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
            >
              {link.label}
              {location.pathname === link.path && (
                <motion.div
                  layoutId="nav-underline"
                  className="nav-underline"
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: "3px",
                    background: "var(--primary-purple)",
                    borderRadius: "3px"
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default Header;
