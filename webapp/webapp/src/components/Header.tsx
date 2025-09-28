import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "./ui/sheet";
import { Bell, Settings, User, Heart, Menu, Building2, Activity, Cog } from 'lucide-react';
import React from "react";

export function Header() {
  return (
    <header className="border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <SheetDescription className="sr-only">
                  Access different sections of the CharityRound app including charities, recent activity, and settings.
                </SheetDescription>
                <div className="py-6">
                  <h2 className="mb-6 text-lg font-semibold">Menu</h2>
                  <div className="space-y-4">
                    <Button variant="ghost" className="w-full justify-start gap-3 h-12">
                      <Building2 className="h-5 w-5" />
                      <div className="text-left">
                        <div className="font-medium">Charities</div>
                        <div className="text-sm text-muted-foreground">Browse and manage your supported charities</div>
                      </div>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-3 h-12">
                      <Activity className="h-5 w-5" />
                      <div className="text-left">
                        <div className="font-medium">Recent Activity</div>
                        <div className="text-sm text-muted-foreground">View all transactions and donations</div>
                      </div>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-3 h-12">
                      <Cog className="h-5 w-5" />
                      <div className="text-left">
                        <div className="font-medium">Settings</div>
                        <div className="text-sm text-muted-foreground">Manage your account and preferences</div>
                      </div>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            
            <div className="p-2 bg-primary rounded-lg">
              <Heart className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">CharityRound</h1>
              <p className="text-sm text-muted-foreground">Making change with spare change</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="px-3 py-1">
              $23.45 this month
            </Badge>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <User className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}