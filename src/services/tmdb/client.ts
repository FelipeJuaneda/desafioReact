// Every TMDB request goes through our own /api/tmdb proxy (Vercel function in production,
// Vite dev-server proxy locally), which adds the API token server-side.
const API_BASE = "/api/tmdb/";
export const TMDB_LANGUAGE = "es";

export class TmdbError extends Error {
  readonly status: number;

  constructor(status: number, path: string) {
    super(`TMDB respondió ${status} para ${path}`);
    this.name = "TmdbError";
    this.status = status;
  }
}

type QueryParams = Record<string, string | number | undefined>;

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

  const response = await fetch(url, { signal });
  if (!response.ok) throw new TmdbError(response.status, path);
  return (await response.json()) as T;
}
