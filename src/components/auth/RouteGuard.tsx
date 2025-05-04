
import { ReactNode, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface RouteGuardProps {
  children: ReactNode;
  requiredRole?: "employee" | "admin" | undefined;
}

const RouteGuard = ({ children, requiredRole }: RouteGuardProps) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // Handle loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-12 w-12 rounded-full border-4 border-t-primary border-primary/30 animate-spin" />
      </div>
    );
  }

  // Check if user is authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check for specific role requirements
  if (requiredRole && user.role !== requiredRole) {
    // Redirect to appropriate dashboard based on user role
    return <Navigate to={user.role === "admin" ? "/admin" : "/dashboard"} replace />;
  }

  return <>{children}</>;
};

export default RouteGuard;
