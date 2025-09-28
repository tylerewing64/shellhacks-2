import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ArrowUpRight, Heart, ShoppingBag, Coffee, Utensils, CreditCard, Car, Home, Gamepad2 } from 'lucide-react';
import React, { useState, useEffect } from "react";
import DashboardService from '../services/dashboardService';

const categoryIcons = {
  'Food & Dining': Coffee,
  'Shopping': ShoppingBag,
  'Transportation': Car,
  'Entertainment': Gamepad2,
  'Groceries': Utensils,
  'Gas': Car,
  'Utilities': Home,
  'Healthcare': Heart,
  'Education': ShoppingBag,
  'default': CreditCard
};

interface ActivityData {
  donations: Array<{
    id: number;
    amount: string; // API returns strings
    status: string;
    created_at: string;
    completed_at: string | null;
    organization_name: string;
    logo_url: string;
    category: string;
  }>;
  transactions: Array<{
    id: number;
    amount: string; // API returns strings
    roundup_amount: string; // API returns strings
    merchant_name: string;
    category: string;
    transaction_date: string;
    processed_at: string;
  }>;
}

export function RecentActivity() {
  const [data, setData] = useState<ActivityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const activityData = await DashboardService.getRecentActivity();
      setData(activityData);
    } catch (err) {
      setError('Failed to load activity data');
      console.error('Error loading activity data:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-3 rounded-lg border border-border/50">
              <div className="text-sm text-muted-foreground">Loading...</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-3 rounded-lg border border-border/50">
              <div className="text-sm text-red-500">Error loading data</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Combine donations and transactions for display
  const allActivities = [
    ...data.donations.map(donation => ({
      id: `donation-${donation.id}`,
      type: 'donation',
      description: 'Direct Donation',
      amount: 0,
      roundup: parseFloat(donation.amount) || 0,
      charity: donation.organization_name,
      date: donation.completed_at || donation.created_at,
      icon: Heart,
      status: donation.status
    })),
    ...data.transactions.map(transaction => ({
      id: `transaction-${transaction.id}`,
      type: 'roundup',
      description: transaction.merchant_name,
      amount: parseFloat(transaction.amount) || 0,
      roundup: parseFloat(transaction.roundup_amount) || 0,
      charity: 'Round-up Pool',
      date: transaction.processed_at,
      icon: categoryIcons[transaction.category] || categoryIcons.default,
      status: 'completed' // Transactions are always completed
    }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 8);
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
          {allActivities.map((activity) => {
            const Icon = activity.icon;
            return (
              <div key={activity.id} className="flex items-center justify-between p-3 rounded-lg border border-border/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-muted">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">{activity.description}</p>
                    <p className="text-sm text-muted-foreground">{activity.charity}</p>
                    <p className="text-xs text-muted-foreground">{formatTimeAgo(activity.date)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={activity.type === 'donation' ? 'default' : 'secondary'}>
                      {activity.type === 'donation' ? 
                        (activity.status === 'completed' ? 'Donation' : 'Pending') : 
                        'Round-up'}
                    </Badge>
                  </div>
                  {activity.type === 'roundup' && (
                    <p className="text-sm text-muted-foreground">${activity.amount.toFixed(2)} → ${(activity.amount + activity.roundup).toFixed(2)}</p>
                  )}
                  <p className="font-medium text-primary">+${activity.roundup.toFixed(2)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}