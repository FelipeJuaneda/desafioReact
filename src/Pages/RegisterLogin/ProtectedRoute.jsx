import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext";
import Loading from "../../components/Loading/Loading";
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuthContext();

  if (loading) <Loading />;

  if (!user) return <Navigate to={"/login"} />;
  return <>{children}</>;
};

export default ProtectedRoute;
