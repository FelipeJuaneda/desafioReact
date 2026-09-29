import { createContext, useContext } from "react";
import type { FavoriteState } from "@/features/favorites/favoritesReducer";
import type { MovieDetail, TvDetail } from "@/types/tmdb";

export interface FavoriteContextValue extends FavoriteState {
  addMovieToFavorite: (movie: MovieDetail) => void;
  removeMovieToFavorite: (id: number) => void;
  removeAllMoviesInFavorite: () => void;
  addTvToTvList: (tv: TvDetail) => void;
  removeTvToTvList: (id: number) => void;
  removeAllTvInTvList: () => void;
}

export const FavoriteContext = createContext<FavoriteContextValue | null>(null);

export const useFavoriteContext = () => {
  const context = useContext(FavoriteContext);
  if (!context) {
    throw new Error("useFavoriteContext must be used inside <FavoriteContextProvider>");
  }
  return context;
};
