import { get } from "@/lib/http";
import { useEffect, useState } from "react";
import TimeSpentPieChart from "../charts/pieOverview";

type TimeRow = {
  grade: string;
  class: string;
  total_time_spent: number;
}

interface DashboardStats {
  total_students: number;
  total_grades: number;
  total_classes: number; 
  total_hours: number;
  studentsPerGrade: { grade: string; student_count: number }[]; // Fixed property name
  timeSpentInWeek: TimeRow[];
}

const Overview = () => {
  const [stats, setStats] = useState<DashboardStats>({
    total_students: 0,
    total_grades: 0,
    total_classes: 0,
    total_hours: 0,
    studentsPerGrade: [],
    timeSpentInWeek: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);


      const response = await get('/admin/adminDashboard');
      console.log("Dashboard response", response.data);

      if (response && response.success) {
        setStats(response.data);
      } else {
        setError("Failed to fetch statistics");
      }
    } catch (error) {
      console.error(error);
      setError("Failed to fetch statistics");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <p className="text-lg">Loading statistics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center p-8">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Main Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Total Students Card */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="bg-blue-500 w-12 h-12 rounded-lg flex items-center justify-center">
              <i className="ri-user-line text-xl text-white"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total_students}</p>
            </div>
          </div>
        </div>

        {/* Total Hours Card */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="bg-green-500 w-12 h-12 rounded-lg flex items-center justify-center">
              <i className="ri-time-line text-xl text-white"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Hours</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total_hours}h</p>
            </div>
          </div>
        </div>

        {/* Total Grades Card */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
          <div className="flex items-center">
            <div className="bg-purple-500 w-12 h-12 rounded-lg flex items-center justify-center">
              <i className="ri-graduation-cap-line text-xl text-white"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Grades</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total_grades}</p>
            </div>
          </div>
        </div>

        {/* Total Classes Card */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500">
          <div className="flex items-center">
            <div className="bg-orange-500 w-12 h-12 rounded-lg flex items-center justify-center">
              <i className="ri-building-line text-xl text-white"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Classes</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total_classes}</p>
            </div>
          </div>
        </div>
      </div>

      {/*Students per Grade Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Students per Grade</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {stats.studentsPerGrade.map((item) => (
              <div key={item.grade} className="text-center p-4 bg-teal-100 rounded-lg">   
                <p className="text-sm text-gray-600">Grade {item.grade}</p>
                <p className="text-2xl font-bold text-blue-600">{item.student_count}</p>
              </div>
            ))}
        </div>
      </div> 

      {/** Time spent in a week by grade and class */}
      <TimeSpentPieChart data={stats.timeSpentInWeek} height={500} />
      
    </div>
  );
}

export default Overview;