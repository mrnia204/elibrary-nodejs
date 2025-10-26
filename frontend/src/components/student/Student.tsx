import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import MyProgress from "./Myprogress";
import Calendar from "./Calendar";
import Announcements from "./Announcements";

import { useLogout } from "@/hooks/useLogout";
import { useActivityTracker } from "@/hooks/useActivityTracker";
import { useAsyncValue } from "react-router-dom";
import Dropdown from "../shared/SingleDropdown";
import StudentDashboard from "./StudentDashboard";


const views = [
  { view: "Dashboard", icon: "ri-dashboard-line"},
  { view: "My Progress", icon: "ri-line-chart-line"},
  { view: "Calendar", icon: "ri-calendar-line"},
  { view: "Announcements", icon: "ri-notification-line"},
]; 

const Student = () => {
  useAsyncValue(); // this tracks time automatically
  const[active, setActive] = useState("Dashboard");

  const { logout } = useLogout();
  useActivityTracker(); // this will auto update time spent
  
  const navigate = useNavigate();


  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/student-login"); // stay in the login form
    } else {
      const parsed = JSON.parse(user);
      if (parsed.role !== "student") {
        navigate("/admin-login");
      }
    }
  }, [navigate])

  return ( 
    <div className="min-h-screen bg-gray-50">

      {/** Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="wrapper">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center">
                <i className="ri-graduation-cap-fill text-white text-xl"></i>
              </div>
              <div>
                <h2 className="text-xl font-bold">Student Portal</h2>
                <p className="text-sm text-gray-600"> Welcome back, full_name</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2">
                <a href="#">
                  <i className="ri-book-open-line mr-2"></i>Access eLibrary
                </a>
              </Button>
              <div className="flex items-center space-x-2">     
                <span className="text-sm font-medium text-gray-700">
                  <Dropdown title="Student"/>
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>
      {/** Navigation */}
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
      
      {/** content */}
      <main className="wrapper mt-6">
        {active === "Dashboard" && <StudentDashboard />}
        {active === "My Progress" && <MyProgress />}
        {active === "Calendar" && <Calendar />}
        {active === "Announcements" && <Announcements />}

      </main>
    </div>
  );
}
 
export default Student;