// What a shared link needs to know about a title: fetched once from TMDB (es-MX, like the app)
// and turned into the <head> tags that WhatsApp, X, Telegram… read, plus the data for the card.
import { formatRating, formatRuntime, formatSeasons, formatYear } from "../../src/lib/format.js";
import { slugify } from "../../src/lib/slug.js";

export type ShareKind = "movie" | "tv";

export interface ShareTitle {
  kind: ShareKind;
  id: number;
  name: string;
  year: string | null;
  length: string | null;
  rating: string | null;
  genres: string[];
  tagline: string | null;
  overview: string | null;
  posterPath: string | null;
  backdropPath: string | null;
}

interface TmdbTitle {
  id: number;
  title?: string;
  name?: string;
  release_date?: string;
  first_air_date?: string;
  runtime?: number | null;
  number_of_seasons?: number | null;
  vote_average?: number;
  genres?: { name: string }[];
  tagline?: string | null;
  overview?: string | null;
  poster_path?: string | null;
  backdrop_path?: string | null;
}

/** "pelicula" / "serie" (the app's URL segment) or "movie" / "tv" -> ShareKind. */
export const parseKind = (value: string | null): ShareKind | null => {
  if (value === "movie" || value === "pelicula") return "movie";
  if (value === "tv" || value === "serie") return "tv";
  return null;
};

/** "550-el-club-de-la-pelea" or "550" -> 550. */
export const parseId = (value: string | null) => {
  const match = /^(\d{1,9})(?:-|$)/.exec(value ?? "");
  return match ? Number(match[1]) : null;
};

/** Same URL the app builds in paths.title (src/app/paths.ts). */
export const titlePath = (kind: ShareKind, id: number, name: string) => {
  const slug = slugify(name);
  return `/${kind === "movie" ? "pelicula" : "serie"}/${id}${slug ? `-${slug}` : ""}`;
};

export const toShareTitle = (kind: ShareKind, data: TmdbTitle): ShareTitle => ({
  kind,
  id: data.id,
  name: (kind === "movie" ? data.title : data.name) ?? data.title ?? data.name ?? "",
  year: formatYear(kind === "movie" ? data.release_date : data.first_air_date),
  length: kind === "movie" ? formatRuntime(data.runtime) : formatSeasons(data.number_of_seasons),
  rating: formatRating(data.vote_average),
  genres: (data.genres ?? []).map((genre) => genre.name),
  tagline: data.tagline?.trim() || null,
  overview: data.overview?.trim() || null,
  posterPath: data.poster_path ?? null,
  backdropPath: data.backdrop_path ?? null,
});

/** The title in Latin American Spanish, or null when TMDB doesn't know it (or is down). */
export const fetchShareTitle = async (
  kind: ShareKind,
  id: number,
  token: string,
): Promise<ShareTitle | null> => {
  try {
    const response = await fetch(`https://api.themoviedb.org/3/${kind}/${id}?language=es-MX`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      signal: AbortSignal.timeout(4000),
    });
    if (!response.ok) return null;
    const title = toShareTitle(kind, (await response.json()) as TmdbTitle);
    return title.name ? title : null;
  } catch {
    return null;
  }
};

/** Cuts at a word boundary so previews never end mid-word. */
export const clip = (text: string, max: number) => {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return `${cut.slice(0, Math.max(cut.lastIndexOf(" "), max * 0.6)).replace(/[\s.,;:–-]+$/, "")}…`;
};

const escape = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

/** Bump when the card design changes: chat apps cache previews by image URL. */
export const CARD_VERSION = "1";

export const cardUrl = (origin: string, title: Pick<ShareTitle, "kind" | "id">) =>
  `${origin}/api/og?type=${title.kind}&id=${title.id}&v=${CARD_VERSION}`;

/** The <head> block for one title; replaces the site-wide block in index.html. */
export const titleHead = (title: ShareTitle, origin: string) => {
  const kindLabel = title.kind === "movie" ? "Película" : "Serie";
  const heading = title.year ? `${title.name} (${title.year})` : title.name;
  const description = title.overview
    ? clip(title.overview, 200)
    : `${kindLabel} en PelicuLed: sinopsis, reparto y tráiler.`;
  const url = `${origin}${titlePath(title.kind, title.id, title.name)}`;
  const image = cardUrl(origin, title);
  const imageAlt = `${kindLabel}: ${heading}, en PelicuLed.`;

  const tags: [string, string, string][] = [
    ["property", "og:type", title.kind === "movie" ? "video.movie" : "video.tv_show"],
    ["property", "og:site_name", "PelicuLed"],
    ["property", "og:locale", "es_AR"],
    ["property", "og:title", heading],
    ["property", "og:description", description],
    ["property", "og:url", url],
    ["property", "og:image", image],
    ["property", "og:image:type", "image/jpeg"],
    ["property", "og:image:width", "1200"],
    ["property", "og:image:height", "630"],
    ["property", "og:image:alt", imageAlt],
    ["name", "twitter:card", "summary_large_image"],
    ["name", "twitter:title", heading],
    ["name", "twitter:description", description],
    ["name", "twitter:image", image],
    ["name", "twitter:image:alt", imageAlt],
  ];

  return [
    `<title>${escape(`${heading} · PelicuLed`)}</title>`,
    `<meta name="description" content="${escape(description)}" />`,
    `<link rel="canonical" href="${escape(url)}" />`,
    ...tags.map(([attr, key, value]) => `<meta ${attr}="${key}" content="${escape(value)}" />`),
  ].join("\n    ");
};

const HEAD_BLOCK = /<!-- share:start -->[\s\S]*?<!-- share:end -->/;

/** Swaps the site-wide title, description and Open Graph tags for the title's own. */
export const injectHead = (html: string, head: string) =>
  HEAD_BLOCK.test(html)
    ? html.replace(HEAD_BLOCK, () => `<!-- share:start -->\n    ${head}\n    <!-- share:end -->`)
    : html.replace("</head>", () => `    ${head}\n  </head>`);
