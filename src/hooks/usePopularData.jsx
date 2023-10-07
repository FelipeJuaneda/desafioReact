import { useEffect, useState } from "react";
import Loading from "../components/Loading/Loading";

const usePopularData = (typePopular) => {
  const [data, setData] = useState([]);

  const apiKey = "2b935647da58bcc58e034d8d53657003";
  const baseUrl = "https://api.themoviedb.org/3/";

  const [loading, setLoading] = useState(true);

  const getPopularData = async (searchKey) => {
    const type = searchKey ? "search" : "discover";
    try {
      const dataFetch = await fetch(
        `${baseUrl}${type}/${typePopular}?api_key=${apiKey}&language=es&query=${searchKey}`
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
