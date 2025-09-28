import React from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Bell,
  Settings as SettingsIcon,
  User,
  Heart,
  Menu,
  PanelLeftOpen,
  PanelLeftClose,
} from "lucide-react";

type MenuAction = "mobile" | "toggle";

interface HeaderProps {
  /** Called when the hamburger (mobile) or collapse (desktop) is clicked */
  onMenuClick?: (action: MenuAction) => void;
  /** Current collapse state of the desktop sidebar (for icon swap + a11y text) */
  isCollapsed?: boolean;
  /** Called when an organization is selected from search */
  onSelectOrganization?: (organization: any) => void;
}

export function Header({ onMenuClick, isCollapsed = false, onSelectOrganization }: HeaderProps) {
  return (
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
          </div>
          {/* Right cluster: month badge + actions */}
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="px-3 py-1">
              $23.45 this month
            </Badge>
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
  );
}