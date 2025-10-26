import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const studentData = [
  { name: 'Alice Johnson', hours: 45 },
  { name: 'Bob Smith', hours: 35 },
  { name: 'Carol Davis', hours: 55 },
  { name: 'David Wilson', hours: 25 },
  { name: 'Emma Brown', hours: 40 },
  { name: 'Frank Miller', hours: 30 },
  { name: 'Grace Lee', hours: 48 },
  { name: 'Henry Taylor', hours: 28 },
  { name: 'Ivy Chen', hours: 42 },
  { name: 'Jack Anderson', hours: 32 },
];

const classPerformanceData = [
  { class: '10A', avgScore: 82 },
  { class: '10B', avgScore: 75 },
  { class: '11A', avgScore: 88 },
  { class: '11B', avgScore: 79 },
  { class: '12A', avgScore: 85 },
  { class: '12B', avgScore: 90 },
];

const AnalyticsDashboard: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">Analytics Dashboard</h2>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Hours by Individual</h3>
          <div style={{ width: '100%', height: 400 }}>
            <ResponsiveContainer>
              <BarChart data={studentData} margin={{ top: 5, right: 30, left: 20, bottom: 100 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" interval={0} height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="hours" fill="#14B8A6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Class-wise Performance</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={classPerformanceData} margin={{ top: 5, right: 30, left: 20, bottom: 50 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="class" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="avgScore" fill="#6366F1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
