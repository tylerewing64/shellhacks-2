import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const data = [
  { name: "Entertainments", value: 400 },
  { name: "Platform", value: 300 },
  { name: "Shopping", value: 300 },
  { name: "Food & Health", value: 500 },
];

const COLORS = ["#00C49F", "#0088FE", "#FF8042", "#FF4444"];

function ExpensesChart() {
  return (
    <div style={{ textAlign: "center" }}>
      <h2>All Expenses</h2>
      <PieChart width={400} height={300}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={70}
          outerRadius={100}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
}

export default ExpensesChart;
