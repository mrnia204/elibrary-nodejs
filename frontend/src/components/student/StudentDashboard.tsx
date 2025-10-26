import { useEffect, useState } from "react";
import { get } from "@/lib/http";
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
};

interface Events {
  title: string;
  date: string;
  color: string;
  
};

interface PieData {
  name: string;
  value: number;
  color: string;
}




const StudentDashboard = ({ username}: {username: string}) => {
  const[student, setStudent]=useState<Student | null>(null);
  const[loading, setLoading] = useState(false);;
  const[error, setError]=useState<string | null>(null);

  useEffect(() => {
    const fetchStudent = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await get('/getStudent', {username});

        if (response?.success) {
          setStudent(response.data);
        } else {
          setError(response?.message || "Failed to fetch student data");
        }

      } catch (error) {
        console.error(error);
        setError("Error fetching student data");
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchStudent();
    } else {
      setError("Username is required")
    }

  },[username])

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

  if (loading) return <p className="text-gray-700 text-center">loading students ... </p>
  if (error) return <p className="text-red-500 text-center">{error} </p>
  if (!student) return <p className="text-gray-700 text-center">No student data</p>

  return (
     <div className="wrapper py-8">
      <div className="space-y-6">
        {/** Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center`}>
                      <i className={`text-lg`}></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{student.full_name}</p>
                    <p className="text-xl font-bold text-gray-900">{student.grade}</p>
                  </div>
                </div>
              </div> 
        </div>

        {/** layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/** Chart*/}
          <Card className="bg-white rounded-lg shadow p-6">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 mb-4">Weekly Activity Breakdown</CardTitle>
            </CardHeader>
            <CardContent className='p-2'>
              <ResponsiveContainer width={400} height={400}>
                <PieChart>
                  <Pie
                    data={pieData as any}
                    cx={200}
                    labelLine={false}
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, value}) => `${name}: ${value}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke='#fff'/>
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #ccc",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className='bg-white rounded-lg shadow'>
            <CardHeader>
              <CardTitle className='text-lg font-semibold text-gray-900'>Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent className='space-y-3 max-h-80 overflow-y-auto'>
              {events.map((event, index) => (
                <div key={index} className="flex items-center p-3 border-b-gray-50 rounded-lg">
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

         {/** Quick action */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {quickActions.map((item, index) => (
                <button key={index} className={`${item.bgClass} px-4 py-2 flex items-center p-4 rounded-lg transition-colors cursor-pointer`}>
                  <a href={item.link}>
                    <i className={`${item.icon} text-2xl mr-3`}></i>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">{item.title}</p>
                      <p className="text-sm text-gray-600">{item.content}</p>
                    </div>
                  </a>
                </button>
              ))}
            </div>
          </div>
      </div>
    </div>
  );
}
 
export default StudentDashboard;