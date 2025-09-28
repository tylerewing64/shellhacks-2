import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const impactData = [
  { name: 'Education', value: 45, color: '#8b5cf6' },
  { name: 'Food Security', value: 30, color: '#06b6d4' },
  { name: 'Healthcare', value: 15, color: '#10b981' },
  { name: 'Environment', value: 10, color: '#f59e0b' },
];

const monthlyDonations = [
  { month: 'January 2024', donations: '$18.67', transactions: 28 },
  { month: 'February 2024', donations: '$22.34', transactions: 35 },
  { month: 'March 2024', donations: '$31.45', transactions: 42 },
  { month: 'April 2024', donations: '$28.12', transactions: 38 },
  { month: 'May 2024', donations: '$35.78', transactions: 47 },
  { month: 'June 2024', donations: '$23.45', transactions: 43 },
];

export function ImpactOverview() {
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
            <div className="text-xl font-bold">$247.82</div>
            <p className="text-xs text-muted-foreground">+$23.45 this month</p>
          </div>

          {/* Round-ups This Month */}
          <div className="p-2 border border-border/50 rounded-lg text-center">
            <div className="text-sm text-muted-foreground">Round-ups This Month</div>
            <div className="text-xl font-bold">43</div>
            <p className="text-xs text-muted-foreground">Avg: $0.54 per transaction</p>
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
