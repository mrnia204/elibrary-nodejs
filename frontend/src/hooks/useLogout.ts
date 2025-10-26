// src/hooks/useLogout.ts

import { post } from "@/lib/http";
import { useNavigate } from "react-router-dom";

export const useLogout = () => {
  const navigate = useNavigate();

  const logout = async() => {
    try {
      const userStr = localStorage.getItem('user');
      let userRole = null;

      if (userStr) {
        const user = JSON.parse(userStr);
        userRole = user.role;

        // Call logout API to record logout time
        if (user.activity_id) {
          await post('/log-activity', {
            user_id: user.user_id,
            action: 'logout',
            activity_id: user.activity_id
          });
        }

        // Clear localStorage
        localStorage.removeItem('user');

        // Navigate based on role
        if (userRole === 'admin') {
          navigate('/admin-login');
        } else if (userRole === 'student') {
          navigate('/student-login');
        }else {
          console.log("Wrong login page");  // fallback
          navigate('/');
        }
      }
    } catch(error) {
      console.error("Logout error", error);
      localStorage.removeItem('user');
      navigate('/')
    }
  }
  return { logout };
}
