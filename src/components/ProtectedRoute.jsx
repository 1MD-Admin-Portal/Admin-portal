// import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom"; // 👈 this import is required

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // If not logged in, redirect to login and replace history
    return <Navigate to="/" replace />;
  }

  // If children are provided (your current usage), render them
  // Otherwise, fall back to Outlet for nested routes
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
