import { describe, expect, it } from "vitest";
import type { Favorite } from "@/features/favorites/favorite";
import { mergePicks, pickSeeds } from "@/features/for-you/forYou";
import { googleCalendarUrl, icsContent } from "@/features/releases/calendar";
import { groupByReleaseDay } from "@/features/releases/schedule";
import {
  defaultSeason,
  episodeCode,
  isUpcoming,
  orderSeasons,
  parseSeason,
} from "@/features/title/episodes";
import { groupOffer } from "@/features/title/providers";
import { localTheatricalDate } from "@/features/title/useLocalRelease";
import { dateStamp, daysUntil, formatCountdown, formatShortDate, todayIso } from "@/lib/dates";
import type { MovieSummary, SeasonSummary, WatchProvider } from "@/types/tmdb";

const movie = (id: number, release_date: string, vote_average = 7): MovieSummary => ({
  id,
  title: `Película ${id}`,
  release_date,
  vote_average,
  overview: "",
  poster_path: `/p${id}.jpg`,
  backdrop_path: null,
});

describe("dates", () => {
  it("reads TMDB dates as local days", () => {
    expect(todayIso(new Date(2026, 9, 13, 23, 30))).toBe("2026-10-13");
    expect(daysUntil("2026-10-16", "2026-10-13")).toBe(3);
    expect(daysUntil("2026-10-12", "2026-10-13")).toBe(-1);
    expect(dateStamp("2026-10-16")).toEqual({
      weekday: "vie",
      day: "16",
      month: "oct",
      year: "2026",
    });
    expect(formatShortDate("2026-10-16", "2026-10-13")).toBe("16 oct");
    expect(formatShortDate("2027-01-07", "2026-10-13")).toBe("7 ene 2027");
    expect(formatShortDate("", "2026-10-13")).toBeNull();
  });

  it("counts down in words", () => {
    expect(formatCountdown(0)).toBe("Hoy");
    expect(formatCountdown(1)).toBe("Mañana");
    expect(formatCountdown(9)).toBe("En 9 días");
    expect(formatCountdown(21)).toBe("En 3 semanas");
  });
});

describe("release reminders", () => {
  const event = {
    id: 550,
    title: "Street Fighter, la película",
    date: "2026-10-15",
    url: "https://peliculed.test/pelicula/550",
  };

  it("builds an all-day Google Calendar event", () => {
    const url = new URL(googleCalendarUrl(event));
    expect(url.searchParams.get("dates")).toBe("20261015/20261016");
    expect(url.searchParams.get("text")).toBe("Estreno: Street Fighter, la película");
  });

  it("writes a valid .ics with a reminder on the day", () => {
    const ics = icsContent(event, new Date("2026-10-13T12:00:00Z"));
    expect(ics).toContain("DTSTART;VALUE=DATE:20261015\r\nDTEND;VALUE=DATE:20261016");
    expect(ics).toContain("SUMMARY:Estreno: Street Fighter\\, la película");
    expect(ics).toContain("UID:estreno-550@peliculed");
    expect(ics).toContain("TRIGGER;RELATED=START:PT10H");
    for (const line of ics.split("\r\n")) {
      expect(new TextEncoder().encode(line).length).toBeLessThanOrEqual(75);
    }
  });
});

describe("release schedule", () => {
  it("groups openings by day, soonest first, skipping past dates", () => {
    const days = groupByReleaseDay(
      [
        movie(1, "2026-10-22"),
        movie(2, "2026-10-15"),
        movie(3, "2026-10-22"),
        movie(4, "2014-11-20"),
      ],
      "2026-10-13",
    );
    expect(days.map((d) => [d.date, d.movies.map((m) => m.id)])).toEqual([
      ["2026-10-15", [2]],
      ["2026-10-22", [1, 3]],
    ]);
  });

  it("prefers the Argentine theatrical date", () => {
    expect(
      localTheatricalDate({
        id: 1,
        results: [
          { iso_3166_1: "US", release_dates: [{ release_date: "2026-10-01T00:00:00Z", type: 3 }] },
          {
            iso_3166_1: "AR",
            release_dates: [
              { release_date: "2026-11-20T00:00:00Z", type: 4 },
              { release_date: "2026-10-16T00:00:00Z", type: 3 },
            ],
          },
        ],
      }),
    ).toBe("2026-10-16");
    expect(localTheatricalDate({ id: 1, results: [] })).toBeNull();
  });
});

describe("para vos", () => {
  const favorite = (tmdbId: number, title: string, added: number): Favorite => ({
    id: `movie-${tmdbId}`,
    tmdbId,
    mediaType: "movie",
    title,
    posterPath: null,
    releaseDate: null,
    voteAverage: 8,
    addedAt: new Date(added),
  });

  it("starts from the most recently saved titles", () => {
    const seeds = pickSeeds([
      favorite(1, "Vieja", 1),
      favorite(2, "Nueva", 3),
      favorite(3, "Media", 2),
    ]);
    expect(seeds.map((s) => s.title)).toEqual(["Nueva", "Media", "Vieja"]);
  });

  it("ranks titles several of yours point to, and skips the ones you saved", () => {
    const picks = mergePicks(
      [
        {
          seed: { mediaType: "movie", title: "Matrix" },
          results: [movie(10, "2000", 9), movie(11, "2001", 6)],
        },
        {
          seed: { mediaType: "movie", title: "Dune" },
          results: [movie(11, "2001", 6), movie(12, "2002", 8)],
        },
      ],
      new Set(["movie-12"]),
    );
    expect(picks.map((p) => [p.item.id, p.because])).toEqual([
      [11, "Matrix"],
      [10, "Matrix"],
    ]);
  });
});

describe("seasons", () => {
  const season = (season_number: number, episode_count = 10): SeasonSummary => ({
    id: season_number,
    name: season_number ? `Temporada ${season_number}` : "Especiales",
    season_number,
    episode_count,
    air_date: "2011-04-17",
    overview: "",
    poster_path: null,
    vote_average: 8,
  });

  it("orders regular seasons first, specials last, empty ones out", () => {
    const seasons = orderSeasons([season(0), season(2), season(1), season(3, 0)]);
    expect(seasons.map((s) => s.season_number)).toEqual([1, 2, 0]);
    expect(defaultSeason(seasons)).toBe(1);
    expect(parseSeason("2", seasons)).toBe(2);
    expect(parseSeason("9", seasons)).toBeNull();
    expect(parseSeason(null, seasons)).toBeNull();
  });

  it("labels episodes and knows what hasn't aired", () => {
    expect(episodeCode({ episode_number: 7 })).toBe("E07");
    expect(isUpcoming({ air_date: "2026-11-01" }, "2026-10-13")).toBe(true);
    expect(isUpcoming({ air_date: "2026-10-13" }, "2026-10-13")).toBe(false);
    expect(isUpcoming({ air_date: null }, "2026-10-13")).toBe(true);
  });
});

describe("where to watch", () => {
  const provider = (provider_id: number, display_priority: number): WatchProvider => ({
    provider_id,
    provider_name: `Servicio ${provider_id}`,
    logo_path: null,
    display_priority,
  });

  it("groups the offer the way people decide", () => {
    const groups = groupOffer({
      flatrate: [provider(2, 5), provider(1, 0)],
      free: [provider(1, 0)],
      rent: [provider(3, 1)],
      buy: [provider(3, 1), provider(4, 2)],
    });
    expect(groups.map((g) => [g.label, g.providers.map((p) => p.provider_id)])).toEqual([
      ["Incluida en", [1, 2]],
      ["Alquiler o compra", [3]],
      ["Compra", [4]],
    ]);
    expect(groupOffer(null)).toEqual([]);
  });
});
