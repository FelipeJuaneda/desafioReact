import AppContextProvider from "./components/contexts/AppContext";
import { Routes, Route } from "react-router-dom";
import LayoutRouter from "./components/LayoutRouter/LayoutRouter";
import FilmDetailCont from "./components/FilmsDetails/FilmDetailCont";
import PopularMovies from "./components/PopularMovies/PopularMovies";
import PopularTv from "./components/PopularTv/PopularTv";
import TvDetailCont from "./components/TvDetails/TvDetailCont";
import PageNotFound from "./components/PageNotFound/PageNotFound";
import PopularPeople from "./components/PopularPeople/PopularPeople";
import FavoriteList from "./components/FavoriteList/FavoriteList";
import GenreList from "./components/GenreList/GenreList";

function App() {
  return (
    <AppContextProvider>
      <div className="App">
        {/* para los detalles de las peliculas se uso react-router-dom */}
        <Routes>
          <Route path="/" element={<LayoutRouter />}>
            <Route path="/popularFilms" element={<PopularMovies />} />
            <Route path="/popularTv" element={<PopularTv />} />
            <Route path="/popularPeople" element={<PopularPeople />} />
            <Route path="/favoriteList" element={<FavoriteList />} />
            <Route path="film/:filmId" element={<FilmDetailCont />} />
            <Route path="genre/:genreId" element={<GenreList />} />
            <Route path="tvShow/:tvId" element={<TvDetailCont />} />
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </div>
    </AppContextProvider>
  );
}

export default App;
