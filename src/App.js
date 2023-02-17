import AppContextProvider from "./contexts/AppContext";
import { Routes, Route, useLocation } from "react-router-dom";
import FilmDetailCont from "./components/FilmsDetails/FilmDetailCont";
import PopularMovies from "./components/PopularMovies/PopularMovies";
import PopularTv from "./components/PopularTv/PopularTv";
import TvDetailCont from "./components/TvDetails/TvDetailCont";
import PageNotFound from "./components/PageNotFound/PageNotFound";
import PopularPeople from "./components/PopularPeople/PopularPeople";
import FavoriteList from "./components/FavoriteList/FavoriteList";
import GenreList from "./components/GenreList/GenreList";
import FavoriteContextProvider from "./contexts/FavoriteContext";
import Login from "./components/RegisterLogin/Login/Login";
import AuthProvider from "./contexts/AuthContext";
import Register from "./components/RegisterLogin/Register/Register";
import Home from "./components/Home/Home";
import ProtectedRoute from "./components/RegisterLogin/ProtectedRoute";
import RecoverPassword from "./components/RegisterLogin/RecoverPassword/RecoverPassword";
import Header from "./components/Header/Header";

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
                  <>
                    <ProtectedRoute>
                      <Home />
                    </ProtectedRoute>
                  </>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/recoverPassword" element={<RecoverPassword />} />
              <Route
                path="/popularFilms"
                element={
                  <>
                    <PopularMovies />
                  </>
                }
              />
              <Route path="/popularTv" element={<PopularTv />} />
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
