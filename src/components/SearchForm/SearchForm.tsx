import React, { useState, type ChangeEvent, type FormEvent } from "react";

interface SearchFormProps {
  getPopularData: (searchKey?: string) => void;
  typeName: string;
}

const SearchForm = ({ getPopularData, typeName }: SearchFormProps) => {
  const [searchKey, setSearchKey] = useState("");
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    getPopularData(searchKey);
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchKey(e.target.value);
  };

  return (
    <form className="relative w-80 text-gray-600 550:w-full 768:w-60" onSubmit={handleSubmit}>
      <input
        className="h-10 w-full rounded-lg border-2 border-gray-300 bg-white px-5 py-5 pr-8 text-lg focus:outline-none"
        type="search"
        name="search"
        placeholder={`Buscar ${typeName}`}
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
