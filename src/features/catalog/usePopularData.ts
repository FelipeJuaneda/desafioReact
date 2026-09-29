import { useEffect, useState } from "react";
import { tmdbFetch } from "@/services/tmdb/client";
import type { TmdbPage } from "@/types/tmdb";

const usePopularData = <T>(typePopular: string, currentPage: number) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const getPopularData = async (searchKey?: string) => {
    const type = searchKey ? "search" : "discover";
    const path = typePopular === "person/popular" ? typePopular : `${type}/${typePopular}`;
    try {
      const dataJson = await tmdbFetch<Partial<TmdbPage<T>>>(path, {
        query: searchKey,
        page: currentPage,
      });
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
