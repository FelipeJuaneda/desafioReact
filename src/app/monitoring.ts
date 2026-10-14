// Production monitoring, loaded when the browser is idle so it never competes with the first
// render: Vercel Speed Insights (real users' Web Vitals), Vercel Web Analytics (cookieless
// visits) and, when VITE_SENTRY_DSN is set, Sentry for errors with their stack and route.

type ErrorReporter = (error: unknown) => void;

let report: ErrorReporter | null = null;
// Errors before Sentry finished loading wait here.
const early: unknown[] = [];

/** Sends an error to Sentry (if configured). Safe to call any time. */
export const reportError = (error: unknown) => {
  if (report) report(error);
  else if (early.length < 10) early.push(error);
};

const whenIdle = (task: () => void) =>
  "requestIdleCallback" in window
    ? window.requestIdleCallback(task, { timeout: 4000 })
    : setTimeout(task, 2000);

export const startMonitoring = () => {
  // Local development and automated browsers (e2e, audits) don't count as visits.
  if (import.meta.env.DEV || navigator.webdriver) return;
  whenIdle(() => {
    void import("@vercel/speed-insights").then(({ injectSpeedInsights }) => injectSpeedInsights());
    void import("@vercel/analytics").then(({ inject }) => inject());

    const dsn = import.meta.env.VITE_SENTRY_DSN;
    if (!dsn) return;
    void import("@sentry/react").then((Sentry) => {
      Sentry.init({
        dsn,
        environment: import.meta.env.MODE,
        // Errors only: no performance tracing, no session replay (privacy and bundle size);
        // Sentry sends no IP or user data unless asked to.
        tracesSampleRate: 0,
      });
      report = (error) => Sentry.captureException(error);
      early.splice(0).forEach(report);
    });
  });
};
