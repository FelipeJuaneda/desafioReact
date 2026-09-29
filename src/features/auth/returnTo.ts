import { paths } from "@/app/paths";

/**
 * Where to go after signing in, from the `?volver=` parameter. Only same-site paths are
 * accepted ("/mi-lista"), never "//evil.com" or "https://…", so the link cannot be used
 * to bounce people to another site.
 */
export const safeReturnTo = (value: string | null | undefined) =>
  value && value.startsWith("/") && !value.startsWith("//") && !value.startsWith("/\\")
    ? value
    : paths.home;

/** Carries the return path between the sign-in, sign-up and recover screens. */
export const withReturnTo = (path: string, returnTo: string) =>
  returnTo === paths.home ? path : `${path}?volver=${encodeURIComponent(returnTo)}`;
