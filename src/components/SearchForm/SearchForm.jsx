import React from "react";
import { useAppContext } from "../../contexts/AppContext";
import useSearch from "../../hooks/useSearch";

const SearchForm = ({ getPopularData }) => {
  const { setStartsList } = useAppContext();
  const { searchKey, setSearchKey } = useSearch();

  const handleSubmit = (e) => {
    e.preventDefault();
    getPopularData(searchKey);
  };
  const handleChange = (e) => {
    setSearchKey(e.target.value);
    setStartsList(undefined);
  };

  return (
    <form onSubmit={handleSubmit} className="d-flex">
      <input
        onChange={handleChange}
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

export default React.memo(SearchForm);
