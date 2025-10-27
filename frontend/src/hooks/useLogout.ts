// src/hooks/useLogout.ts
import { post } from "@/lib/http";
import { useNavigate } from "react-router-dom";

export const useLogout = () => {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      const userStr = localStorage.getItem('user');
      
      if (!userStr) {
        // No user found, just clear and redirect
        localStorage.removeItem('user');
        navigate('/');
        return;
      }

      const user = JSON.parse(userStr);
      const userRole = user.role;

      // Call logout API to record logout time
      if (user.userId && user.activityId) {
        try {
          await post('/log-activity', {
            user_id: user.userId, // Match your backend expectation
            action: 'logout',
            activity_id: user.activityId // Match your backend expectation
          });
          console.log("Logout activity recorded successfully");
        } catch (error) {
          console.error("Failed to record logout activity:", error);
          // Continue with logout even if activity logging fails
        }
      }

      // Clear localStorage
      localStorage.removeItem('user');

      // Navigate based on role
      if (userRole === 'admin') {
        navigate('/admin-login');
      } else if (userRole === 'student') {
        navigate('/student-login');
      } else {
        console.log("Unknown user role, redirecting to home");
        navigate('/');
      }
    } catch (error) {
      console.error("Logout error", error);
      // Ensure localStorage is cleared even on error
      localStorage.removeItem('user');
      navigate('/');
    }
  };

  return { logout };
};