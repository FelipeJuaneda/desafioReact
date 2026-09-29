import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router";
import { paths } from "@/app/paths";
import { useAuthContext } from "@/features/auth/useAuthContext";

/** Screens that need an account: wait for Firebase, then send guests to sign in and back. */
const RequireAuth = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuthContext();
  const location = useLocation();

  // Firebase restores the session in a few ms; hold an empty ground instead of a spinner flash.
  if (loading)
    return <div aria-busy="true" aria-label="Verificando tu sesión" className="min-h-[60dvh]" />;
  if (!user) {
    const back = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`${paths.signIn}?volver=${back}`} replace />;
  }
  return <>{children}</>;
};

export default RequireAuth;
