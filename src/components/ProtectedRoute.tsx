import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const validateSession = useAuthStore((state) => state.validateSession);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    const { isValid } = validateSession();
    if (!isValid) {
      logout();
    }
  }, [validateSession, logout]);

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};
