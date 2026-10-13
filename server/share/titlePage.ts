// Link previews for /pelicula/:slug and /serie/:slug. Chat apps and crawlers don't run
// JavaScript, so vercel.json sends only them here (matched by user agent); people keep getting
// the static app. The response is the app's own index.html with the title's <head> tags.
import { fetchShareTitle, injectHead, parseId, parseKind, titleHead } from "./title.js";

const siteOrigin = (request: Request) => {
  const host = request.headers.get("x-forwarded-host");
  return host ? `https://${host}` : new URL(request.url).origin;
};

const appShell = async (origin: string) => {
  try {
    const response = await fetch(`${origin}/index.html`, { signal: AbortSignal.timeout(3000) });
    return response.ok ? await response.text() : null;
  } catch {
    return null;
  }
};

// If the shell can't be fetched (e.g. a protected preview deployment), the tags alone are
// enough for a preview.
const minimalShell = `<!doctype html>
<html lang="es-AR">
  <head>
    <meta charset="utf-8" />
    <!-- share:start --><!-- share:end -->
  </head>
  <body></body>
</html>`;

const html = (body: string, cache: string) =>
  new Response(body, {
    headers: { "content-type": "text/html; charset=utf-8", "cache-control": cache },
  });

export async function GET(request: Request): Promise<Response> {
  const params = new URL(request.url).searchParams;
  const kind = parseKind(params.get("kind"));
  const id = parseId(params.get("slug"));
  const token = process.env.TMDB_READ_TOKEN;
  const origin = siteOrigin(request);

  const [shell, title] = await Promise.all([
    appShell(origin),
    kind && id && token ? fetchShareTitle(kind, id, token) : null,
  ]);

  // Unknown title: the site-wide preview, briefly cached in case TMDB was only down.
  if (!title) return html(shell ?? minimalShell, "public, s-maxage=300");

  return html(
    injectHead(shell ?? minimalShell, titleHead(title, origin)),
    "public, s-maxage=86400, stale-while-revalidate=604800",
  );
}
