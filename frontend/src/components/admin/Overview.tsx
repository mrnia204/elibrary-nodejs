import { useState } from "react";
import {
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
} from "recharts";
import { get } from "@/lib/http";

import DashboardStats from "./dashboard/DashboardStats";






const Overview = () => {

  return ( 
    <>
      
      <DashboardStats />
      {/** Charts */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Weekly Usage Chart 

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Weekly Usage Trends
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyUsageData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="users"
                stroke="#14B8A6"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Grade Distribution Chart *
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Grade Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={gradeData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {gradeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div> 
      </div>  */}
    </>
  );
}
 
export default Overview;