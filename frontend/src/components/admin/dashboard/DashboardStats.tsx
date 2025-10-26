import { get } from "@/lib/http";
import { useEffect, useState } from "react";

interface DashboardStats {
  total_students: number;
  total_grades: number;
  total_classes: number; // Fixed typo: was "total_clases"
  total_hours: number;
  students_per_grade: { grade: string; student_count: number }[]; // Fixed property name
}

const DashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);


      const response = await get('/getDashboard');

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
          {stats.students_per_grade && stats.students_per_grade.length > 0 ? (
            stats.students_per_grade.map((item) => (
              <div key={item.grade} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{item.student_count}</div>
                <div className="text-sm text-gray-600">Grade {item.grade}</div>
              </div>
            ))
           ) : (
            <div className="text-gray-400 text-center col-span-full">No data available</div>
          )}
        </div>
      </div> 
    </div>
  );
}

export default DashboardStats;