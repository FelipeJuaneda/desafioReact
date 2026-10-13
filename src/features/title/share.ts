import { paths } from "@/app/paths";
import { formatYear } from "@/lib/format";
import { getTitle, type MediaType, type TitleDetail } from "@/types/tmdb";

export interface ShareData {
  title: string;
  text: string;
  url: string;
}

/** What gets shared: the title's canonical URL (its link preview is built server-side). */
export const shareData = (mediaType: MediaType, title: TitleDetail, origin: string): ShareData => {
  const name = getTitle(title);
  const year = formatYear("release_date" in title ? title.release_date : title.first_air_date);
  const heading = year ? `${name} (${year})` : name;
  return {
    title: `${heading} · PelicuLed`,
    text: `${heading} en PelicuLed`,
    url: `${origin}${paths.title(mediaType, title.id, name)}`,
  };
};

export type ShareTarget = "whatsapp" | "x" | "telegram" | "facebook" | "email";

/** Each network's own "share this link" URL; the preview comes from the shared page. */
export const shareLink = (target: ShareTarget, { title, text, url }: ShareData) => {
  const enc = encodeURIComponent;
  switch (target) {
    case "whatsapp":
      return `https://wa.me/?text=${enc(`${text} ${url}`)}`;
    case "x":
      return `https://x.com/intent/post?text=${enc(text)}&url=${enc(url)}`;
    case "telegram":
      return `https://t.me/share/url?url=${enc(url)}&text=${enc(text)}`;
    case "facebook":
      return `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`;
    case "email":
      return `mailto:?subject=${enc(title)}&body=${enc(`${text}\n${url}`)}`;
  }
};

/**
 * Phones get the system share sheet (every app the person has, one tap). Desktop share sheets
 * are thin, so there the button opens PelicuLed's own menu.
 */
export const prefersNativeShare = (data: ShareData) =>
  typeof navigator !== "undefined" &&
  typeof navigator.share === "function" &&
  (navigator.canShare?.(data) ?? true) &&
  window.matchMedia("(pointer: coarse)").matches;
