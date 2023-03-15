import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Routes from "./Routes";

function App() {
  return (
    <div className="App container py-3">
      <Navbar collapseOnSelect bg="light" expand="md" className="mb-3 px-3">
        <Navbar.Brand className="fw-bold text-muted">อ้วน เน็ตคาเฟ่</Navbar.Brand>
      </Navbar>
      <Routes />
    </div>
  );
}

export default App;