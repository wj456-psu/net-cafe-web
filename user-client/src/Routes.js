import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./containers/Login";
import NotFound from "./containers/NotFound";
import Admin from "./containers/Admin";

export default function Links() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/Admin" element={<Admin />} />
      <Route path="*" element={<NotFound />} />;
    </Routes>
  );
}