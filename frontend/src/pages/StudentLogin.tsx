import { NavLink } from "react-router-dom";
import StudentLoginForm from "@/components/constant/StudentFormLogin";

const Loginpage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-300 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto">
              <i className="ri-graduation-cap-line text-3xl text-white"></i>
            </div>
            <h1 className="h2-bold">Student Portal</h1>
            <p className="p-standard">Sign in to access your eLibrary</p>
          </div>
          <StudentLoginForm />
          <div className="mt-6 flex justify-between items-center">
            <span className="text-sm text-blue-600 cursor-pointer hover:underline">
              <NavLink to='/' className="text-sm">Back to Home</NavLink>
            </span>
            <p className="text-sm text-gray-600">Administrator?
              <NavLink to="/admin-login" className="text-blue-600 pl-2">Sign in here </NavLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
 
export default Loginpage;