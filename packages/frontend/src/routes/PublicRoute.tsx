import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LoadingOverlay } from "../components/common/LoadingOverlay";

interface PublicRouteProps {
  children: React.ReactNode;
}

export function PublicRoute({ children }: PublicRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingOverlay />;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
