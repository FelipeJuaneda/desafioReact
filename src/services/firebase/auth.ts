// Firebase Auth, loaded after the first render: browsing never waits for it.
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
import { auth } from "@/services/firebase/app";

export const watchUser = (onChange: (user: User | null) => void) =>
  onAuthStateChanged(auth, onChange);

export const signUp = (email: string, password: string) =>
  createUserWithEmailAndPassword(auth, email, password);
export const login = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);
export const loginWithGoogle = () => signInWithPopup(auth, new GoogleAuthProvider());
export const resetPassword = (email: string) => sendPasswordResetEmail(auth, email);
export const logout = () => signOut(auth);
