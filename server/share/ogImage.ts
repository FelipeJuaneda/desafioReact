// GET /api/og?type=movie&id=550 -> the 1200×630 JPEG chat apps show for a shared title.
// Served by api/og.ts. Any failure falls back to the site-wide card so a preview never breaks.
// Pipeline: satori lays the card out as SVG, resvg (WebAssembly) rasterizes it and jpeg-js
// encodes it. As PNG a photo backdrop weighs 0.7–1.1 MB and WhatsApp drops previews that
// heavy; as JPEG it is ~130 kB.
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { initWasm, Resvg } from "@resvg/resvg-wasm";
import jpeg from "jpeg-js";
import type { ReactNode } from "react";
import satori from "satori";
import { CARD, titleCard } from "./card.js";
import { fetchShareTitle, parseId, parseKind } from "./title.js";

// Static woff files (satori reads neither woff2 nor variable fonts). Literal URLs so Vercel
// bundles them with the function; vercel.json includes the folder as well.
const fonts = Promise.all([
  readFile(new URL("./fonts/sofia-sans-extra-condensed-latin-800-normal.woff", import.meta.url)),
  readFile(
    new URL("./fonts/sofia-sans-extra-condensed-latin-ext-800-normal.woff", import.meta.url),
  ),
  readFile(new URL("./fonts/sofia-sans-latin-600-normal.woff", import.meta.url)),
  readFile(new URL("./fonts/martian-mono-latin-500-normal.woff", import.meta.url)),
]);

// Once per instance: warm invocations reuse the compiled module.
let resvgReady: Promise<void> | undefined;
const loadResvg = () =>
  (resvgReady ??= readFile(
    createRequire(import.meta.url).resolve("@resvg/resvg-wasm/index_bg.wasm"),
  ).then((wasm) => initWasm(wasm)));

const TMDB_IMAGES = "https://image.tmdb.org/t/p/";

/** TMDB image as a data URI, or null: a missing picture must not cost the whole card. */
const image = async (path: string | null, size: string) => {
  if (!path) return null;
  try {
    const response = await fetch(`${TMDB_IMAGES}${size}${path}`, {
      signal: AbortSignal.timeout(4000),
    });
    if (!response.ok) return null;
    const type = response.headers.get("content-type") ?? "image/jpeg";
    return `data:${type};base64,${Buffer.from(await response.arrayBuffer()).toString("base64")}`;
  } catch {
    return null;
  }
};

const fallback = (request: Request) => Response.redirect(new URL("/og.png", request.url), 302);

export async function GET(request: Request): Promise<Response> {
  const token = process.env.TMDB_READ_TOKEN;
  const params = new URL(request.url).searchParams;
  const kind = parseKind(params.get("type"));
  const id = parseId(params.get("id"));
  if (!token || !kind || !id) return fallback(request);

  const title = await fetchShareTitle(kind, id, token);
  if (!title) return fallback(request);

  try {
    const [poster, backdrop, [display, displayExt, body, code]] = await Promise.all([
      image(title.posterPath, "w342") /* drawn 292 px wide */,
      image(title.backdropPath, "w1280"),
      fonts,
      loadResvg(),
    ]);

    const svg = await satori(titleCard(title, { poster, backdrop }) as unknown as ReactNode, {
      ...CARD,
      fonts: [
        { name: "Sofia Sans Extra Condensed", data: display, weight: 800, style: "normal" },
        { name: "Sofia Sans Extra Condensed", data: displayExt, weight: 800, style: "normal" },
        { name: "Sofia Sans", data: body, weight: 600, style: "normal" },
        { name: "Martian Mono", data: code, weight: 500, style: "normal" },
      ],
    });
    const raster = new Resvg(svg, { fitTo: { mode: "width", value: CARD.width } }).render();
    const card = jpeg.encode(
      { data: raster.pixels, width: raster.width, height: raster.height },
      84,
    );

    return new Response(new Uint8Array(card.data), {
      headers: {
        "content-type": "image/jpeg",
        // The card only changes with TMDB data; CARD_VERSION in the URL handles redesigns.
        "cache-control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=604800",
      },
    });
  } catch (error) {
    console.error("Share card failed", error);
    return fallback(request);
  }
}
