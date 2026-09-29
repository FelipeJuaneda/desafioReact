// Before accounts, favorites lived in localStorage as full TMDB objects under two keys.
// On first sign-in they are imported into the user's Firestore list, then cleared.
import { toFavoriteInput, type FavoriteInput } from "@/features/favorites/favorite";
import type { MediaType, MovieSummary, TvSummary } from "@/types/tmdb";

const LEGACY_KEYS: Record<MediaType, string> = { movie: "favoritemovie", tv: "favoritetv" };

const isLegacyItem = (value: unknown): value is MovieSummary | TvSummary => {
  if (typeof value !== "object" || value === null) return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.id === "number" && (typeof item.title === "string" || typeof item.name === "string")
  );
};

const readKey = (storage: Storage, key: string): unknown[] => {
  try {
    const parsed: unknown = JSON.parse(storage.getItem(key) ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    // Corrupt data is not worth failing sign-in over.
    return [];
  }
};

export const readLegacyFavorites = (storage: Storage = localStorage): FavoriteInput[] =>
  (Object.keys(LEGACY_KEYS) as MediaType[]).flatMap((mediaType) =>
    readKey(storage, LEGACY_KEYS[mediaType])
      .filter(isLegacyItem)
      .map((item) => toFavoriteInput(mediaType, item)),
  );

export const clearLegacyFavorites = (storage: Storage = localStorage) => {
  for (const key of Object.values(LEGACY_KEYS)) storage.removeItem(key);
};
