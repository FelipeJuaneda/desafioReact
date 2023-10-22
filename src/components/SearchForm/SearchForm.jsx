import React, { useState } from "react";

const SearchForm = ({ getPopularData }) => {
  const [searchKey, setSearchKey] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    getPopularData(searchKey);
  };
  const handleChange = (e) => {
    setSearchKey(e.target.value);
  };

  return (
    <form className="relative text-gray-600" onSubmit={handleSubmit}>
      <input
        className="h-10 px-5 pr-16 text-sm bg-white border-2 border-gray-300 rounded-lg focus:outline-none"
        type="search"
        name="search"
        placeholder="Search"
        value={searchKey}
        onChange={handleChange}
      />
      <button type="submit" className={`absolute top-0 right-0 bottom-0 mr-3`}>
        <i className="ri-search-line" />
      </button>
    </form>
  );
};

export default React.memo(SearchForm);
