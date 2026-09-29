import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { listQuery } from "@/services/tmdb/queries";

const usePopularData = <T>(typePopular: string, currentPage: number) => {
  const [searchKey, setSearchKey] = useState("");
  const type = searchKey ? "search" : "discover";
  const path = typePopular === "person/popular" ? typePopular : `${type}/${typePopular}`;

  const { data, isPending } = useQuery({
    ...listQuery<T>(path, { page: currentPage, query: searchKey || undefined }),
    // Keep showing the current page while the next one loads.
    placeholderData: keepPreviousData,
  });

  return {
    data: data?.results ?? [],
    loading: isPending,
    getPopularData: (key?: string) => setSearchKey(key?.trim() ?? ""),
  };
};

export default usePopularData;
