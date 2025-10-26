// src/hooks/useActivityTracker.ts
import { useEffect, useRef } from "react";
import { post } from "@/lib/http";


export const useActivityTracker = () => {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const updateActivity = async() => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user.activity_id) {
          await post('/log-activity', {
            user_id: user.user_id,
            action: "update",
            activity_id: user.activity_id
          });
        }
      }
    } catch (error) {
      console.error("Activity update error", error);
    }
  }

    useEffect(()=>{
      //update every 5 mintues (300000 ms) to track time spent
      intervalRef.current = setInterval(updateActivity, 300000);

      // Cleanup on unmount
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      }
    },[]);
  return { updateActivity};
}