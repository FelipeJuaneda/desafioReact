import { Routes, Route, useLocation } from "react-router-dom";
import AuthProvider from "./contexts/AuthContext";
import AppContextProvider from "./contexts/AppContext";
import FavoriteContextProvider from "./contexts/FavoriteContext";
import Header from "./Layouts/Header/Header";
import ProtectedRoute from "./Pages/RegisterLogin/ProtectedRoute";
import Login from "./Pages/RegisterLogin/Login/Login";
import RecoverPassword from "./Pages/RegisterLogin/RecoverPassword/RecoverPassword";
import Register from "./Pages/RegisterLogin/Register/Register";
import Home from "./Pages/Home/Home";
import PopularTv from "./Pages/PopularTv/PopularTv";
import PopularPeople from "./Pages/PopularPeople/PopularPeople";
import FavoriteList from "./Pages/FavoriteList/FavoriteList";
import FilmDetailCont from "./Pages/FilmsDetails/FilmDetailCont";
import TvDetailCont from "./Pages/TvDetails/TvDetailCont";
import GenreList from "./Pages/GenreList/GenreList";
import PageNotFound from "./Pages/PageNotFound/PageNotFound";
import PopularMovies from "./Pages/PopularMovies/PopularMovies";

function App() {
  let location = useLocation();
  return (
    <AuthProvider>
      <AppContextProvider>
        <FavoriteContextProvider>
          <div className="App">
            {location.pathname !== "/" && <Header />}
            <Routes>
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/recoverPassword" element={<RecoverPassword />} />
              <Route
                path="/popularFilms"
                element={
                  <PopularMovies
                    typePopular="movie"
                    title="Peliculas Populares"
                    to="film"
                  />
                }
              />
              <Route
                path="/popularTv"
                element={
                  <PopularMovies
                    typePopular="tv"
                    title="Series Populares"
                    to="tvShow"
                  />
                }
              />
              <Route path="/popularPeople" element={<PopularPeople />} />
              <Route
                path="/favoriteList"
                element={
                  <>
                    <ProtectedRoute>
                      <FavoriteList />
                    </ProtectedRoute>
                  </>
                }
              />
              <Route path="film/:filmId" element={<FilmDetailCont />} />
              <Route path="tvShow/:tvId" element={<TvDetailCont />} />
              <Route path="genre/:genreId" element={<GenreList />} />
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </div>
        </FavoriteContextProvider>
      </AppContextProvider>
    </AuthProvider>
  );
}

export default App;
