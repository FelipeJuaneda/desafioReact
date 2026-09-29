import { useQuery } from "@tanstack/react-query";
import { titleCreditsQuery, titleDetailQuery, titleVideosQuery } from "@/services/tmdb/queries";
import type { MediaType } from "@/types/tmdb";

interface UseDetailParams {
  detailId: string | undefined;
  type: MediaType;
}

const useDetail = ({ detailId = "", type }: UseDetailParams) => {
  const enabled = detailId !== "";
  const detail = useQuery({ ...titleDetailQuery(type, detailId), enabled });
  const credits = useQuery({ ...titleCreditsQuery(type, detailId), enabled });
  const videos = useQuery({ ...titleVideosQuery(type, detailId), enabled });

  return {
    dataDetail: detail.data ?? null,
    dataCredits: credits.data ?? null,
    dataVideos: videos.data ?? null,
    loading: detail.isPending,
  };
};

export default useDetail;
