import type { User } from "firebase/auth";
import { useEffect, useState, type ReactNode } from "react";
import { AuthContext, type AuthContextValue } from "@/features/auth/useAuthContext";

const loadAuth = () => import("@/services/firebase/auth");

// Stable for the app's lifetime; each call loads the SDK if it is not there yet.
const actions = {
  signUp: async (email: string, password: string) => (await loadAuth()).signUp(email, password),
  login: async (email: string, password: string) => (await loadAuth()).login(email, password),
  loginWithGoogle: async () => (await loadAuth()).loginWithGoogle(),
  resetPassword: async (email: string) => (await loadAuth()).resetPassword(email),
  logout: async () => (await loadAuth()).logout(),
};

function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    let unsubscribe: (() => void) | undefined;
    loadAuth().then(
      ({ watchUser }) => {
        if (!active) return;
        unsubscribe = watchUser((currentUser) => {
          setUser(currentUser);
          setLoading(false);
        });
      },
      // If the SDK cannot load, browse as a guest instead of waiting forever.
      () => active && setLoading(false),
    );
    return () => {
      active = false;
      unsubscribe?.();
    };
  }, []);

  const value: AuthContextValue = { user, loading, ...actions };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
