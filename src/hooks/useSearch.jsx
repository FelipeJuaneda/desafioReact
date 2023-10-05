import { useState } from "react";

const useSearch = () => {
  const [searchKey, setSearchKey] = useState("");

  return { searchKey, setSearchKey };
};

export default useSearch;
