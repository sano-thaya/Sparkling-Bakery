"use client";

import { useState } from "react";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from "recharts";

type RevenueData = {
  date: string;
  revenue: number;
};

export default function RevenueChart({ data }: { data: RevenueData[] }) {
  const [range, setRange] = useState("30");

  // Filter data based on range (this is simplified; normally you'd filter actual dates)
  const displayData = data.slice(-Number(range));

  return (
    <div className="bg-white p-6 rounded-3xl shadow-soft border border-peach w-full">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-lg font-bold text-ink">Revenue Over Time</h3>
        <select 
          value={range}
          onChange={(e) => setRange(e.target.value)}
          className="bg-cream border border-peach text-ink text-sm rounded-lg focus:ring-magenta focus:border-magenta block p-2"
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 3 months</option>
        </select>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={displayData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#FCDFC8" vertical={false} />
            <XAxis 
              dataKey="date" 
              stroke="#4A2B39" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="#4A2B39" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#FFF8F3', borderRadius: '12px', border: '1px solid #FCDFC8' }}
              itemStyle={{ color: '#D6338B', fontWeight: 'bold' }}
            />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="#D6338B" 
              strokeWidth={4}
              dot={{ fill: '#D6338B', strokeWidth: 2 }}
              activeDot={{ r: 8, fill: '#7A1F4B' }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
