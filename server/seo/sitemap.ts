// GET /sitemap.xml (rewritten to /api/sitemap): the public pages plus the titles people look
// for most, at their canonical URLs, so search engines find the catalog without crawling it.
import { titlePath, type ShareKind } from "../share/title.js";

const STATIC_PATHS = ["/", "/peliculas", "/series", "/estrenos", "/que-vemos", "/buscar"];

interface ListItem {
  id: number;
  title?: string;
  name?: string;
}

/** Popular now (3 pages) and all-time acclaimed (2 pages), per media type. */
const LISTS: Array<{ kind: ShareKind; params: string; pages: number }> = [
  { kind: "movie", params: "sort_by=popularity.desc&vote_count.gte=100", pages: 5 },
  { kind: "movie", params: "sort_by=vote_average.desc&vote_count.gte=2000", pages: 3 },
  { kind: "tv", params: "sort_by=popularity.desc&vote_count.gte=100", pages: 3 },
  { kind: "tv", params: "sort_by=vote_average.desc&vote_count.gte=800", pages: 2 },
];

const escapeXml = (value: string) =>
  value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

const fetchList = async (kind: ShareKind, params: string, page: number, token: string) => {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/discover/${kind}?language=es-MX&include_adult=false&${params}&page=${page}`,
      { headers: { Authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(5000) },
    );
    if (!response.ok) return [];
    return ((await response.json()) as { results: ListItem[] }).results.map((item) => ({
      kind,
      item,
    }));
  } catch {
    return [];
  }
};

export const sitemapXml = (origin: string, titles: Array<{ kind: ShareKind; item: ListItem }>) => {
  const seen = new Set<string>();
  const paths = [
    ...STATIC_PATHS,
    ...titles.flatMap(({ kind, item }) => {
      const name = (kind === "movie" ? item.title : item.name) ?? "";
      return name ? [titlePath(kind, item.id, name)] : [];
    }),
  ].filter((path) => !seen.has(path) && seen.add(path));
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...paths.map((path) => `  <url><loc>${escapeXml(origin + path)}</loc></url>`),
    "</urlset>",
  ].join("\n");
};

export async function GET(request: Request): Promise<Response> {
  const host = request.headers.get("x-forwarded-host");
  const origin = host ? `https://${host}` : new URL(request.url).origin;
  const token = process.env.TMDB_READ_TOKEN;
  const titles = token
    ? (
        await Promise.all(
          LISTS.flatMap(({ kind, params, pages }) =>
            Array.from({ length: pages }, (_, i) => fetchList(kind, params, i + 1, token)),
          ),
        )
      ).flat()
    : [];
  return new Response(sitemapXml(origin, titles), {
    headers: {
      "content-type": "application/xml; charset=utf-8",
      // Popularity moves daily; a day-old sitemap is fine.
      "cache-control": "public, s-maxage=86400, stale-while-revalidate=86400",
    },
  });
}
