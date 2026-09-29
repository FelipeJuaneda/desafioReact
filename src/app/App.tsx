import { Routes, Route, useLocation } from "react-router";
import AuthProvider from "@/features/auth/AuthProvider";
import FavoriteContextProvider from "@/features/favorites/FavoritesProvider";
import Header from "@/layouts/Header";
import ProtectedRoute from "@/features/auth/ProtectedRoute";
import Login from "@/routes/auth/LoginPage";
import RecoverPassword from "@/routes/auth/RecoverPasswordPage";
import Register from "@/routes/auth/RegisterPage";
import Home from "@/routes/home/HomePage";
import PopularPeople from "@/routes/people/PopularPeoplePage";
import FavoriteList from "@/routes/my-list/FavoritesPage";
import GenreList from "@/routes/genre/GenrePage";
import PageNotFound from "@/routes/not-found/NotFoundPage";
import Popular from "@/routes/catalog/PopularPage";
import DetailCont from "@/routes/title/TitlePage";

function App() {
  const location = useLocation();
  return (
    <AuthProvider>
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
                <Popular
                  typeData="movie"
                  typeName="Peliculas"
                  title="Peliculas Populares"
                  to="film"
                />
              }
            />
            <Route
              path="/popularTv"
              element={
                <Popular typeData="tv" typeName="Series" title="Series Populares" to="tvShow" />
              }
            />
            <Route path="/popularPeople" element={<PopularPeople typePopular="person/popular" />} />
            <Route
              path="/favoriteList"
              element={
                <ProtectedRoute>
                  <FavoriteList />
                </ProtectedRoute>
              }
            />

            <Route path="film/:detailId" element={<DetailCont type="movie" />} />
            <Route path="tvShow/:detailId" element={<DetailCont type="tv" />} />
            <Route path="genre/:genreId" element={<GenreList />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </div>
      </FavoriteContextProvider>
    </AuthProvider>
  );
}

export default App;
