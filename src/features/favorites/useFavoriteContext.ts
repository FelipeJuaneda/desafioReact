import { createContext, useContext } from "react";
import type { Favorite, FavoriteInput } from "@/features/favorites/favorite";
import type { MediaType } from "@/types/tmdb";

export type FavoritesStatus = "signed-out" | "loading" | "ready" | "error";

export interface FavoriteContextValue {
  favorites: Favorite[];
  status: FavoritesStatus;
  isFavorite: (mediaType: MediaType, tmdbId: number) => boolean;
  /** Resolves once Firestore accepts the write; the list updates optimistically before that. */
  addFavorite: (input: FavoriteInput) => Promise<void>;
  removeFavorite: (mediaType: MediaType, tmdbId: number) => Promise<void>;
}

export const FavoriteContext = createContext<FavoriteContextValue | null>(null);

export const useFavoriteContext = () => {
  const context = useContext(FavoriteContext);
  if (!context) throw new Error("useFavoriteContext must be used inside <FavoritesProvider>");
  return context;
};
