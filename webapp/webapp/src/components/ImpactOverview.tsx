import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import DashboardService from '../services/dashboardService';

const categoryColors = {
  'community': '#4F46E5',
  'education': '#059669', 
  'healthcare': '#DC2626',
  'environment': '#7C3AED',
  'animals': '#F59E0B',
  'other': '#6B7280'
};

interface ImpactData {
  balance: {
    current_balance: string; // API returns strings
    total_accumulated: string; // API returns strings
    total_donated: string; // API returns strings
  };
  monthlyStats: Array<{
    month: string;
    donation_count: number;
    total_donated: string; // API returns strings
  }>;
  topOrganizations: Array<{
    name: string;
    logo_url: string;
    category: string;
    total_donated: string; // API returns strings
    donation_count: number;
  }>;
  impactMetrics: Array<{
    organization_name: string;
    metric_name: string;
    metric_value: number;
    unit: string;
    description: string;
  }>;
}

export function ImpactOverview() {
  const [data, setData] = useState<ImpactData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const impactData = await DashboardService.getImpactOverview();
      setData(impactData);
    } catch (err) {
      setError('Failed to load impact data');
      console.error('Error loading impact data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="flex flex-col gap-4">
          <CardHeader>
            <CardTitle>Key Metrics</CardTitle>
          </CardHeader>
          <CardContent className="p-2 space-y-4">
            <div className="p-2 border border-border/50 rounded-lg text-center">
              <div className="text-sm text-muted-foreground">Loading...</div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="flex flex-col gap-4">
          <CardHeader>
            <CardTitle>Key Metrics</CardTitle>
          </CardHeader>
          <CardContent className="p-2 space-y-4">
            <div className="p-2 border border-border/50 rounded-lg text-center">
              <div className="text-sm text-red-500">Error loading data</div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Transform data for charts - convert strings to numbers
  const balance = {
    current_balance: parseFloat(data.balance.current_balance) || 0,
    total_accumulated: parseFloat(data.balance.total_accumulated) || 0,
    total_donated: parseFloat(data.balance.total_donated) || 0
  };

  const impactData = data.topOrganizations.map(org => ({
    name: org.name,
    value: Math.round((parseFloat(org.total_donated) / balance.total_donated) * 100),
    color: categoryColors[org.category] || categoryColors.other
  }));

  const monthlyDonations = data.monthlyStats.map(stat => ({
    month: new Date(stat.month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    donations: `$${parseFloat(stat.total_donated).toFixed(2)}`,
    transactions: stat.donation_count
  }));

  const currentMonth = data.monthlyStats[0];
  const previousMonth = data.monthlyStats[1];
  const monthlyChange = previousMonth ? 
    parseFloat(currentMonth.total_donated) - parseFloat(previousMonth.total_donated) : 0;
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Metrics Card */}
      <Card className="flex flex-col gap-4">
        <CardHeader>
          <CardTitle>Key Metrics</CardTitle>
        </CardHeader>
        <CardContent className="p-2 space-y-4">
          {/* Total Donated */}
          <div className="p-2 border border-border/50 rounded-lg text-center">
            <div className="text-sm text-muted-foreground">Total Donated</div>
            <div className="text-xl font-bold">${balance.total_donated.toFixed(2)}</div>
            <p className={`text-xs ${monthlyChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {monthlyChange >= 0 ? '+' : ''}${monthlyChange.toFixed(2)} this month
            </p>
          </div>

          {/* Current Balance */}
          <div className="p-2 border border-border/50 rounded-lg text-center">
            <div className="text-sm text-muted-foreground">Current Balance</div>
            <div className="text-xl font-bold">${balance.current_balance.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Ready to donate</p>
          </div>

          {/* Round-ups This Month */}
          <div className="p-2 border border-border/50 rounded-lg text-center">
            <div className="text-sm text-muted-foreground">Round-ups This Month</div>
            <div className="text-xl font-bold">{currentMonth?.donation_count || 0}</div>
            <p className="text-xs text-muted-foreground">
              Avg: ${currentMonth ? (parseFloat(currentMonth.total_donated) / currentMonth.donation_count).toFixed(2) : '0.00'} per donation
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Donation Allocation Chart */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Donation Allocation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={impactData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {impactData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}%`, 'Allocation']} />
            </PieChart>
          </ResponsiveContainer>

          {/* Legend */}
          <div className="grid grid-cols-2 gap-2">
            {impactData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-sm">{item.name} ({item.value}%)</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Donations Table */}
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Monthly Donations (Last 6 Months)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Month</TableHead>
                <TableHead>Total Donated</TableHead>
                <TableHead>Transactions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {monthlyDonations.map((month) => (
                <TableRow key={month.month}>
                  <TableCell className="font-medium">{month.month}</TableCell>
                  <TableCell>{month.donations}</TableCell>
                  <TableCell>{month.transactions}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

    </div>
  );
}
