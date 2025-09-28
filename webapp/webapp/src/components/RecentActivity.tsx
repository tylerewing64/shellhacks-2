import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ArrowUpRight, Heart, ShoppingBag, Coffee, Utensils } from 'lucide-react';
import React from "react";

const recentTransactions = [
  {
    id: 1,
    type: 'roundup',
    description: 'Starbucks Coffee',
    amount: 4.23,
    roundup: 0.77,
    charity: 'World Food Programme',
    date: '2 hours ago',
    icon: Coffee,
  },
  {
    id: 2,
    type: 'roundup',
    description: 'Amazon Purchase',
    amount: 23.67,
    roundup: 0.33,
    charity: 'Education For All',
    date: '5 hours ago',
    icon: ShoppingBag,
  },
  {
    id: 3,
    type: 'donation',
    description: 'Direct Donation',
    amount: 0,
    roundup: 10.00,
    charity: 'Clean Water Initiative',
    date: '1 day ago',
    icon: Heart,
  },
  {
    id: 4,
    type: 'roundup',
    description: 'Chipotle',
    amount: 12.45,
    roundup: 0.55,
    charity: 'Local Food Bank',
    date: '1 day ago',
    icon: Utensils,
  },
];

export function RecentActivity() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Activity</CardTitle>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentTransactions.map((transaction) => {
            const Icon = transaction.icon;
            return (
              <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg border border-border/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-muted">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-sm text-muted-foreground">{transaction.charity}</p>
                    <p className="text-xs text-muted-foreground">{transaction.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={transaction.type === 'donation' ? 'default' : 'secondary'}>
                      {transaction.type === 'donation' ? 'Donation' : 'Round-up'}
                    </Badge>
                  </div>
                  {transaction.type === 'roundup' && (
                    <p className="text-sm text-muted-foreground">${transaction.amount.toFixed(2)} → ${(transaction.amount + transaction.roundup).toFixed(2)}</p>
                  )}
                  <p className="font-medium text-primary">+${transaction.roundup.toFixed(2)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}