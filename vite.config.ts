import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { loadEnv, type ProxyOptions } from "vite";
import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig(({ mode }) => {
  // Load every variable (not only VITE_*): the TMDB token stays in the Node process.
  const env = loadEnv(mode, process.cwd(), "");

  // Local stand-in for api/tmdb/[...path].ts so `npm run dev` never ships the token to the browser.
  const tmdbProxy: Record<string, ProxyOptions> = {
    "/api/tmdb": {
      target: "https://api.themoviedb.org/3",
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api\/tmdb/, ""),
      headers: { Authorization: `Bearer ${env.TMDB_READ_TOKEN ?? ""}` },
    },
  };

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
    },
    server: { port: 3000, proxy: tmdbProxy },
    preview: { port: 3000, proxy: tmdbProxy },
    test: {
      environment: "jsdom",
      setupFiles: ["./src/test/setup.ts"],
      // Browser flows live in e2e/ and run with Playwright.
      exclude: [...configDefaults.exclude, "e2e/**"],
    },
  };
});
