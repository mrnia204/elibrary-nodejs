import { useState, useRef, useEffect, act } from "react";
import { useLogout } from "@/hooks/useLogout";
import { Button } from "@/components/ui/button";
import { post } from "@/lib/http";
import { success } from "zod";

// define props interface
interface DropdownProps {
  title: string;
  userId: number; // add userId prop
}

const INACTIVITY_LIMIT = 5 * 60 * 1000; // 5 minutes
const UPDATE_INTERVAL = 2 * 60 * 1000; // 2 minutes

const Dropdown = ({title, userId}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { logout } = useLogout();
  const activityIdRef = useRef<number | null>(null);
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

  // Activity tracking
  const resetInactivityTimer = () => {
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    inactivityTimer.current = setTimeout(() => {
      handleLogout(true); // auto logout
    }, INACTIVITY_LIMIT);
  };

  // Send login and store activityId
  const startActivity = async () => {
    if (!userId) return;
    try {
      const res = await post("/log-activity", {user_id: userId, action: "login"});
      activityIdRef.current = res.data.activity_id;
      resetInactivityTimer();
    } catch (error) {
      console.error("Failed to start activity", error);
    }
  }; 

  // send update ping
  const updateActivity = async () => {
    if (!activityIdRef.current) return;

    try {
      await post("/log-activity", {user_id: userId, action: 'update', activity_id: activityIdRef.current });
    } catch (error) {
      console.error("Failed to update activity", error);
    }
  };

  
  // Logout function manual or auto
  const handleLogout = async(auto = false) => {
    if (activityIdRef.current) {
      try {
        await post("/log-activity", { user_id: userId, action: "logout", activity_id: activityIdRef.current});
      } catch (error) {
        console.log("Failed to logout", error);
      }
      activityIdRef.current = null;
    }
    logout();
    setIsOpen(false);
    if (auto) alert ("You were logged out due to inactivity."); // optional notification
  };

  // setup activity listeners
  useEffect(() => {
    startActivity();

    // user activity events
    const events = ["mousemove", "keydown", "click"];
    events.forEach(ev => window.addEventListener(ev, resetInactivityTimer));

    // periodic update
    const updateInterval = setInterval(updateActivity, UPDATE_INTERVAL);

    // Logout on browser
    const handleUnload = () => {
      if (activityIdRef.current) {
        navigator.sendBeacon("http://localhost:3001/log-activity", new Blob([JSON.stringify({
          user_id: userId,
          action: 'logout',
          activity_id: activityIdRef.current
        })], {type: 'application/json'}));

        if (!success) {
          // Fallback store in sessionStorage for next page load
          sessionStorage.setItem('pending_logout', JSON.stringify({
            user_id: userId,
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
    }
  }, [userId]);


  return (
    <div className="relative" ref={dropdownRef}>
      {/* Admin Button - Triggers Dropdown */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="ghost"
        className="flex items-center gap-2 text-gray-900 px-4 py-2"
      >
        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
          <i className="ri-user-fill text-gray-600"></i>
        </div>
        <span className="text-sm font-medium">{title}</span>
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
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
          <div className="py-1">
            {/* User Info */}
            <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
              Signed in as {title}
            </div>
            
            {/* Logout Button */}
            <button
              onClick={() => handleLogout(false)}
              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;