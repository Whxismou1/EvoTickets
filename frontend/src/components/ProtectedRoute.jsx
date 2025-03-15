import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const ProtectedRoute = () => {
  const { token } = useAuthStore();

  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
