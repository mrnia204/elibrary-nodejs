import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import Overview from "./Overview";
import StudentManagement from "./dashboard/DashboardStudentManagement";
import AnalyticsDashboard from "./Analytics";
import Reports from "./Reports";
import { useNavigate } from "react-router-dom";
import { useLogout } from "@/hooks/useLogout";
import { useActivityTracker } from "@/hooks/useActivityTracker";
import Dropdown from "../shared/SingleDropdown";
import { useAuth } from "@/contexts/AuthContext"; // Import useAuth
import { Card, CardContent } from "../ui/card";

const views = [
  { view: "Overview", icon: "ri-dashboard-line"},
  { view: "Student Management", icon: "ri-group-line"},
  { view: "Analytics", icon: "ri-bar-chart-line"},
  { view: "Reports", icon: "ri-file-chart-line"},
]; 

const NavigationAdmin = () => {
  const [active, setActive] = useState("Overview");
  const navigate = useNavigate();
  const { logout } = useLogout();
  const { user } = useAuth(); // Use the useAuth hook
  useActivityTracker();

  useEffect(() => {
    if (!user) {
      navigate("/admin-login");
      return;
    }

    if (user.role !== "admin") {
      navigate("/student-login");
    }
  }, [user, navigate]);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/** Header */}
      <Card className="bg-white shadow-sm border-b">
      <CardContent className="flex justify-between items-center py-4">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-self-center">
            <i className="ri-graduation-cap-fill text-white text-xl"></i>
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-bold">Admin Dashboard</h2>
            <p className="text-sm text-gray-600">School eLibrary System</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button className="bg-teal-600 hover:bg-teal-800 text-white px-4 py-2 rounded-full">
            <a href="https://mrnia.vercel.app/" className="flex items-center justify-center">
              <i className="ri-download-line mr-2"></i>
              Export Data
            </a>
          </Button>

          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">
              <Dropdown 
                full_name="admin" 
                user_id={Number(user?.user_id)}
              />
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
      {/** Navigation Tabs */}
      <nav className="wrapper mt-8 border-b border-gray-200">
        <div className="flex space-x-6">
          {views.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActive(tab.view)}
              className={`flex items-center space-x-2 text-sm font-medium border-b-2 transition-all duration-150 ${
                active === tab.view 
                ? "border-teal-500 text-teal-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <i className={`${tab.icon}`}></i>
              <span>{tab.view}</span>
            </button>
          ))}
        </div>
      </nav>

      {/** Content */}
      <main className="wrapper py-8 space-y-8">
        {active === "Overview" && <Overview />}
        {active === "Student Management" && <StudentManagement />}
        {active === "Analytics" && <AnalyticsDashboard />}
        {active === "Reports" && <Reports />}
      </main>
    </div>
  );
}

export default NavigationAdmin;