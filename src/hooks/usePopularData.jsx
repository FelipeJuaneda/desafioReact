import { useEffect, useState } from "react";
import { baseUrl, apiKey } from "../utils/config";

const usePopularData = (typePopular, currentPage) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const getPopularData = async (searchKey) => {
    const type = searchKey ? "search" : "discover";
    try {
      const dataFetch = await fetch(
        `${baseUrl}${
          typePopular === "person/popular" ? "" : type
        }/${typePopular}?api_key=${apiKey}&language=es&query=${searchKey}&page=${currentPage}`
      );
      const dataJson = await dataFetch.json();
      setData(dataJson.results);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getPopularData();
  }, [typePopular, currentPage]);
  return { data, loading, getPopularData };
};

export default usePopularData;
