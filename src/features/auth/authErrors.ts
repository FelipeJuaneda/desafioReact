import { getErrorCode } from "@/lib/errors";

// Firebase Auth error codes -> what the person can do about it, in Rioplatense Spanish.
// With email enumeration protection (Firebase's default), wrong email and wrong password
// both arrive as auth/invalid-credential, so the message never says which one failed.
const MESSAGES: Record<string, string> = {
  "auth/invalid-credential":
    "El email o la contraseña no coinciden. Revisalos o recuperá tu contraseña.",
  "auth/wrong-password":
    "El email o la contraseña no coinciden. Revisalos o recuperá tu contraseña.",
  "auth/user-not-found":
    "El email o la contraseña no coinciden. Revisalos o recuperá tu contraseña.",
  "auth/invalid-email": "Ese email no parece válido. Revisá que esté bien escrito.",
  "auth/missing-email": "Ingresá tu email.",
  "auth/missing-password": "Ingresá tu contraseña.",
  "auth/email-already-in-use":
    "Ya hay una cuenta con ese email. Ingresá con él o recuperá tu contraseña.",
  "auth/weak-password": "La contraseña tiene que tener al menos 6 caracteres.",
  "auth/too-many-requests":
    "Hubo demasiados intentos seguidos. Esperá unos minutos y volvé a probar.",
  "auth/network-request-failed": "No hay conexión. Revisá tu internet y volvé a intentar.",
  "auth/popup-closed-by-user": "Cerraste la ventana de Google antes de terminar.",
  "auth/cancelled-popup-request": "Cerraste la ventana de Google antes de terminar.",
  "auth/popup-blocked":
    "El navegador bloqueó la ventana de Google. Permití las ventanas emergentes para este sitio.",
  "auth/account-exists-with-different-credential":
    "Ese email ya está registrado con otro método de ingreso. Usá el que elegiste al crear la cuenta.",
  "auth/user-disabled": "Esta cuenta está deshabilitada.",
};

const FALLBACK = "Algo salió mal. Probá de nuevo en un momento.";

/** Never shows raw Firebase text: unknown codes get a generic, actionable message. */
export const authErrorMessage = (error: unknown): string =>
  MESSAGES[getErrorCode(error) ?? ""] ?? FALLBACK;
