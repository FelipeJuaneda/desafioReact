import React from "react";
import { useAppContext } from "../contexts/AppContext";

const SearchMoviesForm = () => {
  const { searchMovies, setSearchKey, setStartsList } = useAppContext();
  return (
    <form onSubmit={searchMovies} className="d-flex">
      <input
        onChange={(e) => {
          setSearchKey(e.target.value);
          setStartsList(undefined);
        }}
        className="form-control me-2"
        type="search"
        placeholder="Buscar"
        aria-label="Search"
      />
      <button className="btn btn-outline-success" type="submit">
        Buscar
      </button>
    </form>
  );
};

export default SearchMoviesForm;
