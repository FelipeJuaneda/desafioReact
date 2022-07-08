import AppContextProvider from "./components/contexts/AppContext";
import { Routes, Route } from "react-router-dom";
import LayoutRouter from "./components/LayoutRouter/LayoutRouter";
import FilmDetailCont from "./components/FilmsDetails/FilmDetailCont";

function App() {
  return (
    <AppContextProvider>
      <div className="App">
        {/* para los detalles de las peliculas se uso react-router-dom */}
        <Routes>
          <Route path="/" element={<LayoutRouter />}>
            <Route path="film/:filmId" element={<FilmDetailCont />} />
          </Route>
        </Routes>
      </div>
    </AppContextProvider>
  );
}

export default App;
