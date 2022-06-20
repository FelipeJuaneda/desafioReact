import React, { createContext, useContext, useEffect, useState } from "react";

//creo el contexto
const AppContext = createContext();
//lo identifico y exporto para usarlo
export const useAppContext = () => useContext(AppContext);

const AppContextProvider = ({ children }) => {
  const [moviesList, setMoviesList] = useState();
  const [moviesStarts, setMoviesStarts] = useState();
  const [searchKey, setSearchKey] = useState("");

  useEffect(() => {
    getFilms();
  }, []);

  const apiKey = "2b935647da58bcc58e034d8d53657003";
  const baseUrl = "https://api.themoviedb.org/3/";

  const getFilms = async (searchKey) => {
    const type = searchKey ? "search" : "discover";
    await fetch(`${baseUrl}${type}/movie?api_key=${apiKey}&query=${searchKey}`)
      .then((response) => response.json())
      .then((data) => setMoviesList(data.results));
  };

  function searchMovies(e) {
    e.preventDefault();
    getFilms(searchKey);
  }

  return (
    <AppContext.Provider
      value={{
        searchKey,
        searchMovies,
        setSearchKey,
        moviesList,
        setMoviesList,
        getFilms,
        setMoviesStarts,
        moviesStarts,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
