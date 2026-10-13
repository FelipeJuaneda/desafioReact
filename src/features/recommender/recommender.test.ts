import { describe, expect, it } from "vitest";
import {
  companyFit,
  diversify,
  discoverRequests,
  moodFit,
  recommend,
  scoreCandidate,
  weightedRating,
  type Candidate,
  type ScoreContext,
} from "./engine";
import {
  answersBefore,
  currentStep,
  isComplete,
  parseAnswers,
  writeAnswers,
  type Complete,
} from "./questions";

const answers: Complete = {
  con: "pareja",
  tipo: "pelicula",
  tiempo: "normal",
  animo: ["reir", "tension"],
  epoca: "siglo",
  donde: [8, 1899],
};

const candidate = (overrides: Partial<Candidate>): Candidate => ({
  id: 1,
  mediaType: "movie",
  title: "Una película",
  date: "2015-06-01",
  genreIds: [35],
  voteAverage: 7.5,
  voteCount: 5000,
  popularity: 50,
  posterPath: "/p.jpg",
  backdropPath: null,
  overview: "Sinopsis.",
  ...overrides,
});

const context: ScoreContext = {
  today: "2026-10-13",
  saved: new Set(),
  genreNames: new Map([
    [35, "Comedia"],
    [53, "Suspense"],
    [16, "Animación"],
  ]),
};

describe("questions in the URL", () => {
  it("round-trips answers and walks the steps in order", () => {
    const params = writeAnswers(answers);
    expect(params.toString()).toBe(
      "con=pareja&tipo=pelicula&tiempo=normal&animo=reir%2Ctension&epoca=siglo&donde=8%2C1899",
    );
    expect(parseAnswers(params)).toEqual(answers);
    expect(isComplete(parseAnswers(params))).toBe(true);
    expect(currentStep({ con: "solo", tipo: "serie" })).toBe("tiempo");
    expect(answersBefore(answers, "tiempo")).toEqual({ con: "pareja", tipo: "pelicula" });
  });

  it("drops unknown values, extra moods and horror for families", () => {
    const parsed = parseAnswers(
      new URLSearchParams("con=familia&animo=miedo,reir,accion,pensar&donde=8,999&tipo=x"),
    );
    expect(parsed.tipo).toBeUndefined();
    expect(parsed.animo).toEqual(["reir", "accion"]);
    expect(parsed.donde).toEqual([8]);
    expect(parseAnswers(new URLSearchParams("donde=todas")).donde).toEqual([]);
  });
});

describe("searches", () => {
  it("translates the answers into TMDB filters", () => {
    const [popular, , acclaimed] = discoverRequests(answers, "movie", "2026-10-13");
    expect(popular!.params).toMatchObject({
      with_genres: "35|53|9648|80",
      // Couples only lose points for kids' genres; documentaries are out unless asked for.
      without_genres: "99",
      "with_runtime.lte": 135,
      "primary_release_date.gte": "2000-01-01",
      with_watch_providers: "8|1899",
      watch_region: "AR",
      sort_by: "popularity.desc",
    });
    expect(acclaimed!.params).toMatchObject({
      sort_by: "vote_average.desc",
      "vote_count.gte": 1500,
    });
  });

  it("keeps families safe and drops runtime and era when relaxed", () => {
    const family = { ...answers, con: "familia" as const, animo: ["accion" as const] };
    const [strict] = discoverRequests(family, "movie", "2026-10-13");
    expect(strict!.params).toMatchObject({ "certification.lte": "PG" });
    expect(String(strict!.params.without_genres)).toContain("27");
    const [relaxed] = discoverRequests(family, "tv", "2026-10-13", true);
    expect(relaxed!.params).not.toHaveProperty("with_runtime.lte");
    expect(relaxed!.params).not.toHaveProperty("first_air_date.gte");
    expect(String(relaxed!.params.without_genres)).toContain("10767");
  });
});

describe("scoring", () => {
  it("trusts ratings only with enough votes", () => {
    expect(weightedRating(9.5, 20, "movie")).toBeLessThan(weightedRating(8.2, 20000, "movie"));
  });

  it("rewards the mood's core genre over a side genre", () => {
    expect(moodFit(candidate({ genreIds: [35, 18] }), ["reir"])).toBe(1);
    expect(moodFit(candidate({ genreIds: [18, 35] }), ["reir"])).toBe(0.7);
    expect(moodFit(candidate({ genreIds: [18] }), ["reir", "tension"])).toBe(0);
  });

  it("knows what works for each audience", () => {
    expect(companyFit(candidate({ genreIds: [10749, 35] }), "pareja")).toBeGreaterThan(
      companyFit(candidate({ genreIds: [16, 10751] }), "pareja"),
    );
    expect(companyFit(candidate({ genreIds: [27] }), "familia")).toBeCloseTo(0.2);
  });

  it("explains each pick and nudges titles already in your list", () => {
    const loved = candidate({ genreIds: [35, 53], voteAverage: 8.4, voteCount: 30000 });
    const plain = scoreCandidate(loved, answers, context);
    const saved = scoreCandidate(loved, answers, { ...context, saved: new Set(["movie-1"]) });
    expect(saved.score).toBeGreaterThan(plain.score);
    expect(saved.reasons.map((r) => r.text)).toEqual([
      "Ya la tenías en tu lista",
      "Comedia y Suspense, como pediste",
      "Aclamada: 8,4 con 30 mil votos",
    ]);
    expect(plain.match).toBe(Math.round(plain.score * 100));
  });

  it("ranks better fits first and keeps a franchise from filling the list", () => {
    const pool = [
      candidate({ id: 1, title: "Toy Story", genreIds: [35], voteAverage: 8 }),
      candidate({ id: 2, title: "Toy Story 2", genreIds: [35], voteAverage: 7.9 }),
      candidate({ id: 3, title: "Toy Story 3", genreIds: [35], voteAverage: 7.9 }),
      candidate({ id: 4, title: "Perdida", genreIds: [53], voteAverage: 7.8 }),
      candidate({ id: 5, title: "Sin sinopsis", overview: "" }),
    ];
    const ranked = recommend(pool, answers, context);
    expect(ranked.map((r) => r.id)).not.toContain(5);
    expect(ranked[0]!.id).toBe(1);
    // "Perdida" jumps the sequels: same score range, but not more of the same.
    expect(ranked[1]!.id).toBe(4);
    expect(diversify([], 10)).toEqual([]);
    // Shown in rank order, the match never rises.
    const matches = ranked.map((r) => r.match);
    expect(matches).toEqual([...matches].sort((a, b) => b - a));
  });
});
