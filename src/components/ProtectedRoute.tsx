import React, { useEffect, useCallback } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const validateSession = useAuthStore((state) => state.validateSession);
  const updateActivity = useAuthStore((state) => state.updateActivity);
  const logout = useAuthStore((state) => state.logout);

  // Validate session on mount and periodically
  useEffect(() => {
    const { isValid } = validateSession();
    if (!isValid) {
      logout();
    }

    // Check session validity every 1 minute
    const sessionCheckInterval = setInterval(() => {
      const { isValid } = validateSession();
      if (!isValid) {
        logout();
      }
    }, 60000);

    return () => clearInterval(sessionCheckInterval);
  }, [validateSession, logout]);

  // Track user activity
  const handleActivity = useCallback(() => {
    updateActivity();
  }, [updateActivity]);

  // Update activity on various user interactions
  useEffect(() => {
    const events = ["mousedown", "keydown", "scroll", "touchstart", "click"];
    
    events.forEach((event) => {
      window.addEventListener(event, handleActivity);
    });

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [handleActivity]);

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};
