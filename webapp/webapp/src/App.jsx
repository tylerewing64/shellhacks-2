import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login.jsx";
import Dashboard from "./Dashboard.jsx";
import "./App.css";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/charities" element={<div />} />
      <Route path="/smart-donations" element={<div />} />
      <Route path="/impact" element={<div />} />
      <Route path="/donations" element={<div />} />
      <Route path="/settings" element={<div />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
