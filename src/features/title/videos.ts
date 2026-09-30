import type { Video } from "@/types/tmdb";

/**
 * Which audio a video carries, as far as TMDB knows. PelicuLed speaks Latin American Spanish:
 * a Latin dub or subtitled cut comes first, then the original version, and Spain's dub last.
 * (TMDB tags Latin American uploads es-MX; anything Spanish that is not es-ES counts as Latin.)
 */
export type AudioVersion = "latino" | "original" | "espana";

export const audioVersion = (video: Video): AudioVersion => {
  if (video.iso_639_1 !== "es") return "original";
  return video.iso_3166_1 === "ES" ? "espana" : "latino";
};

export const AUDIO_LABELS: Record<AudioVersion, string> = {
  latino: "Latino",
  original: "Versión original",
  espana: "España",
};

const VERSION_RANK: Record<AudioVersion, number> = { latino: 0, original: 1, espana: 2 };
const TYPE_RANK: Record<string, number> = { Trailer: 0, Teaser: 1, Clip: 2 };

/** Latin first, then original, then Spain; within each, trailers and official uploads first. */
export const rankVideos = (videos: Video[]) =>
  videos
    .filter((video) => video.site === "YouTube")
    .map((video, index) => ({ video, index }))
    .sort(
      (a, b) =>
        VERSION_RANK[audioVersion(a.video)] - VERSION_RANK[audioVersion(b.video)] ||
        (TYPE_RANK[a.video.type] ?? 3) - (TYPE_RANK[b.video.type] ?? 3) ||
        Number(Boolean(b.video.official)) - Number(Boolean(a.video.official)) ||
        a.index - b.index,
    )
    .map(({ video }) => video);

/** The trailer the "Ver tráiler" button plays: the best-ranked trailer, else the best video. */
export const pickTrailer = (ranked: Video[]) =>
  ranked.find((video) => video.type === "Trailer") ?? ranked[0];
