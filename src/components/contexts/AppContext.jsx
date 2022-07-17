import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import FavReducer from "./FavReducer";

//creo el contexto
const AppContext = createContext();
//lo identifico y exporto para usarlo
export const useAppContext = () => useContext(AppContext);

const AppContextProvider = ({ children }) => {
  //estado donde se almacena las peliculas ordenadas por popularidad, y busquedas
  const [moviesList, setMoviesList] = useState();

  //estado donde guardo las series populares
  const [tvPopularList, setTvPopularList] = useState();

  //estado donde guardo las personas populares
  const [popularPeople, setPopularPeople] = useState();

  //estado donde se guarda las peliculas filtradas por estrellas (se seteo en StartCalification.jsx)
  const [startsList, setStartsList] = useState();

  //seteo caracteres ingresados por el usuario desde el input de busqueda
  const [searchKey, setSearchKey] = useState("");

  //paginas
  const [pagination, setPagination] = useState(1);

  //estado donde guarda las lista de favs
  const initialState = {
    watchlist: localStorage.getItem("watchlist")
      ? JSON.parse(localStorage.getItem("watchlist"))
      : [],
  };

  //use reduce para agregar a favorito peliculas
  const [state, dispatch] = useReducer(FavReducer, initialState);
  console.log(state);
  useEffect(() => {
    getFilms();
    getPopularTv();
    getPopularPeople();
    localStorage.setItem("watchlist", JSON.stringify(state.watchlist));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination, state]);

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
  //obteniendo personas populares
  const getPopularPeople = async () => {
    await fetch(
      `${baseUrl}person/popular?api_key=${apiKey}&language=es&page=${pagination}`
    )
      .then((response) => response.json())
      .then((data) => setPopularPeople(data.results));
  };

  //funcion para buscar peliculas
  function searchMovies(e) {
    e.preventDefault();
    getFilms(searchKey);
    getPopularTv(searchKey);
  }

  //AGREGANDO FAVORITE LIST CON USE REDUCE
  const addMovieToWatchlist = (movie) => {
    dispatch({ type: "ADD_MOVIE_TO_WATCHLIST", payload: movie });
  };
  const removeMovieToWatchList = (id) => {
    dispatch({ type: "REMOVE_MOVIE_TO_WATCHLIST", payload: id });
  };
  const removeAllMoviesInWatchlist = (id) => {
    dispatch({ type: "REMOVE_ALL_MOVIES_IN_WATCHLIST" });
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
        apiKey,
        baseUrl,
        popularPeople,
        watchlist: state.watchlist,
        addMovieToWatchlist,
        removeMovieToWatchList,
        removeAllMoviesInWatchlist,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
