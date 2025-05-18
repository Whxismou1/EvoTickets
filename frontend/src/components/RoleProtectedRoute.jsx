import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const RoleProtectedRoute = ({ allowedRoles }) => {
  const { token, role } = useAuthStore();
  if (!token) return <Navigate to="/login" />;


  if (!allowedRoles.includes(role)) return <Navigate to="/not-found" />;

  return <Outlet />;
};

export default RoleProtectedRoute;