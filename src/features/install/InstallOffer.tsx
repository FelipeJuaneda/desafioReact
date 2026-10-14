import { lazy, Suspense, useEffect, useState } from "react";
import { useLocation } from "react-router";
import { paths } from "@/app/paths";
import { markOffered, onOpenInstallSheet, useInstallMethod, wasOffered } from "./installState";

const InstallSheet = lazy(() => import("./InstallSheet"));

/** Screens where an interruption would get in the way of a task. */
const QUIET_PATHS: string[] = [paths.signIn, paths.signUp, paths.recover];
/** Long enough to have looked around; short enough to still be on the first screen. */
const FIRST_VISIT_DELAY = { phone: 4000, desktop: 8000 };

/**
 * Offers the installed app: once, on the first visit (never inside the installed app or
 * mid sign-in), and whenever a "Descargar app" button asks. The sheet's code loads only then.
 */
export const InstallOffer = () => {
  const method = useInstallMethod();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => onOpenInstallSheet(() => setOpen(true)), []);

  useEffect(() => {
    if (!method || wasOffered() || navigator.webdriver) return;
    // Desktops wait longer: someone browsing on a computer is less likely to be in a hurry.
    const phone = window.matchMedia("(max-width: 47.99rem)").matches;
    if (QUIET_PATHS.includes(pathname)) return;
    const timer = setTimeout(
      () => {
        markOffered();
        setOpen(true);
      },
      FIRST_VISIT_DELAY[phone ? "phone" : "desktop"],
    );
    return () => clearTimeout(timer);
  }, [method, pathname]);

  if (!open || !method) return null;
  return (
    <Suspense fallback={null}>
      <InstallSheet open method={method} onClose={() => setOpen(false)} />
    </Suspense>
  );
};
