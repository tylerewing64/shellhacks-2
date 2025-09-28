// App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login.jsx";
import Dashboard from "./Dashboard.jsx";
import SmartDonations from "./smartdonations.jsx"; // import your component
import "./App.css";
import PageContainer from "./pageContainer.js";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<PageContainer children={<Dashboard />} />} />
      <Route path="/smart-donations" element={<PageContainer children={<SmartDonations />} />} />
      <Route path="/charities" element={<div />} />
      <Route path="/impact" element={<div />} />
      <Route path="/donations" element={<div />} />
      <Route path="/settings" element={<div />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
