import { useEffect, useState } from "react";
import { baseUrl, apiKey } from "../utils/config";
import type { TmdbPage } from "../types/tmdb";

const usePopularData = <T>(typePopular: string, currentPage: number) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const getPopularData = async (searchKey?: string) => {
    const type = searchKey ? "search" : "discover";
    const path =
      typePopular === "person/popular" ? typePopular : `${type}/${typePopular}`;
    const query = searchKey ? `&query=${encodeURIComponent(searchKey)}` : "";
    try {
      const dataFetch = await fetch(
        `${baseUrl}${path}?api_key=${apiKey}&language=es${query}&page=${currentPage}`
      );
      const dataJson = (await dataFetch.json()) as Partial<TmdbPage<T>>;
      setData(dataJson.results ?? []);
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
