import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Background from "./components/Background";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import About from "./components/About";
import LandingSection from "./components/LandingSection";

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
        <div style={{ padding: "20px", color: "red", backgroundColor: "var(--soft-ivory)", zIndex: 100, position: 'relative' }}>
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
          <Background />
          <Header />
          <Routes>
            <Route path="/" element={
              <>
                <LandingSection />
                <Dashboard />
              </>
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
