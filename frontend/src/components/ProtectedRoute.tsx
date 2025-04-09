import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute = ({ 
  children, 
  allowedRoles = [] 
}: ProtectedRouteProps) => {
  const { isAuthenticated, user, loading } = useAuth();

  // Show loading state or spinner while checking auth
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check role-based access if roles are specified
  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    // Redirect to unauthorized page or homepage
    return <Navigate to="/" replace />;
  }

  // Render the protected content
  return <>{children}</>;
};

export default ProtectedRoute; 