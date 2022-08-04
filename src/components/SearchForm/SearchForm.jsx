import React from "react";
import { useAppContext } from "../contexts/AppContext";

const SearchForm = () => {
  const { searchMovies, setSearchKey, setStartsList, searchKey } =
    useAppContext();
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
        value={searchKey}
      />
      <button className="btn btn-outline-success" type="submit">
        Buscar
      </button>
    </form>
  );
};

export default SearchForm;
