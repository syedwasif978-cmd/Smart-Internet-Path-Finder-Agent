import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import About from "./components/About";

function App() {
  return (
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
  );
}

export default App;
