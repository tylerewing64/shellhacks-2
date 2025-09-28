// src/Dashboard.jsx
import { useState } from "react";
import Sidebar from "./components/Sidebar";
import { Header } from "./components/Header";
import { ImpactOverview } from "./components/ImpactOverview";
import { RecentActivity } from "./components/RecentActivity";
import { CharityUpdates } from "./components/CharityUpdates";
import { GoalsProgress } from "./components/GoalsProgress";
import { CharitySuggestions } from "./components/CharitySuggestions";

export default function Dashboard() {
  // ✨ NEW: sidebar state lives here
  const [collapsed, setCollapsed] = useState(false); // desktop collapse
  const [mobileOpen, setMobileOpen] = useState(false); // mobile drawer
  const [selectedOrganizations, setSelectedOrganizations] = useState([]);

  // Header will call this
  function handleMenuClick(action) {
    if (action === "toggle") setCollapsed((s) => !s); // collapse / expand
    if (action === "mobile") setMobileOpen(true);      // open mobile sidebar
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
        {/* Wire props into Header */}
        <Header 
          onMenuClick={handleMenuClick} 
          isCollapsed={collapsed}
          onSelectOrganization={handleSelectOrganization}
        />

        <main className="container mx-auto px-4 py-8">
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold">Your Impact Dashboard</h2>
              <p className="text-muted-foreground">
                See how your everyday purchases are making a difference in the world
              </p>
            </div>

            {/* Selected Organizations */}
            {selectedOrganizations.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Organizations You're Supporting ({selectedOrganizations.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedOrganizations.map((organization) => (
                    <div
                      key={organization.ein}
                      className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg"
                    >
                      {organization.logoUrl && (
                        <img
                          src={organization.logoUrl}
                          alt={`${organization.name} logo`}
                          className="w-10 h-10 rounded-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">
                          {organization.name}
                        </h4>
                        <p className="text-sm text-gray-500 truncate">
                          {organization.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <section>
              <ImpactOverview />
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <RecentActivity />
                <CharityUpdates />
              </div>

              <div className="space-y-8">
                <GoalsProgress />
                <CharitySuggestions />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
