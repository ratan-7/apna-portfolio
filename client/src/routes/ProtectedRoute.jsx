import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ADMIN_BASE } from "../config/adminPath";

export default function ProtectedRoute() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={`/${ADMIN_BASE}/login`} replace />;
  }

  return <Outlet />;
}