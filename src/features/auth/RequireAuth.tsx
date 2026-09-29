import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router";
import { paths } from "@/app/paths";
import Loading from "@/components/ui/Loading";
import { useAuthContext } from "@/features/auth/useAuthContext";

/** Screens that need an account: wait for Firebase, then send guests to sign in and back. */
const RequireAuth = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuthContext();
  const location = useLocation();

  if (loading) return <Loading />;
  if (!user) {
    const back = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`${paths.signIn}?volver=${back}`} replace />;
  }
  return <>{children}</>;
};

export default RequireAuth;
