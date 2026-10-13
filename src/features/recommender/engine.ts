// The recommender: turns the answers into TMDB searches, scores every candidate and picks a
// varied top ten. Pure functions, so every rule here is covered by a test.
//
// Score (0–1) = 0.38 quality + 0.30 mood + 0.17 company + 0.08 era + 0.07 popularity,
// + 0.04 when it is already in your list, − 0.06 when a filter had to be relaxed to find it.
// Then a diversity pass (maximal marginal relevance) keeps the ten from being one genre or
// one franchise over and over.

import type { MediaType } from "@/types/tmdb";
import type { Company, Complete, Era, Mood, Time } from "./questions";

export interface Candidate {
  id: number;
  mediaType: MediaType;
  title: string;
  date: string;
  genreIds: number[];
  voteAverage: number;
  voteCount: number;
  popularity: number;
  posterPath: string | null;
  backdropPath: string | null;
  overview: string;
  /** Found only after loosening runtime or era. */
  relaxed?: boolean;
}

export interface Reason {
  kind: "mood" | "quality" | "company" | "era" | "list" | "time";
  text: string;
}

export interface Recommendation extends Candidate {
  score: number;
  /** 0–100, shown as "Coincidencia". */
  match: number;
  reasons: Reason[];
}

// TMDB genre ids. Films and series use different ids for some genres.
const G = {
  action: 28,
  adventure: 12,
  animation: 16,
  comedy: 35,
  crime: 80,
  documentary: 99,
  drama: 18,
  family: 10751,
  fantasy: 14,
  history: 36,
  horror: 27,
  music: 10402,
  mystery: 9648,
  romance: 10749,
  scifi: 878,
  thriller: 53,
  war: 10752,
  tvAction: 10759,
  tvKids: 10762,
  tvNews: 10763,
  tvReality: 10764,
  tvScifi: 10765,
  tvSoap: 10766,
  tvTalk: 10767,
  tvWar: 10768,
} as const;

/** What each mood means in genres, per media type. The first genre is the core of the mood. */
export const MOOD_GENRES: Record<Mood, Record<MediaType, number[]>> = {
  reir: { movie: [G.comedy], tv: [G.comedy] },
  emocion: { movie: [G.drama, G.romance], tv: [G.drama] },
  tension: { movie: [G.thriller, G.mystery, G.crime], tv: [G.mystery, G.crime] },
  accion: { movie: [G.action, G.adventure], tv: [G.tvAction] },
  miedo: { movie: [G.horror], tv: [G.mystery, G.tvScifi] },
  pensar: { movie: [G.scifi, G.mystery, G.fantasy], tv: [G.tvScifi, G.mystery] },
  liviano: {
    movie: [G.comedy, G.animation, G.family, G.romance],
    tv: [G.comedy, G.animation, G.family],
  },
  aprender: { movie: [G.documentary, G.history], tv: [G.documentary] },
};

/** Genres that fit (bonus) or clash with (penalty) each audience. */
const COMPANY_FIT: Record<Company, { bonus: number[]; penalty: number[] }> = {
  solo: { bonus: [G.drama, G.thriller, G.scifi, G.mystery, G.tvScifi], penalty: [] },
  pareja: {
    bonus: [G.romance, G.comedy, G.drama, G.thriller],
    penalty: [G.animation, G.family, G.tvKids, G.documentary],
  },
  amigos: {
    bonus: [G.comedy, G.action, G.horror, G.adventure, G.tvAction],
    penalty: [G.documentary, G.romance, G.history],
  },
  familia: {
    bonus: [G.animation, G.family, G.adventure, G.comedy, G.fantasy, G.tvKids],
    penalty: [G.horror, G.crime, G.thriller, G.war, G.tvWar],
  },
};

/** Never on this list, whatever the answers: talk shows, news, reality, soaps. */
const ALWAYS_EXCLUDED: Record<MediaType, number[]> = {
  movie: [],
  tv: [G.tvNews, G.tvReality, G.tvSoap, G.tvTalk],
};

const RUNTIME: Record<Time, Record<MediaType, { gte?: number; lte?: number }>> = {
  corto: { movie: { gte: 60, lte: 100 }, tv: { lte: 35 } },
  normal: { movie: { gte: 60, lte: 135 }, tv: { lte: 65 } },
  largo: { movie: { gte: 60 }, tv: {} },
};

const yearsAgo = (today: string, years: number) =>
  `${Number(today.slice(0, 4)) - years}${today.slice(4)}`;

const eraRange = (era: Era, today: string): { gte?: string; lte?: string } => {
  switch (era) {
    case "nueva":
      return { gte: yearsAgo(today, 3), lte: today };
    case "siglo":
      return { gte: "2000-01-01", lte: today };
    case "clasica":
      return { lte: "1999-12-31" };
    default:
      return { lte: today };
  }
};

export const mediaTypes = (answers: Pick<Complete, "tipo">): MediaType[] =>
  answers.tipo === "pelicula" ? ["movie"] : answers.tipo === "serie" ? ["tv"] : ["movie", "tv"];

export interface DiscoverRequest {
  mediaType: MediaType;
  params: Record<string, string | number>;
  relaxed?: boolean;
}

const unique = (ids: number[]) => [...new Set(ids)];

/**
 * TMDB searches for one media type: the most popular matches (two pages) and the acclaimed
 * ones (higher vote floor, by rating). `relaxed` drops runtime and era, the filters people
 * care least about, for when the strict search finds too little.
 */
export const discoverRequests = (
  answers: Complete,
  mediaType: MediaType,
  today: string,
  relaxed = false,
): DiscoverRequest[] => {
  const dateField = mediaType === "movie" ? "primary_release_date" : "first_air_date";
  const moodGenres = unique(answers.animo.flatMap((mood) => MOOD_GENRES[mood][mediaType]));
  const clash = COMPANY_FIT[answers.con].penalty.filter((g) => !moodGenres.includes(g));
  const excluded = unique([
    ...ALWAYS_EXCLUDED[mediaType],
    // Documentaries only when asked for.
    ...(answers.animo.includes("aprender") ? [] : [G.documentary]),
    // For families the clashing genres are a hard no; for others they only cost points.
    ...(answers.con === "familia" ? clash : []),
  ]);
  const runtime = relaxed ? {} : RUNTIME[answers.tiempo][mediaType];
  const era = relaxed ? { lte: today } : eraRange(answers.epoca, today);
  const newOnly = !relaxed && answers.epoca === "nueva";

  const base: Record<string, string | number> = {
    include_adult: "false",
    with_genres: moodGenres.join("|"),
  };
  if (excluded.length) base.without_genres = excluded.join(",");
  if (runtime.gte) base["with_runtime.gte"] = runtime.gte;
  if (runtime.lte) base["with_runtime.lte"] = runtime.lte;
  if (era.gte) base[`${dateField}.gte`] = era.gte;
  if (era.lte) base[`${dateField}.lte`] = era.lte;
  if (answers.donde.length) {
    base.watch_region = "AR";
    base.with_watch_providers = answers.donde.join("|");
    base.with_watch_monetization_types = "flatrate|free|ads";
  }
  // TMDB has few Argentine ratings: the US scale is the reliable one (G and PG).
  if (answers.con === "familia" && mediaType === "movie") {
    base.certification_country = "US";
    base["certification.lte"] = "PG";
  }
  const floor = mediaType === "movie" ? (newOnly ? 80 : 300) : newOnly ? 40 : 120;
  const acclaimedFloor = mediaType === "movie" ? (newOnly ? 300 : 1500) : newOnly ? 100 : 400;

  return [
    {
      mediaType,
      relaxed,
      params: { ...base, sort_by: "popularity.desc", "vote_count.gte": floor, page: 1 },
    },
    {
      mediaType,
      relaxed,
      params: { ...base, sort_by: "popularity.desc", "vote_count.gte": floor, page: 2 },
    },
    {
      mediaType,
      relaxed,
      params: { ...base, sort_by: "vote_average.desc", "vote_count.gte": acclaimedFloor, page: 1 },
    },
  ];
};

// --- Scoring -------------------------------------------------------------------------------

const clamp = (value: number) => Math.min(Math.max(value, 0), 1);

/** Rating pulled towards the average until it has enough votes to be trusted. */
export const weightedRating = (average: number, votes: number, mediaType: MediaType) => {
  const prior = 6.6;
  const weight = mediaType === "movie" ? 800 : 300;
  return (votes / (votes + weight)) * average + (weight / (votes + weight)) * prior;
};

/** 1 when its main genre is the mood, 0.7 when any genre is, 0 otherwise; averaged over moods. */
export const moodFit = (candidate: Candidate, moods: Mood[]) => {
  const fits = moods.map((mood) => {
    const genres = MOOD_GENRES[mood][candidate.mediaType];
    if (genres.includes(candidate.genreIds[0] ?? -1)) return 1;
    return candidate.genreIds.some((g) => genres.includes(g)) ? 0.7 : 0;
  });
  return fits.reduce<number>((sum, fit) => sum + fit, 0) / Math.max(fits.length, 1);
};

export const companyFit = (candidate: Candidate, company: Company) => {
  const { bonus, penalty } = COMPANY_FIT[company];
  const hits = candidate.genreIds.filter((g) => bonus.includes(g)).length;
  const clashes = candidate.genreIds.filter((g) => penalty.includes(g)).length;
  return clamp(0.55 + Math.min(hits, 2) * 0.2 - clashes * 0.35);
};

const age = (date: string, today: string) =>
  Math.max(0, (Date.parse(today) - Date.parse(date)) / (365.25 * 24 * 60 * 60 * 1000));

export const eraFit = (candidate: Candidate, era: Era, today: string) => {
  if (!candidate.date) return 0.4;
  const years = age(candidate.date, today);
  switch (era) {
    case "nueva":
      return clamp(1 - years / 4);
    case "siglo":
      return years <= 26 ? 1 : 0.3;
    case "clasica":
      return candidate.date < "2000" ? 1 : 0.2;
    default:
      // No preference: a gentle lean towards the last 15 years.
      return clamp(1 - years / 40);
  }
};

const popularityFit = (popularity: number) => clamp(Math.log10(popularity + 1) / 2.5);

export interface ScoreContext {
  today: string;
  /** "movie-550" keys of titles in the viewer's list. */
  saved: ReadonlySet<string>;
  genreNames: Map<number, string>;
}

const formatVotes = (votes: number) =>
  votes >= 1000 ? `${Math.round(votes / 1000)} mil votos` : `${votes} votos`;

const formatScore = (value: number) => value.toFixed(1).replace(".", ",");

const COMPANY_REASON: Record<Company, string> = {
  solo: "Para verla con toda tu atención",
  pareja: "Funciona para ver de a dos",
  amigos: "Ideal para ver en grupo",
  familia: "Apta para todo público",
};

export const reasonsFor = (
  candidate: Candidate,
  answers: Complete,
  context: ScoreContext,
  parts: { mood: number; company: number; rating: number },
): Reason[] => {
  const reasons: Reason[] = [];
  const asked = unique(answers.animo.flatMap((mood) => MOOD_GENRES[mood][candidate.mediaType]));
  const matched = candidate.genreIds
    .filter((g) => asked.includes(g))
    .map((g) => context.genreNames.get(g))
    .filter(Boolean)
    .slice(0, 2) as string[];
  if (matched.length) {
    reasons.push({ kind: "mood", text: `${matched.join(" y ")}, como pediste` });
  }
  if (parts.rating >= 7.8 && candidate.voteCount >= 2000) {
    reasons.push({
      kind: "quality",
      text: `Aclamada: ${formatScore(candidate.voteAverage)} con ${formatVotes(candidate.voteCount)}`,
    });
  } else if (parts.rating >= 7) {
    reasons.push({
      kind: "quality",
      text: `Muy bien puntuada: ${formatScore(candidate.voteAverage)}`,
    });
  }
  if (parts.company >= 0.75 || answers.con === "familia") {
    reasons.push({ kind: "company", text: COMPANY_REASON[answers.con] });
  }
  if (answers.epoca === "nueva" && candidate.date) {
    reasons.push({ kind: "era", text: `Es de ${candidate.date.slice(0, 4)}` });
  }
  if (context.saved.has(`${candidate.mediaType}-${candidate.id}`)) {
    reasons.unshift({ kind: "list", text: "Ya la tenías en tu lista" });
  }
  return reasons.slice(0, 3);
};

export const scoreCandidate = (
  candidate: Candidate,
  answers: Complete,
  context: ScoreContext,
): Recommendation => {
  const rating = weightedRating(candidate.voteAverage, candidate.voteCount, candidate.mediaType);
  const quality = clamp((rating - 5.5) / 3);
  const mood = moodFit(candidate, answers.animo);
  const company = companyFit(candidate, answers.con);
  const era = eraFit(candidate, answers.epoca, context.today);
  const popularity = popularityFit(candidate.popularity);
  const inList = context.saved.has(`${candidate.mediaType}-${candidate.id}`);

  const score = clamp(
    0.38 * quality +
      0.3 * mood +
      0.17 * company +
      0.08 * era +
      0.07 * popularity +
      (inList ? 0.04 : 0) -
      (candidate.relaxed ? 0.06 : 0),
  );
  return {
    ...candidate,
    score,
    match: Math.round(score * 100),
    reasons: reasonsFor(candidate, answers, context, { mood, company, rating }),
  };
};

// --- Diversity ------------------------------------------------------------------------------

/** "Toy Story 3" and "Toy Story: Algo" share a franchise key. */
const franchise = (title: string) =>
  title
    .toLowerCase()
    .split(/[:\-–(]/)[0]!
    .replace(/\b(\d+|ii|iii|iv|parte|part)\b/g, "")
    .trim();

export const similarity = (a: Candidate, b: Candidate) => {
  const setA = new Set(a.genreIds);
  const shared = b.genreIds.filter((g) => setA.has(g)).length;
  const union = new Set([...a.genreIds, ...b.genreIds]).size || 1;
  const sameFranchise = franchise(a.title) !== "" && franchise(a.title) === franchise(b.title);
  return 0.6 * (shared / union) + (sameFranchise ? 0.4 : 0);
};

/**
 * Greedy maximal marginal relevance: each next pick is the best score minus how much it
 * repeats what is already picked. λ is small, so quality still leads. The shown match is that
 * value, so it never goes up as the rank goes down (a remaining title's repetition can only grow).
 */
export const diversify = (ranked: Recommendation[], count: number, lambda = 0.14) => {
  const pool = [...ranked];
  const picked: Recommendation[] = [];
  while (picked.length < count && pool.length > 0) {
    let best = 0;
    let bestValue = -Infinity;
    pool.forEach((candidate, index) => {
      const repeat = picked.length ? Math.max(...picked.map((p) => similarity(candidate, p))) : 0;
      const value = candidate.score - lambda * repeat;
      if (value > bestValue) {
        bestValue = value;
        best = index;
      }
    });
    const pick = pool.splice(best, 1)[0]!;
    picked.push({ ...pick, match: Math.round(clamp(bestValue) * 100) });
  }
  return picked;
};

/** Candidates without a poster or synopsis make poor suggestions; duplicates are merged. */
export const cleanCandidates = (candidates: Candidate[]) => {
  const seen = new Map<string, Candidate>();
  for (const candidate of candidates) {
    if (!candidate.posterPath || !candidate.overview) continue;
    const key = `${candidate.mediaType}-${candidate.id}`;
    const existing = seen.get(key);
    // Strict results beat relaxed copies of the same title.
    if (!existing || (existing.relaxed && !candidate.relaxed)) seen.set(key, candidate);
  }
  return [...seen.values()];
};

export const RESULT_COUNT = 20;

export const recommend = (candidates: Candidate[], answers: Complete, context: ScoreContext) =>
  diversify(
    cleanCandidates(candidates)
      .map((candidate) => scoreCandidate(candidate, answers, context))
      .sort((a, b) => b.score - a.score),
    RESULT_COUNT,
  );
