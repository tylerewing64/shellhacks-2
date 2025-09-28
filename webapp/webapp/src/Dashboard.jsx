// src/Dashboard.jsx
import { useState } from "react";
import Sidebar from "./components/Sidebar";
import { Header } from "./components/Header";
import { ImpactOverview } from "./components/ImpactOverview";
import { RecentActivity } from "./components/RecentActivity";

export default function Dashboard() {
  // Sidebar state
  const [collapsed, setCollapsed] = useState(false); // desktop collapse
  const [mobileOpen, setMobileOpen] = useState(false); // mobile drawer
  const [selectedOrganizations, setSelectedOrganizations] = useState([]);

  // Header menu handler
  function handleMenuClick(action) {
    if (action === "toggle") setCollapsed((s) => !s);
    if (action === "mobile") setMobileOpen(true);
  }

  // Handle organization selection from search
  function handleSelectOrganization(organization) {
    // Check if organization is already selected
    const isAlreadySelected = selectedOrganizations.some(
      org => org.ein === organization.ein
    );

    if (!isAlreadySelected) {
      setSelectedOrganizations(prev => [...prev, organization]);
      // You could show a toast notification here
      console.log('Organization added:', organization.name);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* LEFT: Sidebar */}
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        appName="YourRightPocket"
        userName="Jane Doe"
        userEmail="jane@example.com"
      />

      {/* RIGHT: Content */}
      <div className="flex-1 min-h-screen">

        <Header onMenuClick={handleMenuClick} isCollapsed={collapsed} />


        <main className="container mx-auto px-4 py-8 space-y-8">
          {/* Impact Overview Section */}
          <ImpactOverview />
          </div>
        </main>
      </div>
    </div>
  );
}
