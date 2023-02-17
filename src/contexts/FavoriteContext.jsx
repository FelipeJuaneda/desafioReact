import React, { createContext, useContext, useEffect, useReducer } from "react";
import FavReducer from "./FavReducer";
const FavoriteContext = createContext();
export const useFavoriteContext = () => useContext(FavoriteContext);

const FavoriteContextProvider = ({ children }) => {
  //estado donde guarda las lista de favs
  const initialState = {
    favoritemovie: localStorage.getItem("favoritemovie")
      ? JSON.parse(localStorage.getItem("favoritemovie"))
      : [],
    favoritetv: localStorage.getItem("favoritetv")
      ? JSON.parse(localStorage.getItem("favoritetv"))
      : [],
  };
  //use reduce para agregar a favorito peliculas
  const [state, dispatch] = useReducer(FavReducer, initialState);

  useEffect(() => {
    localStorage.setItem("favoritemovie", JSON.stringify(state.favoritemovie));
    localStorage.setItem("favoritetv", JSON.stringify(state.favoritetv));
  }, [state]);

  //AGREGANDO FAVORITE LIST CON USE REDUCE
  const addMovieToFavorite = (movie) => {
    dispatch({ type: "ADD_MOVIE_TO_FAVORITEMOVIE", payload: movie });
  };
  const removeMovieToFavorite = (id) => {
    dispatch({ type: "REMOVE_MOVIE_TO_FAVORITEMOVIE", payload: id });
  };
  const removeAllMoviesInFavorite = () => {
    dispatch({ type: "REMOVE_ALL_MOVIES_IN_FAVORITEMOVIE" });
  };

  const addTvToTvList = (tv) => {
    dispatch({ type: "ADD_TV_TO_TVLIST", payload: tv });
  };
  const removeTvToTvList = (id) => {
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
