import React, { createContext, useContext, useEffect, useState } from "react";

//creo el contexto
const AppContext = createContext();
//lo identifico y exporto para usarlo
export const useAppContext = () => useContext(AppContext);

const AppContextProvider = ({ children }) => {
  //estado donde se almacena las peliculas ordenadas por popularidad, y busquedas
  const [moviesList, setMoviesList] = useState();
  //estado donde se guarda las peliculas filtradas por estrellas (se seteo en StartCalification.jsx)
  const [moviesStarts, setMoviesStarts] = useState();
  //seteo caracteres ingresados por el usuario desde el input de busqueda
  const [searchKey, setSearchKey] = useState("");

  //paginas
  const [pagination, setPagination] = useState(1);

  useEffect(() => {
    getFilms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination]);

  //Datos obtenidos de la api
  const apiKey = "2b935647da58bcc58e034d8d53657003";
  const baseUrl = "https://api.themoviedb.org/3/";
  const getFilms = async (searchKey) => {
    const type = searchKey ? "search" : "discover";
    await fetch(
      `${baseUrl}${type}/movie?api_key=${apiKey}&language=es&query=${searchKey}&page=${pagination}`
    )
      .then((response) => response.json())
      .then((data) => setMoviesList(data.results));
  };

  //funcion para buscar peliculas
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
        setPagination,
        pagination,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
