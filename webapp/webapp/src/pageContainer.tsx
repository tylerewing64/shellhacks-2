import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import { Header } from "./components/Header";

function PageContainer({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false); // mobile drawer

  function handleMenuClick(action) {
    if (action === "mobile") setMobileOpen(true);
  }

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar (sticky full height) */}
      <div className="sticky top-0 h-screen z-20">
        <Sidebar
          collapsed={collapsed}
          mobileOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
          appName="YourRightPocket"
          userName="Jane Doe"
          userEmail="jane@example.com"
        />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 bg-white shadow">
          <Header onMenuClick={handleMenuClick} isCollapsed={collapsed} />
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-4">{children}</div>
      </div>
    </div>
  );
}

export default PageContainer;
