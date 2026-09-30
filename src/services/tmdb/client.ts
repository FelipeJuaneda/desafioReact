// Every TMDB request goes through our own /api/tmdb proxy (Vercel function in production,
// Vite dev-server proxy locally), which adds the API token server-side.
const API_BASE = "/api/tmdb/";
// Latin American Spanish: titles as released in the region ("El Club de la Pelea", not Spain's
// "El club de la lucha"). Coverage measured equal or better than plain "es" on the app's lists.
export const TMDB_LANGUAGE = "es-MX";

export class TmdbError extends Error {
  readonly status: number;

  constructor(status: number, path: string) {
    super(`TMDB respondió ${status} para ${path}`);
    this.name = "TmdbError";
    this.status = status;
  }
}

type QueryParams = Record<string, string | number | undefined>;

declare global {
  interface Window {
    /** Requests index.html starts before the app loads, keyed by path + query (see there). */
    __early?: Record<string, Promise<unknown>>;
  }
}

/** Hands over a response the HTML already asked for, once; later calls fetch normally. */
const takeEarlyResponse = (key: string) => {
  const early = window.__early?.[key];
  if (early) delete window.__early![key];
  return early;
};

export async function tmdbFetch<T>(
  path: string,
  params: QueryParams = {},
  signal?: AbortSignal,
): Promise<T> {
  const url = new URL(API_BASE + path.replace(/^\/+/, ""), window.location.origin);
  url.searchParams.set("language", TMDB_LANGUAGE);
  for (const [name, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") url.searchParams.set(name, String(value));
  }

  const early = takeEarlyResponse(url.pathname + url.search);
  if (early) {
    const data = await early;
    if (data) return data as T;
  }

  const response = await fetch(url, { signal });
  if (!response.ok) throw new TmdbError(response.status, path);
  return (await response.json()) as T;
}
