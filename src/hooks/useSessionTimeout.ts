import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";

export const useSessionTimeout = () => {
  const { updateActivity, logout, validateSession } = useAuthStore();

  useEffect(() => {
    // Update activity on mount
    updateActivity();

    // Track user activity (mouse, keyboard, clicks)
    const handleActivity = () => {
      updateActivity();
    };

    const events = ["mousedown", "keydown", "scroll", "touchstart", "click"];
    events.forEach((event) => {
      document.addEventListener(event, handleActivity);
    });

    // Check session validity periodically
    const sessionCheckInterval = setInterval(
      () => {
        const { isValid } = validateSession();
        if (!isValid) {
          logout();
        }
      },
      5 * 60 * 1000,
    ); // Check every 5 minutes

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity);
      });
      clearInterval(sessionCheckInterval);
    };
  }, [updateActivity, logout, validateSession]);
};
