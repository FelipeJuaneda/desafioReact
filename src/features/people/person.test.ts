import { describe, expect, it } from "vitest";
import { knownFor, type PersonDetail } from "./person";

const credit = (
  id: number,
  votes: number,
  media_type: "movie" | "tv" = "movie",
  job?: string,
  order?: number,
) => ({ id, media_type, vote_count: votes, job, order, title: `T${id}`, name: `T${id}` }) as never;

const person = (overrides: Partial<PersonDetail>): PersonDetail => ({
  id: 1,
  name: "Alguien",
  biography: "",
  birthday: null,
  deathday: null,
  place_of_birth: null,
  profile_path: null,
  known_for_department: "Acting",
  combined_credits: { cast: [], crew: [] },
  ...overrides,
});

describe("knownFor", () => {
  it("ranks acting credits by votes and drops repeated titles", () => {
    const result = knownFor(
      person({
        combined_credits: {
          cast: [
            credit(1, 10),
            credit(7, 5000, "movie", undefined, 40),
            credit(2, 900),
            credit(2, 900),
            credit(1, 50, "tv"),
          ],
          crew: [],
        },
      }),
    );
    expect(result.map((r) => `${r.mediaType}-${r.item.id}`)).toEqual([
      "movie-2",
      "tv-1",
      "movie-1",
    ]);
  });

  it("uses directing credits for directors", () => {
    const result = knownFor(
      person({
        known_for_department: "Directing",
        combined_credits: {
          cast: [credit(9, 999)],
          crew: [credit(3, 5, "movie", "Director"), credit(4, 99, "movie", "Writer")],
        },
      }),
    );
    expect(result.map((r) => r.item.id)).toEqual([3]);
  });
});
