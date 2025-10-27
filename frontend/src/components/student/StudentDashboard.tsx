import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { quickActions } from "@/data/student";

interface Student {
  student_id: string;
  full_name: string;
  email: string;
  phone: string;
  grade: string;
  class: string;
  address: string;
}

interface Events {
  title: string;
  date: string;
  color: string;
}

interface PieData {
  name: string;
  value: number;
  color: string;
}

interface StudentDashboardProps {
  student: Student | null;
  loading: boolean;
}

const StudentDashboard = ({ student, loading }: StudentDashboardProps) => {
  // Dummy data for chart
  const pieData: PieData[] = [
    { name: 'Math', value: 30, color: '#4ade80' },
    { name: 'Science', value: 20, color: '#60a5fa' },
    { name: 'English', value: 50, color: '#f472b6' },
  ];

  // Dummy upcoming events
  const events: Events[] = [
    { title: 'Math Exam', date: '2025-11-01', color: 'bg-green-500' },
    { title: 'Science Fair', date: '2025-11-05', color: 'bg-blue-500' },
  ];

  if (loading) return <p className="text-gray-700 text-center py-8">Loading student data...</p>;
  if (!student) return <p className="text-gray-700 text-center py-8">No student data available</p>;

  return (
    <div className="space-y-6">
      {/** Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white rounded-lg shadow">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <i className="ri-user-line text-blue-600 text-lg"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Student Name</p>
                <p className="text-xl font-bold text-gray-900">{student.full_name}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-lg shadow">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <i className="ri-award-line text-green-600 text-lg"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Grade</p>
                <p className="text-xl font-bold text-gray-900">{student.grade}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-lg shadow">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <i className="ri-team-line text-purple-600 text-lg"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Class</p>
                <p className="text-xl font-bold text-gray-900">{student.class}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-lg shadow">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <i className="ri-mail-line text-orange-600 text-lg"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Email</p>
                <p className="text-sm font-bold text-gray-900 truncate">{student.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/** Chart and Events Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/** Chart */}
        <Card className="bg-white rounded-lg shadow">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Weekly Activity Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#fff" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #ccc",
                    borderRadius: "6px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/** Events */}
        <Card className="bg-white rounded-lg shadow">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 max-h-80 overflow-y-auto">
            {events.map((event, index) => (
              <div key={index} className="flex items-center p-3 border-b border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                <div className={`w-3 h-3 rounded-full mr-3 ${event.color}`} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{event.title}</p>
                  <p className="text-xs text-gray-600">{event.date}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>  
      </div>

      {/** Quick Actions */}
      <Card className="bg-white rounded-lg shadow">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((item, index) => (
              <a
                key={index}
                href={item.link}
                className={`${item.bgClass} px-4 py-4 flex items-center rounded-lg transition-all hover:shadow-md cursor-pointer no-underline`}
              >
                <i className={`${item.icon} text-2xl mr-3`}></i>
                <div className="text-left">
                  <p className="font-medium text-gray-900">{item.title}</p>
                  <p className="text-sm text-gray-600">{item.content}</p>
                </div>
              </a>
            ))}
          </div>
        </CardContent>
      </Card>

      {/** Additional Student Info */}
      <Card className="bg-white rounded-lg shadow">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Student ID</p>
              <p className="font-medium text-gray-900">{student.student_id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Phone</p>
              <p className="font-medium text-gray-900">{student.phone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Address</p>
              <p className="font-medium text-gray-900">{student.address}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default StudentDashboard;