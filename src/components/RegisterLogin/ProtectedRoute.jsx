import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext";
import gifLoad from "../images/pororoLoad.gif";
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuthContext();

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <img src={gifLoad} alt="cargando pagina peliculed" />
      </div>
    );
  if (!user) return <Navigate to={"/login"} />;
  return <>{children}</>;
};

export default ProtectedRoute;
