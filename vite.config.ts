import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { loadEnv, type Plugin, type ProxyOptions } from "vite";
import { configDefaults, defineConfig } from "vitest/config";

/**
 * Both Sofia Sans families set the first viewport, but the browser only finds them after parsing
 * the CSS. Preloading the hashed Latin files starts them with the HTML instead (build only).
 */
const preloadFonts = (): Plugin => ({
  name: "preload-fonts",
  apply: "build",
  transformIndexHtml: {
    order: "post",
    handler: (_html, { bundle }) =>
      Object.keys(bundle ?? {})
        // Martian Mono (small edge-code text) is left out: it swaps in without moving anything,
        // and on slow connections its 38 kB would compete with the JavaScript.
        .filter((file) => /sofia-sans[\w-]*-latin-wght[\w-]*\.woff2$/.test(file))
        .map((file) => ({
          tag: "link",
          attrs: {
            rel: "preload",
            href: `/${file}`,
            as: "font",
            type: "font/woff2",
            crossorigin: "",
          },
          injectTo: "head" as const,
        })),
  },
});

/**
 * The home is a lazy route, so without help its chunk only starts downloading after the main
 * bundle runs. It is the landing page (and the LCP image waits on it), so preload it and the
 * chunks it imports with the HTML. Other routes stay lazy.
 */
const preloadHome = (): Plugin => ({
  name: "preload-home",
  apply: "build",
  transformIndexHtml: {
    order: "post",
    handler: (_html, { bundle }) => {
      const chunks = Object.values(bundle ?? {}).filter((item) => item.type === "chunk");
      const home = chunks.find((chunk) =>
        chunk.facadeModuleId?.endsWith("routes/home/HomePage.tsx"),
      );
      const entry = chunks.find((chunk) => chunk.isEntry);
      if (!home || !entry) return [];
      const alreadyLoaded = new Set([entry.fileName, ...entry.imports]);
      return [home.fileName, ...home.imports]
        .filter((file) => !alreadyLoaded.has(file))
        .map((file) => ({
          tag: "link",
          attrs: { rel: "modulepreload", crossorigin: "", href: `/${file}` },
          injectTo: "head" as const,
        }));
    },
  },
});

export default defineConfig(({ mode }) => {
  // Load every variable (not only VITE_*): the TMDB token stays in the Node process.
  const env = loadEnv(mode, process.cwd(), "");

  // Local stand-in for the api/tmdb.ts function so `npm run dev` never ships the token to the browser.
  const tmdbProxy: Record<string, ProxyOptions> = {
    "/api/tmdb": {
      target: "https://api.themoviedb.org/3",
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api\/tmdb/, ""),
      headers: { Authorization: `Bearer ${env.TMDB_READ_TOKEN ?? ""}` },
    },
  };

  return {
    plugins: [react(), tailwindcss(), preloadFonts(), preloadHome()],
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
