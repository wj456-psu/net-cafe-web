import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Routes from "./Routes";
import './App.css';

function App() {
  return (
    <div className="App container py-3">
      {/* <Navbar>
        <Navbar.Brand className="fw-bold text-muted">อ้วน เน็ตคาเฟ่</Navbar.Brand>
      </Navbar> */}
      <Routes />
    </div>
  );
}

export default App;