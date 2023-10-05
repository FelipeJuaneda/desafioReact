import { useState } from "react";
import usePopularData from "./usePopularData";

const useSearch = () => {
  const [searchKey, setSearchKey] = useState("");
  //   const { getPopularData } = usePopularData();
  const searchMovies = (e) => {
    e.preventDefault();
    // getPopularData(searchKey);
  };

  return { searchKey, setSearchKey, searchMovies };
};

export default useSearch;
