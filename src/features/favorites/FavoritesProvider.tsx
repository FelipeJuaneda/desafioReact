import { useEffect, useReducer, type ReactNode } from "react";
import FavReducer, { type FavoriteState } from "@/features/favorites/favoritesReducer";
import { FavoriteContext } from "@/features/favorites/useFavoriteContext";
import type { MovieDetail, TvDetail } from "@/types/tmdb";

const readStoredList = <T,>(key: string): T[] => {
  const stored = localStorage.getItem(key);
  return stored ? (JSON.parse(stored) as T[]) : [];
};

const FavoriteContextProvider = ({ children }: { children: ReactNode }) => {
  //estado donde guarda las lista de favs
  const initialState: FavoriteState = {
    favoritemovie: readStoredList<MovieDetail>("favoritemovie"),
    favoritetv: readStoredList<TvDetail>("favoritetv"),
  };
  //use reduce para agregar a favorito peliculas
  const [state, dispatch] = useReducer(FavReducer, initialState);

  useEffect(() => {
    localStorage.setItem("favoritemovie", JSON.stringify(state.favoritemovie));
    localStorage.setItem("favoritetv", JSON.stringify(state.favoritetv));
  }, [state]);

  //AGREGANDO FAVORITE LIST CON USE REDUCE
  const addMovieToFavorite = (movie: MovieDetail) => {
    dispatch({ type: "ADD_MOVIE_TO_FAVORITEMOVIE", payload: movie });
  };
  const removeMovieToFavorite = (id: number) => {
    dispatch({ type: "REMOVE_MOVIE_TO_FAVORITEMOVIE", payload: id });
  };
  const removeAllMoviesInFavorite = () => {
    dispatch({ type: "REMOVE_ALL_MOVIES_IN_FAVORITEMOVIE" });
  };

  const addTvToTvList = (tv: TvDetail) => {
    dispatch({ type: "ADD_TV_TO_TVLIST", payload: tv });
  };
  const removeTvToTvList = (id: number) => {
    dispatch({ type: "REMOVE_TV_TO_TVLIST", payload: id });
  };
  const removeAllTvInTvList = () => {
    dispatch({ type: "REMOVE_ALL_TV_IN_TVLIST" });
  };
  return (
    <FavoriteContext.Provider
      value={{
        favoritemovie: state.favoritemovie,
        favoritetv: state.favoritetv,
        addMovieToFavorite,
        removeMovieToFavorite,
        removeAllMoviesInFavorite,
        addTvToTvList,
        removeTvToTvList,
        removeAllTvInTvList,
      }}
    >
      {children}
    </FavoriteContext.Provider>
  );
};

export default FavoriteContextProvider;
