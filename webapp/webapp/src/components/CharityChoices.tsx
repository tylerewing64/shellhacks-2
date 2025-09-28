import { Table } from "lucide-react";
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "./ui/table";

const monthlyDonations = [
  { month: "Januarary", donations: "$200", transactions: "5" },
];
function CharityChoices() {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Monthly Donations (Last 6 Months)</CardTitle>
      </CardHeader>
      <CardContent>
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
  );
}

export default CharityChoices;
