import { useEffect, useState } from "react";
import { baseUrl, apiKey } from "@/services/tmdb/config";
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

  const fetchData = async <K extends keyof DetailData>(url: string, key: K) => {
    try {
      const response = await fetch(url);
      const data = (await response.json()) as DetailData[K];
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
    const detailUrl = `${baseUrl}${type}/${detailId}?api_key=${apiKey}&language=es`;
    const creditsUrl = `${baseUrl}${type}/${detailId}/credits?api_key=${apiKey}&language=es`;
    const videosUrl = `${baseUrl}${type}/${detailId}/videos?api_key=${apiKey}&language=es`;

    fetchData(detailUrl, "dataDetail");
    fetchData(creditsUrl, "dataCredits");
    fetchData(videosUrl, "dataVideos");
  }, [detailId, type]);

  return { ...data, loading };
};

export default useDetail;
