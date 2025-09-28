import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login.jsx";
import Dashboard from "./Dashboard.jsx";
import "./App.css";
import PageContainer from "./pageContainer.js";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        path="/dashboard"
        element={<PageContainer children={<Dashboard />} />}
      />
      <Route path="/charities" element={<PageContainer />} />
      <Route path="/smart-donations" element={<PageContainer />} />
      <Route path="/impact" element={<PageContainer />} />
      <Route path="/donations" element={<PageContainer />} />
      <Route path="/settings" element={<PageContainer />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
