import { useAppSelector } from "@/hooks";
import { Navigate, Outlet } from "react-router-dom";

const AuthRoutes = () => {
  const { isLoggedIn } = useAppSelector((state) => state.auth);

  return isLoggedIn ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

export default AuthRoutes;
