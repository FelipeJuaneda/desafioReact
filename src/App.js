import { Routes, Route, useLocation } from "react-router-dom";
import AuthProvider from "./contexts/AuthContext";
import FavoriteContextProvider from "./contexts/FavoriteContext";
import Header from "./Layouts/Header/Header";
import ProtectedRoute from "./Pages/RegisterLogin/ProtectedRoute";
import Login from "./Pages/RegisterLogin/Login/Login";
import RecoverPassword from "./Pages/RegisterLogin/RecoverPassword/RecoverPassword";
import Register from "./Pages/RegisterLogin/Register/Register";
import Home from "./Pages/Home/Home";
import PopularPeople from "./Pages/PopularPeople/PopularPeople";
import FavoriteList from "./Pages/FavoriteList/FavoriteList";
import GenreList from "./Pages/GenreList/GenreList";
import PageNotFound from "./Pages/PageNotFound/PageNotFound";
import Popular from "./Pages/Popular/Popular";
import DetailCont from "./Pages/Detail/DetailContainer";

function App() {
  let location = useLocation();
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
                <Popular
                  typeData="tv"
                  typeName="Series"
                  title="Series Populares"
                  to="tvShow"
                />
              }
            />
            <Route
              path="/popularPeople"
              element={<PopularPeople typePopular="person/popular" />}
            />
            <Route
              path="/favoriteList"
              element={
                <ProtectedRoute>
                  <FavoriteList />
                </ProtectedRoute>
              }
            />

            <Route
              path="film/:detailId"
              element={<DetailCont type="movie" />}
            />
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
