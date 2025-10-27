import { NavLink } from "react-router-dom";
import { SCHOOL_NAME } from "@/components/constant";

const Homepage = () => {
  return ( 
    <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="relative overflow-hidden">
        <div className="wrapper text-center py-22">
          <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-8">
            <i className="ri-graduation-cap-line text-3xl text-white"></i>
          </div>
          <h1 className="h1-bold">
            {SCHOOL_NAME}
            <span className="block text-blue-600">eLibrary Portal</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            Access your digital library, track your learning progress, and 
            stay connected with school announcements and events.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <NavLink to="/student-login">
              <button className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer">
                <i className="ri-user-line mr-2"></i>
                Student Login
              </button>
            </NavLink>
            <NavLink to="/admin-login">
              <button className="bg-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-purple-700 transition-colors whitespace-nowrap cursor-pointer">
                <i className="ri-admin-line mr-2"></i>
               Admin Login
              </button>
            </NavLink>
          </div>
          
        </div>
      </div>
    </div>
   );
}
 
export default Homepage;