// src/hooks/useActivityTracker.ts
import { useEffect, useRef } from "react";
import { post } from "@/lib/http";

export const useActivityTracker = () => {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const updateActivity = async () => {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) return;

      const user = JSON.parse(userStr);
      
      // Check if we have the required data for update
      if (user.userId && user.activityId) {
        await post('/log-activity', {
          user_id: user.userId, // Consistent with your backend field name
          action: "update",
          activity_id: user.activityId // Consistent with your backend field name
        });
        console.log("Activity updated successfully");
      }
    } catch (error) {
      console.error("Activity update error", error);
    }
  };

  useEffect(() => {
    // Update every 5 minutes (300000 ms) to track time spent
    intervalRef.current = setInterval(updateActivity, 300000);

    // Also update on component mount to capture initial activity
    updateActivity();

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  return { updateActivity };
};