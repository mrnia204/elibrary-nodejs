import { act, useEffect, useState } from "react";
import { useLogout } from "@/hooks/useLogout";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useActivityTracker } from "@/hooks/useActivityTracker";
import { get } from "@/lib/http";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import Dropdown from "../shared/SingleDropdown";
import StudentDashboard from "./StudentDashboard";
import MyProgress from "./Myprogress";
import Calendar from "./dynamicCalendar";
import Announcements from "./Announcements";

const views = [
  { view: "Dashboard", icon: "ri-dashboard-line"},
  { view: "My Progress", icon: "ri-line-chart-line"},
  { view: "Calendar", icon: "ri-calendar-line"},
  { view: "Announcements", icon: "ri-notification-line"},
]; 


interface StudentData {
  student_id: string;
  full_name: string;
  email: string;
  phone: string;
  grade: string;
  class: string;
  address: string;
  user_id: number;
}

const NavigationStudent = () => {
  const { logout } = useLogout();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [active, setActive] = useState("Dashboard");
  const [student, setStudent] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(true);

  useActivityTracker(); // Auto update time spent


  useEffect(() => {
    if (!user) {
      navigate("/student-login");
      return;
    }

    if (user.role !== 'student') {
      navigate("/student-login");
      return;
    }

    // fetch student data using the user date from useAuth
    const numericUserId = Number(user.user_id);
    fetchStudentData(numericUserId);

  }, [user, navigate]);

  async function fetchStudentData( user_id: number) {
    setLoading(true);

    try {
      const response = await get("/student/getStudent", {user_id});

      if (response?.success) {
        setStudent(response.data);
      } else {
        console.error("Failed to fetch student data:", response.message);
      }
    } catch (error: unknown) {
      console.error("Fetching error:", error)
    } finally {
      setLoading(false);
    }
  } 

  async function logoutHandler() {
    await logout();
  }

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
            <h2 className="text-lg md:text-xl font-bold">Student Portal</h2>
            <p className="text-sm text-gray-600">
              {loading ?"Loading..." : student ? `Welcome back, ${student.full_name}`: "Welcome Back Dear" }
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button className="bg-teal-600 hover:bg-teal-800 text-white px-4 py-2 rounded-full">
            <a href="https://mrnia.vercel.app/" className="flex items-center justify-center">
              <i className="ri-book-open-line mr-2"></i>
              Access eLibrary
            </a>
          </Button>

          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">
              <Dropdown 
                full_name={student?.full_name || "student"} 
                user_id={Number(user?.user_id)}
              />
            </span>
          </div>
        </div>
      </CardContent>
    </Card>

    {/** Nav tabs */}
    <nav className="wrapper mt-8 border-b border-gray-200">
      <div className="flex space-x-6">
        {views.map((tab, index) => (
          <Button 
            key={index}
            variant="ghost"
            onClick={() => setActive(tab.view)}
            className={`flex items-center space-x-2 text-sm font-medium border-b-2 transition-all duration-150 ${
              active === tab.view
              ? "border-teal-500 text-teal-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}          
          >
            <i className={`${tab.icon}`}></i>
            <span>{tab.view}</span>
          </Button>
        ))}
      </div>
    </nav>

    <Card>
      <CardContent>
        {active === "Dashboard" && <StudentDashboard student={student} loading={loading} />}
        {active === "My Progress" && <MyProgress />}
        {active === "Calendar" && <Calendar />}
        {active === "Announcements" && <Announcements />}
      </CardContent>
    </Card>
      
   </div>
  );
}
 
export default NavigationStudent;