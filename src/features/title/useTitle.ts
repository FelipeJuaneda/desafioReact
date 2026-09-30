import { useQuery } from "@tanstack/react-query";
import { TmdbError } from "@/services/tmdb/client";
import { titleCreditsQuery, titleDetailQuery, titleVideosQuery } from "@/services/tmdb/queries";
import { rankVideos } from "@/features/title/videos";
import type { MediaType } from "@/types/tmdb";

export { pickTrailer } from "@/features/title/videos";

/** Everything the title page shows. Credits and videos load in parallel and never block it. */
export const useTitle = (type: MediaType, id: string) => {
  const detail = useQuery(titleDetailQuery(type, id));
  const credits = useQuery(titleCreditsQuery(type, id));
  const videos = useQuery(titleVideosQuery(type, id));

  return {
    detail,
    credits: credits.data,
    // YouTube only, Latin Spanish first (see videos.ts).
    videos: rankVideos(videos.data?.results ?? []),
    notFound: detail.error instanceof TmdbError && detail.error.status === 404,
  };
};
