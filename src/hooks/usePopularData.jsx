import { useEffect, useState } from "react";

const usePopularData = (typePopular, pagination) => {
  const [data, setData] = useState([]);
  console.log(data);
  const apiKey = "2b935647da58bcc58e034d8d53657003";
  const baseUrl = "https://api.themoviedb.org/3/";

  const [loading, setLoading] = useState(true);

  const getPopularData = async (searchKey) => {
    const type = searchKey ? "search" : "discover";
    try {
      const dataFetch = await fetch(
        `${baseUrl}${
          typePopular === "person/popular" ? "" : type
        }/${typePopular}?api_key=${apiKey}&language=es&query=${searchKey}&page=${pagination}`
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
  }, [typePopular, pagination]);
  return { data, loading, getPopularData };
};

export default usePopularData;
