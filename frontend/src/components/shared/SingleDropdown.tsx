import { useState, useRef, useEffect } from "react";
import { useLogout } from "@/hooks/useLogout";
import { Button } from "@/components/ui/button";
import { post } from "@/lib/http";
import { Link } from "react-router-dom";

// Define props interface
interface DropdownProps {
  full_name: string;
  user_id?: number; // Changed to string to match your user structure, made optional
}



const INACTIVITY_LIMIT = 5 * 60 * 1000; // 5 minutes
const UPDATE_INTERVAL = 2 * 60 * 1000; // 2 minutes

const Dropdown = ({ full_name, user_id, }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { logout } = useLogout();
  const activityIdRef = useRef<string | null>(null); // Changed to string to match your backend
  const inactivityTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Activity tracking functions
  const resetInactivityTimer = () => {
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    inactivityTimer.current = setTimeout(() => {
      handleLogout(true); // auto logout
    }, INACTIVITY_LIMIT);
  };

  // Send login and store activityId
  const startActivity = async () => {
    if (!user_id) return;
    try {
      const res = await post("/log-activity", { 
        user_id: user_id, 
        action: "login" 
      });
      
      // Handle different response structures
      if (res.activity_id) {
        activityIdRef.current = res.activity_id;
      } else if (res.data?.activity_id) {
        activityIdRef.current = res.data.activity_id;
      }
      
      resetInactivityTimer();
    } catch (error) {
      console.error("Failed to start activity", error);
    }
  }; 

  // Send update ping
  let isUpdating = false; // if a tab is inactive of network slow, then this calls
  const updateActivity = async () => {
    if (isUpdating || !activityIdRef.current || !user_id) return;
    isUpdating = true;
    try {
      await post("/log-activity", { 
        user_id: user_id, 
        action: 'update', 
        activity_id: activityIdRef.current 
      });
    } catch (error) {
      console.error("Failed to update activity", error);
    } finally {
      isUpdating = false;
    }
  };

  // Logout function manual or auto
  const handleLogout = async (auto = false) => {
    if (activityIdRef.current && user_id) {
      try {
        await post("/log-activity", { 
          user_id: user_id, 
          action: "logout", 
          activity_id: activityIdRef.current 
        });
      } catch (error) {
        console.error("Failed to log logout activity", error);
      }
      activityIdRef.current = null;
    }
    
    if (auto) {
      alert("You were logged out due to inactivity."); // optional notification
    }
    
    logout();
    setIsOpen(false);
  };

  // Setup activity listeners - only if userId is provided
  useEffect(() => {
    if (!user_id) return;
    //handleLogout(); // this cleans up old activity if any
    startActivity();

    // User activity events
    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    events.forEach(ev => window.addEventListener(ev, resetInactivityTimer));

    // Periodic update
    const updateInterval = setInterval(updateActivity, UPDATE_INTERVAL);

    // Logout on browser close
    const handleUnload = () => {
      if (activityIdRef.current && user_id) {
        // Use sendBeacon for reliable logout on page close
        const blob = new Blob([JSON.stringify({
          user_id: user_id,
          action: 'logout',
          activity_id: activityIdRef.current
        })], { type: 'application/json' });
        
        const success = navigator.sendBeacon(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/log-activity`, blob);

        if (!success) {
          // Fallback store in sessionStorage for next page load
          sessionStorage.setItem('pending_logout', JSON.stringify({
            user_id: user_id,
            activity_id: activityIdRef.current
          }));
        }
      }
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      events.forEach(ev => window.removeEventListener(ev, resetInactivityTimer));
      clearInterval(updateInterval);
      window.removeEventListener("beforeunload", handleUnload);
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    };
  }, [user_id]);

  // Get user data from localStorage for display
  const getUserData = () => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        return JSON.parse(userStr);
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
    return null;
  };

  const userData = getUserData();
  const displayName = userData?.full_name || userData?.user_id || full_name || 'User';

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Dropdown Trigger Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="ghost"
        className="flex items-center gap-2 text-gray-900 px-4 py-2 hover:bg-gray-100 transition-colors"
        aria-haspopup="menu"
        aria-expanded={isOpen} 
      >
        <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
          <i className="ri-user-fill text-white text-sm"></i>
        </div>
        <span className="text-sm font-medium hidden sm:block">{displayName}</span>
        <svg 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </Button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div 
          role="menu"
          className={`absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden ${
            isOpen
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0, -translate-y-2 pointer-events-none'
          }`}
        >
          <div className="py-2">
            {/* User Info */}
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
              <p className="text-sm font-medium text-gray-900">{displayName}</p>
              <p className="text-xs text-gray-500 mt-1">
                {userData?.role ? `${userData.role.charAt(0).toUpperCase() + userData.role.slice(1)} Account` : 'User Account'}
              </p>
            </div>
            
            {/* Menu Items */}
            <div className="py-1">
              <Link
                to='#' 
                onClick={() => setIsOpen(false)}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                role="menuitem"
              >
                <i className="ri-user-line mr-3 text-gray-400"></i>
                Profile
              </Link>
              
              <Link 
                to="#"
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                role="menuitem"
              >
                <i className="ri-settings-3-line mr-3 text-gray-400"></i>
                Settings
              </Link>
            </div>
            
            {/* Logout Button */}
            <div className="border-t border-gray-100 pt-1">
              <Button
                variant="ghost"
                onClick={() => handleLogout(false)}
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <i className="ri-logout-box-r-line mr-3"></i>
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;