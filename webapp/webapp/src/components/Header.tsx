import React, { useState } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import NavbarSearch from "./NavbarSearch";
import DonationModal from "./DonationModal";
import {
  Bell,
  Settings as SettingsIcon,
  User,
  Heart,
  Menu,
  PanelLeftOpen,
  PanelLeftClose,
  CreditCard,
} from "lucide-react";

type MenuAction = "mobile" | "toggle";

interface HeaderProps {
  /** Called when the hamburger (mobile) or collapse (desktop) is clicked */
  onMenuClick?: (action: MenuAction) => void;
  /** Current collapse state of the desktop sidebar (for icon swap + a11y text) */
  isCollapsed?: boolean;
  /** Called when an organization is selected from search */
  onSelectOrganization?: (organization: any) => void;
  /** Called when a donation is successfully made */
  onDonationSuccess?: (donation: any) => void;
}

export function Header({ onMenuClick, isCollapsed = false, onSelectOrganization, onDonationSuccess }: HeaderProps) {
  const [showDonationModal, setShowDonationModal] = useState(false);

  const handleDonationSuccess = (donation) => {
    if (onDonationSuccess) {
      onDonationSuccess(donation);
    }
    setShowDonationModal(false);
  };

  return (
    <>
    <header className="border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Left cluster: menu buttons + brand */}
          <div className="flex items-center gap-3">
           

            {/* Desktop toggle: collapse/expand our sidebar */}
            <Button
              variant="ghost"
              size="sm"
              className="hidden lg:inline-flex"
              onClick={() => onMenuClick?.("toggle")}
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? (
                <PanelLeftOpen className="h-5 w-5" />
              ) : (
                <PanelLeftClose className="h-5 w-5" />
              )}
            </Button>

            {/* App mark */}
            <div className="p-2 bg-primary rounded-lg">
              <Heart className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">CharityRound</h1>
              <p className="text-sm text-muted-foreground">Making change with spare change</p>
            </div>
            {/* Center: Search Bar */}
            <div className="flex-1 max-w-md mx-8">
              <NavbarSearch onSelectOrganization={onSelectOrganization} onDonationSuccess={onDonationSuccess} />
            </div>
          </div>

          {/* Right cluster: month badge + actions */}
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="px-3 py-1">
              $23.45 this month
            </Badge>
            <Button 
              onClick={() => setShowDonationModal(true)}
              className=" centerbg-green-600 hover:bg-green-700 text-white"
              size="sm"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Donate Now
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" aria-label="Notifications">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" aria-label="Settings">
                <SettingsIcon className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" aria-label="Account">
                <User className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>

    {/* Donation Modal - Outside header for proper positioning */}
    {showDonationModal && (
      <DonationModal
        organization={{
          ein: "general",
          name: "General Donation",
          description: "Make a general donation to support our platform"
        }}
        onDonationSuccess={handleDonationSuccess}
        onClose={() => setShowDonationModal(false)}
      />
    )}
    </>
  );
}