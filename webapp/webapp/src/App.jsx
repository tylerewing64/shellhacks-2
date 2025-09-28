// App.jsx
import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login.jsx";
import Dashboard from "./Dashboard.jsx";
import SmartDonations from "./smartdonations.jsx"; // import your component
import CharityChoicesPage from "./pages/CharityChoicesPage.jsx";
import { LikedOrganizationsProvider } from "./contexts/LikedOrganizationsContext.jsx";
import "./App.css";
import PageContainer from "./pageContainer.tsx";

// Dashboard wrapper component
function DashboardPage() {
  const [selectedOrganizations, setSelectedOrganizations] = useState([]);

  const handleSelectOrganization = (organization) => {
    console.log("Organization selected:", organization.name);
    // Add any global organization selection logic here
  };

  const handleDonationSuccess = (donation) => {
    console.log("Donation successful:", donation);
    // Add any global donation success logic here
  };

  return (
    <PageContainer 
      onSelectOrganization={handleSelectOrganization}
      onDonationSuccess={handleDonationSuccess}
    >
      <Dashboard 
        onSelectOrganization={handleSelectOrganization}
        onDonationSuccess={handleDonationSuccess}
      />
    </PageContainer>
  );
}

export default function App() {
  return (
    <LikedOrganizationsProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/smart-donations" element={<PageContainer children={<SmartDonations />} />} />
        <Route path="/charities" element={<PageContainer children={<CharityChoicesPage />} />} />
        <Route path="/impact" element={<div />} />
        <Route path="/donations" element={<div />} />
        <Route path="/settings" element={<div />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </LikedOrganizationsProvider>
  );
}
