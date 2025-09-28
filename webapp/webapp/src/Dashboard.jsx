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

  // Header will call this
  function handleMenuClick(action) {
    if (action === "toggle") setCollapsed((s) => !s); // collapse / expand
    if (action === "mobile") setMobileOpen(true); // open mobile sidebar
  }

  return (
    <div className="flex-1 min-h-screen">
      {/* Wire props into Header */}

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">Your Impact Dashboard</h2>
            <p className="text-muted-foreground">
              See how your everyday purchases are making a difference in the
              world
            </p>
          </div>

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
  );
}
