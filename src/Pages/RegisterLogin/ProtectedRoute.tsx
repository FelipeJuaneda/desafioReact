import type { ReactNode } from "react";
import { Navigate } from "react-router";
import { useAuthContext } from "../../contexts/AuthContext";
import Loading from "../../components/Loading/Loading";
const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuthContext();

  if (loading) return <Loading />;

  if (!user) return <Navigate to={"/login"} />;
  return <>{children}</>;
};

export default ProtectedRoute;
