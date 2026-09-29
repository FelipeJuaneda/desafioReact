import { useEffect, useState } from "react";
import { tmdbFetch } from "@/services/tmdb/client";
import type { Credits, MediaType, TitleDetail, Videos } from "@/types/tmdb";

interface DetailData {
  dataDetail: TitleDetail | null;
  dataCredits: Credits | null;
  dataVideos: Videos | null;
}

interface UseDetailParams {
  detailId: string | undefined;
  type: MediaType;
}

const useDetail = ({ detailId, type }: UseDetailParams) => {
  const [data, setData] = useState<DetailData>({
    dataDetail: null,
    dataCredits: null,
    dataVideos: null,
  });
  const [loading, setLoading] = useState(true);

  const fetchData = async <K extends keyof DetailData>(path: string, key: K) => {
    try {
      const data = await tmdbFetch<DetailData[K]>(path);
      setData((prevData) => ({
        ...prevData,
        [key]: data,
      }));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(`${type}/${detailId}`, "dataDetail");
    fetchData(`${type}/${detailId}/credits`, "dataCredits");
    fetchData(`${type}/${detailId}/videos`, "dataVideos");
  }, [detailId, type]);

  return { ...data, loading };
};

export default useDetail;
