import { useEffect, useState } from "react";
import useSearch from "./useSearch";

const usePopularData = (typePopular) => {
  const apiKey = "2b935647da58bcc58e034d8d53657003";
  const baseUrl = "https://api.themoviedb.org/3/";

  const [data, setData] = useState([]);
  console.log(data);
  const [loading, setLoading] = useState(true);

  const getPopularData = async (searchKey) => {
    try {
      const dataFetch = await fetch(
        `${baseUrl}discover/${typePopular}?api_key=${apiKey}&language=es&query=${searchKey}`
      );
      const dataJson = await dataFetch.json();
      setData(dataJson.results);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  useEffect(() => {
    getPopularData();
  }, [typePopular]);
  return { data, loading, getPopularData };
};

export default usePopularData;
