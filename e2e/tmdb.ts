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

// Upcoming openings: dates relative to today so the schedule never runs out.
const inDays = (days: number) => {
  const date = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  return [date.getFullYear(), date.getMonth() + 1, date.getDate()]
    .map((part) => String(part).padStart(2, "0"))
    .join("-");
};
const UPCOMING = [
  movie(9001, "Estreno del jueves", inDays(3), 0),
  movie(9002, "Otro estreno", inDays(3), 0),
  movie(9003, "Estreno de noviembre", inDays(24), 0),
];

const seriesDetail = {
  ...SERIES[0]!,
  number_of_seasons: 2,
  number_of_episodes: 4,
  original_language: "en",
  genres: [{ id: 18, name: "Drama" }],
  next_episode_to_air: null,
  seasons: [1, 2].map((n) => ({
    id: 100 + n,
    name: `Temporada ${n}`,
    season_number: n,
    episode_count: 2,
    air_date: `201${n}-04-17`,
    overview: "",
    poster_path: null,
    vote_average: 8,
  })),
};

const season = (n: number) => ({
  id: 100 + n,
  name: `Temporada ${n}`,
  season_number: n,
  air_date: `201${n}-04-17`,
  overview: `Resumen de la temporada ${n}.`,
  episodes: [1, 2].map((e) => ({
    id: n * 10 + e,
    name: `Capítulo ${n}.${e}`,
    season_number: n,
    episode_number: e,
    air_date: `201${n}-04-${10 + e}`,
    overview: `Sinopsis del capítulo ${e}.`,
    runtime: 55,
    still_path: null,
    vote_average: 8.1,
  })),
});

const providers = {
  id: 550,
  results: {
    AR: {
      link: "https://www.themoviedb.org/movie/550/watch?locale=AR",
      flatrate: [
        { provider_id: 8, provider_name: "Netflix", logo_path: null, display_priority: 0 },
      ],
    },
  },
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
    if (/^(movie|tv)\/\d+\/watch\/providers$/.test(path)) return respond(route, providers);
    if (/^movie\/\d+\/release_dates$/.test(path)) return respond(route, { id: 1, results: [] });
    if (path === "tv/1399") return respond(route, seriesDetail);
    const seasonMatch = path.match(/^tv\/1399\/season\/(\d+)$/);
    if (seasonMatch) return respond(route, season(Number(seasonMatch[1])));
    if (path === "discover/movie" && url.searchParams.has("release_date.gte")) {
      return respond(route, page(UPCOMING));
    }

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
