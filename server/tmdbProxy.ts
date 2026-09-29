// TMDB proxy: read-only requests go out with the server-side token, which never reaches the
// browser. Served by api/tmdb.ts; vercel.json rewrites /api/tmdb/<path> to /api/tmdb?path=<path>
// (outside Next.js, Vercel does not route multi-segment catch-alls to functions).
// GET /api/tmdb/movie/550?language=es  ->  https://api.themoviedb.org/3/movie/550?language=es

const TMDB_BASE = "https://api.themoviedb.org/3/";

// Only catalog endpoints: the proxy must not expose account, list or session endpoints.
const ALLOWED_ROOTS = new Set([
  "configuration",
  "discover",
  "genre",
  "movie",
  "person",
  "search",
  "trending",
  "tv",
]);

const json = (body: unknown, status: number) =>
  Response.json(body, { status, headers: { "cache-control": "no-store" } });

export async function GET(request: Request): Promise<Response> {
  const token = process.env.TMDB_READ_TOKEN;
  if (!token) return json({ error: "TMDB_READ_TOKEN is not configured" }, 500);

  const url = new URL(request.url);
  // Rewritten form (?path=movie/550) in production; plain /api/tmdb/movie/550 otherwise.
  const path = url.searchParams.get("path") ?? url.pathname.replace(/^\/api\/tmdb\/?/, "");
  url.searchParams.delete("path");
  const root = path.split("/")[0] ?? "";
  if (!/^[a-z0-9_/-]+$/i.test(path) || !ALLOWED_ROOTS.has(root)) {
    return json({ error: "Endpoint not allowed" }, 400);
  }

  const upstream = new URL(path, TMDB_BASE);
  url.searchParams.forEach((value, name) => {
    if (name !== "api_key") upstream.searchParams.set(name, value);
  });

  const response = await fetch(upstream, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
  });

  return new Response(response.body, {
    status: response.status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      // Catalog data changes slowly: cache at the edge, serve stale while revalidating.
      "cache-control": response.ok
        ? "public, s-maxage=3600, stale-while-revalidate=86400"
        : "no-store",
    },
  });
}
