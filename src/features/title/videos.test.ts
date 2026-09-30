import { describe, expect, it } from "vitest";
import type { Video } from "@/types/tmdb";
import { audioVersion, pickTrailer, rankVideos } from "./videos";

const video = (
  id: string,
  lang: string,
  country: string,
  type = "Trailer",
  official = true,
): Video => ({
  id,
  key: id,
  name: id,
  site: "YouTube",
  type,
  iso_639_1: lang,
  iso_3166_1: country,
  official,
});

describe("audioVersion", () => {
  it("tells Latin American Spanish from Spain's and from the original", () => {
    expect(audioVersion(video("a", "es", "MX"))).toBe("latino");
    expect(audioVersion(video("b", "es", "AR"))).toBe("latino");
    expect(audioVersion(video("c", "es", "ES"))).toBe("espana");
    expect(audioVersion(video("d", "en", "US"))).toBe("original");
  });
});

describe("rankVideos / pickTrailer", () => {
  it("plays the Latin trailer when there is one, even if Spain's comes first from TMDB", () => {
    const ranked = rankVideos([
      video("spain", "es", "ES"),
      video("en", "en", "US"),
      video("mx", "es", "MX"),
    ]);
    expect(ranked.map((v) => v.id)).toEqual(["mx", "en", "spain"]);
    expect(pickTrailer(ranked)?.id).toBe("mx");
  });

  it("prefers the original over Spain's dub when there is no Latin version", () => {
    const ranked = rankVideos([video("spain", "es", "ES"), video("en", "en", "US")]);
    expect(pickTrailer(ranked)?.id).toBe("en");
  });

  it("falls back to Spain's trailer only when nothing else exists", () => {
    expect(pickTrailer(rankVideos([video("spain", "es", "ES")]))?.id).toBe("spain");
  });

  it("puts trailers before teasers and official uploads first, and drops non-YouTube videos", () => {
    const vimeo = { ...video("vimeo", "es", "MX"), site: "Vimeo" };
    const ranked = rankVideos([
      video("teaser", "es", "MX", "Teaser"),
      video("fan", "es", "MX", "Trailer", false),
      video("official", "es", "MX", "Trailer", true),
      vimeo,
    ]);
    expect(ranked.map((v) => v.id)).toEqual(["official", "fan", "teaser"]);
  });
});
