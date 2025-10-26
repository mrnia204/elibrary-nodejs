import { Outlet, useNavigate } from "react-router-dom";
import Footer from "./pages/Footer";
import { useEffect } from "react";

const App = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in on app start
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      // User not found
      navigate("/");
    } else {
      // user exists, parse and check role
      try {
        const user = JSON.parse(userStr);
        if(user.role === 'admin'){
          navigate("/admin-login");
        } else if (user.role === 'student') {
          navigate("/student-login");
        } 
        // if role doesn't match stay on the current page
      } catch (error) {
        console.error("Error parsing user date", error);
        localStorage.removeItem('user'); // clear invalid data
        navigate("/");
      }
    }
   
  },[navigate]);

  return ( 
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-grow px-4 sm:px-6 lg:px-8 pyh-6">
        <div className="mx-w-7xl mx-auto w-full">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}
 
export default App;