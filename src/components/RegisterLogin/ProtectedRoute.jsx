import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuthContext();

  if (loading) return <h1>Cargando...</h1>;
  if (!user) return <Navigate to={"/login"} />;
  return <>{children}</>;
};

export default ProtectedRoute;
