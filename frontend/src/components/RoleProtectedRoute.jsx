import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const RoleProtectedRoute = ({ allowedRoles }) => {
  const { token, userRole } = useAuthStore();

  if (!token) return <Navigate to="/login" />;
  if (!allowedRoles.includes(userRole)) return <Navigate to="/not-found" />;

  return <Outlet />;
};

export default RoleProtectedRoute;
