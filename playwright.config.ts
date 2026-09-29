import { defineConfig, devices } from "@playwright/test";

const PORT = 4173;

// Fake Firebase project: e2e never reaches real Firebase (auth calls are intercepted) and
// these values win over .env.local because process env has priority in Vite.
const firebaseEnv = {
  VITE_FIREBASE_API_KEY: "e2e-api-key",
  VITE_FIREBASE_AUTH_DOMAIN: "demo-peliculed.firebaseapp.com",
  VITE_FIREBASE_PROJECT_ID: "demo-peliculed",
  VITE_FIREBASE_STORAGE_BUCKET: "demo-peliculed.appspot.com",
  VITE_FIREBASE_MESSAGING_SENDER_ID: "0",
  VITE_FIREBASE_APP_ID: "1:0:web:e2e",
};

export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    locale: "es-AR",
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "desktop",
      // Locally, reuse the installed Chrome instead of downloading a browser.
      use: { ...devices["Desktop Chrome"], channel: process.env.CI ? undefined : "chrome" },
    },
    {
      name: "mobile",
      use: { ...devices["Pixel 7"], channel: process.env.CI ? undefined : "chrome" },
    },
  ],
  webServer: {
    // The production build, served as Vercel would (TMDB responses are mocked per test).
    command: `npx vite build && npx vite preview --port ${PORT} --strictPort`,
    port: PORT,
    reuseExistingServer: !process.env.CI,
    env: firebaseEnv,
    timeout: 120_000,
  },
});
