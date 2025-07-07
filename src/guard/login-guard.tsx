import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ReactNode } from "react";

interface LoginGuardProps {
  children: ReactNode;
}

const LoginGuard = ({ children }: LoginGuardProps) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/user/calendar" replace />;
  }

  return children;
};

export default LoginGuard;
