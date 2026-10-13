import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { loadEnv, type Plugin, type ProxyOptions } from "vite";
import type { ComponentType } from "react";
import { configDefaults, defineConfig } from "vitest/config";

/**
 * @remixicon/react ships every icon in one module, so whichever chunk holds that module keeps
 * every icon any screen imports: icons used only by lazy screens ended up in the first visit.
 * This turns `import { RiX } from "@remixicon/react"` into one tiny module per icon, built from
 * the library's own SVG paths, so each icon travels with the chunk that uses it.
 */
const remixIconsPerModule = (): Plugin => {
  const PREFIX = "\0remixicon:";
  const require = createRequire(import.meta.url);
  const pathsOf = (name: string) => {
    const { createElement } = require("react") as typeof import("react");
    const { renderToStaticMarkup } =
      require("react-dom/server") as typeof import("react-dom/server");
    const icons = require("@remixicon/react") as Record<string, ComponentType>;
    const Icon = icons[name];
    if (!Icon) throw new Error(`@remixicon/react has no icon named ${name}`);
    return [...renderToStaticMarkup(createElement(Icon)).matchAll(/ d="([^"]+)"/g)].map(
      (match) => match[1]!,
    );
  };
  return {
    name: "remixicon-per-module",
    enforce: "pre",
    transform(code, id) {
      if (id.includes("node_modules") || !code.includes("@remixicon/react")) return null;
      return code.replace(
        /import\s*\{([^}]*)\}\s*from\s*["']@remixicon\/react["'];?/g,
        (_statement, names: string) => {
          const specifiers = names
            .split(",")
            .map((name) => name.trim())
            .filter(Boolean);
          const types = specifiers.filter((name) => name.startsWith("type "));
          const icons = specifiers.filter((name) => !name.startsWith("type "));
          return [
            types.length > 0 &&
              `import type { ${types.map((t) => t.slice(5)).join(", ")} } from "@remixicon/react";`,
            ...icons.map((name) => `import ${name} from "${PREFIX}${name}";`),
          ]
            .filter(Boolean)
            .join("\n");
        },
      );
    },
    resolveId: (id) => (id.startsWith(PREFIX) ? id : null),
    load(id) {
      if (!id.startsWith(PREFIX)) return null;
      const name = id.slice(PREFIX.length);
      const paths = pathsOf(name)
        .map((d) => `createElement("path", { d: ${JSON.stringify(d)} })`)
        .join(", ");
      // Same props and markup as the library's components.
      return `import { createElement } from "react";
const ${name} = ({ color = "currentColor", size = 24, className, ...props }) =>
  createElement("svg", { viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", width: size, height: size, fill: color, ...props, className: "remixicon " + (className || "") }, ${paths});
export default ${name};`;
    },
  };
};

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
    plugins: [remixIconsPerModule(), react(), tailwindcss(), preloadFonts(), preloadHome()],
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
