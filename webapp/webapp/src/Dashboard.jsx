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

  // Header menu handler
  function handleMenuClick(action) {
    if (action === "toggle") setCollapsed((s) => !s);
    if (action === "mobile") setMobileOpen(true);
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

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              <RecentActivity />
          </div>
          </div>
        </main>
      </div>
    </div>
  );
}
