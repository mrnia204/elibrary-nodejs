"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { FileText, BarChart3, PieChart } from "lucide-react";

const reports = [
  {
    title: "Monthly Report",
    description: "Student activity summary",
    icon: <FileText className="text-gray-400 w-6 h-6" />,
  },
  {
    title: "Class Performance",
    description: "Detailed class analysis",
    icon: <BarChart3 className="text-gray-400 w-6 h-6" />,
  },
  {
    title: "Usage Statistics",
    description: "System usage metrics",
    icon: <PieChart className="text-gray-400 w-6 h-6" />,
  },
];

export default function Reports() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">Reports</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report, index) => (
            <Card key={index} className="shadow">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {report.title}
                  </h3>
                  <p className="text-sm text-gray-600">{report.description}</p>
                </div>
                {report.icon}
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full bg-teal-600 hover:bg-teal-700"
                  onClick={() => alert(`Generating ${report.title}...`)}
                >
                  Generate Report
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
