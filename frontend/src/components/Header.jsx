import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

function Header() {
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-left">
          <h1 className="project-title">
            Smart Internet Path Finder
          </h1>
          <p className="project-subtitle">Intelligent Network Routing Agent</p>
        </div>

        <nav className="header-nav">
          <Link to="/" className="nav-link active">
            Dashboard
          </Link>
          <Link to="/about" className="nav-link">
            About Project
          </Link>
        </nav>
      </div>

      <div className="header-divider"></div>
    </header>
  );
}

export default Header;
