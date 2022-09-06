import React, { createContext, useContext, useEffect, useState } from "react";
import { useCallback } from "react";

//creo el contexto
const AppContext = createContext();
//lo identifico y exporto para usarlo
export const useAppContext = () => useContext(AppContext);

const AppContextProvider = ({ children }) => {
  //estado donde se almacena las peliculas ordenadas por popularidad, y busquedas
  const [moviesList, setMoviesList] = useState([]);
console.log(moviesList)
  //estado donde guardo las series populares
  const [tvPopularList, setTvPopularList] = useState();

  //estado donde guardo las personas populares
  const [popularPeople, setPopularPeople] = useState();

  //estado donde se guarda las peliculas filtradas por estrellas (se seteo en StartCalification.jsx)
  const [startsList, setStartsList] = useState([]);

  //seteo caracteres ingresados por el usuario desde el input de busqueda
  const [searchKey, setSearchKey] = useState("");

  //paginas
  const [pagination, setPagination] = useState(1);

  useEffect(() => {
    getFilms();
    getPopularTv();
    getPopularPeople();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination]);

  //Datos obtenidos de la api
  const apiKey = "2b935647da58bcc58e034d8d53657003";
  const baseUrl = "https://api.themoviedb.org/3/";

  //obteniendo peliculas populares
  const type = searchKey ? "search" : "discover";
  const getFilms = useCallback(
    async (searchKey) => {
      try {
        const dataFilms = await fetch(
          `${baseUrl}${type}/movie?api_key=${apiKey}&language=es&query=${searchKey}&page=${pagination}`
        );
        const dataJsonFilms = await dataFilms.json();
        setMoviesList(dataJsonFilms.results);
      } catch (error) {
        console.log(error);
      }
    },
    [pagination, type]
  );

  //obteniendo series populares
  const getPopularTv = useCallback(
    async (searchKey) => {
      try {
        const dataPopularTv = await fetch(
          `${baseUrl}${type}/tv?api_key=${apiKey}&language=es&query=${searchKey}&page=${pagination}`
        );
        const dataJsonPopularTv = await dataPopularTv.json();
        setTvPopularList(dataJsonPopularTv.results);
      } catch (error) {
        console.log(error);
      }
    },
    [pagination, type]
  );
  //obteniendo personas populares
  const getPopularPeople = async () => {
    try {
      const dataPeople = await fetch(
        `${baseUrl}person/popular?api_key=${apiKey}&language=es&page=${pagination}`
      );
      const dataJsonPeople = await dataPeople.json();
      setPopularPeople(dataJsonPeople.results);
    } catch (error) {
      console.log(error);
    }
  };

  //funcion para buscar peliculas
  const searchMovies = useCallback(
    (e) => {
      e.preventDefault();
      getFilms(searchKey);
      getPopularTv(searchKey);
    },
    [getFilms, getPopularTv, searchKey]
  );

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
        apiKey,
        baseUrl,
        popularPeople,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
