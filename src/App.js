import "./App.css";
import AppContextProvider from "./components/contexts/AppContext";
import Header from "./components/Header/Header";
import PopularMovies from "./components/PopularMovies/PupularMovies";

function App() {
  return (
    <AppContextProvider>
      <div className="App">
        <Header />
        <PopularMovies />
      </div>
    </AppContextProvider>
  );
}

export default App;
