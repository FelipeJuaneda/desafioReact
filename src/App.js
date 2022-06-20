import AppContextProvider from "./components/contexts/AppContext";
import Header from "./components/Header/Header";
import PopularMovies from "./components/PopularMovies/PupularMovies";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import FilmDetailCont from "./components/FilmsDetails/FilmDetailCont";

function App() {
  return (
    <AppContextProvider>
      <div className="App">
        {/* para los detalles de las peliculas se uso react-router-dom */}
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<PopularMovies />} />
            <Route path="film/:filmId" element={<FilmDetailCont />} />
          </Routes>
        </BrowserRouter>
      </div>
    </AppContextProvider>
  );
}

export default App;
