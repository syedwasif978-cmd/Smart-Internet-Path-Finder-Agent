import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import About from "./components/About";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "20px", color: "red", backgroundColor: "#f0f0f0" }}>
          <h1>Something went wrong</h1>
          <p>{this.state.error?.toString()}</p>
          <details style={{ whiteSpace: "pre-wrap" }}>
            {this.state.error?.stack}
          </details>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="app-container">
          <div className="dynamic-background"></div>
          
          <Header />
          
          <Routes>
            <Route path="/" element={
              <Dashboard />
            } />
            <Route path="/about" element={
              <About />
            } />
          </Routes>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
