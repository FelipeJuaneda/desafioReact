import type { Page, Route } from "@playwright/test";

// Minimal TMDB payloads with the real shapes: enough for every screen to render.
const movie = (id: number, title: string, release_date: string, vote_average: number) => ({
  id,
  title,
  original_title: title,
  release_date,
  vote_average,
  vote_count: 20000,
  overview: `Sinopsis de ${title}.`,
  poster_path: `/poster-${id}.jpg`,
  backdrop_path: `/backdrop-${id}.jpg`,
  genre_ids: [18],
});

const series = (id: number, name: string, first_air_date: string) => ({
  id,
  name,
  original_name: name,
  first_air_date,
  vote_average: 8.4,
  vote_count: 15000,
  overview: `Sinopsis de ${name}.`,
  poster_path: `/poster-${id}.jpg`,
  backdrop_path: `/backdrop-${id}.jpg`,
  genre_ids: [18],
});

export const MOVIES = [
  movie(550, "El club de la lucha", "1999-10-15", 8.4),
  movie(603, "Matrix", "1999-03-31", 8.2),
  movie(680, "Pulp Fiction", "1994-09-10", 8.5),
];
const SERIES = [series(1399, "El juego de tronos", "2011-04-17")];

const page = <T>(results: T[]) => ({
  page: 1,
  results,
  total_pages: 1,
  total_results: results.length,
});

const movieDetail = (id: number) => {
  const base = MOVIES.find((m) => m.id === id) ?? MOVIES[0]!;
  return {
    ...base,
    runtime: 139,
    tagline: "Caos, travesuras y jabón",
    original_language: "en",
    genres: [
      { id: 18, name: "Drama" },
      { id: 53, name: "Suspense" },
    ],
  };
};

const credits = {
  cast: [
    { id: 819, name: "Edward Norton", character: "Narrador", profile_path: null },
    { id: 287, name: "Brad Pitt", character: "Tyler Durden", profile_path: null },
  ],
  crew: [{ id: 7467, name: "David Fincher", job: "Director" }],
};

const videos = {
  results: [
    { id: "v1", key: "SUXWAEX2jlg", name: "Tráiler oficial", site: "YouTube", type: "Trailer" },
  ],
};

const genres = {
  genres: [
    { id: 18, name: "Drama" },
    { id: 53, name: "Suspense" },
  ],
};

const respond = (route: Route, body: unknown, status = 200) =>
  route.fulfill({ status, contentType: "application/json", body: JSON.stringify(body) });

/** Serves /api/tmdb/* from fixtures and keeps poster requests off the network. */
export const mockTmdb = async (page_: Page) => {
  await page_.route("https://image.tmdb.org/**", (route) => route.abort());
  await page_.route("**/api/tmdb/**", (route) => {
    const url = new URL(route.request().url());
    const path = url.pathname.replace(/^\/api\/tmdb\//, "");

    if (path === "search/multi") {
      const query = (url.searchParams.get("query") ?? "").toLowerCase();
      const hits = MOVIES.filter((m) => m.title.toLowerCase().includes(query));
      return respond(route, page(hits.map((m) => ({ ...m, media_type: "movie" }))));
    }
    if (/^genre\/(movie|tv)\/list$/.test(path)) return respond(route, genres);
    if (/^(movie|tv)\/\d+\/credits$/.test(path)) return respond(route, credits);
    if (/^(movie|tv)\/\d+\/videos$/.test(path)) return respond(route, videos);

    const detail = path.match(/^movie\/(\d+)$/);
    if (detail) {
      const id = Number(detail[1]);
      return MOVIES.some((m) => m.id === id)
        ? respond(route, movieDetail(id))
        : respond(route, { status_code: 34, status_message: "Not found" }, 404);
    }
    if (path.startsWith("tv/") || path.includes("/tv") || path.endsWith("tv/week")) {
      return respond(route, page(SERIES));
    }
    // Every movie list: trending, now playing, discover (catalog, top rated).
    return respond(route, page(MOVIES));
  });
};
