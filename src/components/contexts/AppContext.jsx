import React, { createContext, useContext, useEffect, useState } from "react";

//creo el contexto
const AppContext = createContext();
//lo identifico y exporto para usarlo
export const useAppContext = () => useContext(AppContext);

const AppContextProvider = ({ children }) => {
  //estado donde se almacena las peliculas ordenadas por popularidad, y busquedas
  const [moviesList, setMoviesList] = useState();
  console.log(moviesList);
  //estado donde guardo las series populares
  const [tvPopularList, setTvPopularList] = useState();

  //estado donde se guarda las peliculas filtradas por estrellas (se seteo en StartCalification.jsx)
  const [startsList, setStartsList] = useState();
  const [moviesGenre, setMoviesGenre] = useState();
  console.log(moviesGenre);
  //seteo caracteres ingresados por el usuario desde el input de busqueda
  const [searchKey, setSearchKey] = useState("");
  console.log(searchKey);

  //paginas
  const [pagination, setPagination] = useState(1);

  useEffect(() => {
    getFilms();
    getPopularTv();
    getGenresName();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination]);

  //Datos obtenidos de la api
  const apiKey = "2b935647da58bcc58e034d8d53657003";
  const baseUrl = "https://api.themoviedb.org/3/";

  //obteniendo peliculas populares
  const type = searchKey ? "search" : "discover";
  const getFilms = async (searchKey) => {
    await fetch(
      `${baseUrl}${type}/movie?api_key=${apiKey}&language=es&query=${searchKey}&page=${pagination}`
    )
      .then((response) => response.json())
      .then((data) => setMoviesList(data.results));
  };

  //obteniendo series populares
  const getPopularTv = async (searchKey) => {
    await fetch(
      `${baseUrl}${type}/tv?api_key=${apiKey}&language=es&query=${searchKey}&page=${pagination}`
    )
      .then((response) => response.json())
      .then((data) => setTvPopularList(data.results));
  };

  //obteniendo generos
  const getGenresName = () => {
    fetch(`${baseUrl}genre/movie/list?api_key=${apiKey}&language=es`)
      .then((response) => response.json())
      .then((data) => setMoviesGenre(data.genres));
  };

  //funcion para buscar peliculas
  function searchMovies(e) {
    e.preventDefault();
    getFilms(searchKey);
    getPopularTv(searchKey);
  }

  //funcion para scroll hasta seccion peliculas y series
  const scrollToPopularFilmsTv = () => {
    window.scrollTo({
      top: 630,
      behavior: "smooth",
    });
  };

  return (
    <AppContext.Provider
      value={{
        searchKey,
        searchMovies,
        setSearchKey,
        moviesList,
        setMoviesList,
        getFilms,
        setStartsList,
        startsList,
        setPagination,
        pagination,
        tvPopularList,
        scrollToPopularFilmsTv,
        moviesGenre,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
