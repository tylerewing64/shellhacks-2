// src/components/Sidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";

const baseItem = "flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100";
const activeItem = "bg-indigo-500 text-white shadow-md hover:bg-indigo-500/95";

export default function Sidebar({
  collapsed = false,        // ← new
  mobileOpen = false,       // ← new
  onClose,                  // ← new (for mobile)
  appName = "YourRightPocket",
  userName = "Jane Doe",
  userEmail = "jane@example.com",
}) {
  // width classes when collapsed vs expanded
  const w = collapsed ? "w-45px" : "w-[280px]";
  const label = (txt) => (collapsed ? <span className="sr-only">{txt}</span> : <span>{txt}</span>);

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-30 bg-black/40 lg:hidden ${mobileOpen ? "" : "hidden"}`}
        onClick={onClose}
      />
      {/* Sidebar panel (mobile = slide-in; desktop = fixed) */}
      <aside
        className={[
          "fixed z-40 h-screen shrink-0 border-r bg-white/90 backdrop-blur transition-all",
          w,
          // mobile sheet animation
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0 lg:static",
        ].join(" ")}
      >
        {/* Brand */}
        <div className={`flex items-center gap-3 px-4 py-5 ${collapsed ? "justify-center" : ""}`}>
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500 shadow-md">
            <svg viewBox="0 0 24 24" className="h-6 w-6 text-white" fill="currentColor">
              <rect x="3.5" y="3.5" width="17" height="17" rx="4" />
            </svg>
          </span>
          {!collapsed && (
            <div>
              <p className="text-sm font-semibold text-gray-900 leading-tight">{appName}</p>
              <p className="text-xs text-gray-500 -mt-0.5">Making impact together</p>
            </div>
          )}
        </div>

        {/* User */}
        <div className={`mx-4 mb-3 rounded-xl border bg-white p-4 ${collapsed ? "hidden" : "block"}`}>
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-gray-100 ring-1 ring-gray-200" />
            <div className="truncate">
              <p className="truncate text-sm font-medium text-gray-800">{userName}</p>
              <p className="truncate text-xs text-gray-500">{userEmail}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="px-2 py-2 space-y-1">
          <NavLink to="/dashboard" end className={({isActive}) => `${baseItem} ${isActive ? activeItem : ""}`}>
            <GridIcon />
            {label("Dashboard")}
          </NavLink>
          <NavLink to="/charities" className={({isActive}) => `${baseItem} ${isActive ? activeItem : ""}`}>
            <HeartIcon />
            {label("Charity Choices")}
          </NavLink>
          <NavLink to="/smart-donations" className={({isActive}) => `${baseItem} ${isActive ? activeItem : ""}`}>
            <ZapIcon />
            {label("Smart Donations")}
          </NavLink>
          <NavLink to="/impact" className={({isActive}) => `${baseItem} ${isActive ? activeItem : ""}`}>
            <TrendIcon />
            {label("Your Impact")}
          </NavLink>
          <NavLink to="/donations" className={({isActive}) => `${baseItem} ${isActive ? activeItem : ""}`}>
            <HistoryIcon />
            {label("Donation History")}
          </NavLink>
          <NavLink to="/settings" className={({isActive}) => `${baseItem} ${isActive ? activeItem : ""}`}>
            <SettingsIcon />
            {label("Settings")}
          </NavLink>
        </nav>
      </aside>
    </>
  );
}

/* icons */
function GridIcon(){return(<svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M3 3h8v8H3V3Zm10 0h8v8h-8V3ZM3 13h8v8H3v-8Zm10 0h8v8h-8v-8Z"/></svg>)}
function HeartIcon(){return(<svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M12 21s-8-4.6-8-10a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 5.4-8 10-8 10Z"/></svg>)}
function ZapIcon(){return(<svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M13 2 3 14h7l-1 8 11-14h-7l0-6Z"/></svg>)}
function TrendIcon(){return(<svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M3 17 10 10l4 4 7-7v4h-2V8.4l-5 5-4-4L5 15v2H3v0Z"/></svg>)}
function HistoryIcon(){return(<svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M12 5a7 7 0 1 1-7 7H2l3-3 3 3H6a6 6 0 1 0 6-6Zm-1 2h2v5h-2V7Z"/></svg>)}
function SettingsIcon(){return(<svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M10.3 2.3h3.4l.4 2.3 2 .9 2-1.2 2.4 2.4-1.2 2 1 2 .3 2.4-2.3.4-.9 2 1.2 2-2.4 2.4-2-1.2-2 .9-.4 2.3h-3.4l-.4-2.3-2-.9-2 1.2L3.2 16l1.2-2-1-2-.3-2.4 2.3-.4.9-2-1.2-2L7.6 3.2l2 1.2 2-.9.4-2.3ZM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"/></svg>)}
