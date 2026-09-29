import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import { useEffect, useState, type ReactNode } from "react";
import { AuthContext, type AuthContextValue } from "@/features/auth/useAuthContext";
import { auth } from "@/services/firebase/app";

// Stable for the app's lifetime: plain functions over the Firebase SDK.
const actions = {
  signUp: (email: string, password: string) =>
    createUserWithEmailAndPassword(auth, email, password),
  login: (email: string, password: string) => signInWithEmailAndPassword(auth, email, password),
  loginWithGoogle: () => signInWithPopup(auth, new GoogleAuthProvider()),
  resetPassword: (email: string) => sendPasswordResetEmail(auth, email),
  logout: () => signOut(auth),
};

function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(
    () =>
      onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setLoading(false);
      }),
    [],
  );

  const value: AuthContextValue = { user, loading, ...actions };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
