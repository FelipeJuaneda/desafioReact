import { useQuery } from "@tanstack/react-query";
import { TmdbError } from "@/services/tmdb/client";
import { titleCreditsQuery, titleDetailQuery, titleVideosQuery } from "@/services/tmdb/queries";
import type { MediaType, Video } from "@/types/tmdb";

/** Everything the title page shows. Credits and videos load in parallel and never block it. */
export const useTitle = (type: MediaType, id: string) => {
  const detail = useQuery(titleDetailQuery(type, id));
  const credits = useQuery(titleCreditsQuery(type, id));
  const videos = useQuery(titleVideosQuery(type, id));

  return {
    detail,
    credits: credits.data,
    videos: (videos.data?.results ?? []).filter(isYouTube),
    notFound: detail.error instanceof TmdbError && detail.error.status === 404,
  };
};

const isYouTube = (video: Video) => video.site === "YouTube";

/** The official trailer if there is one, otherwise the first YouTube video. */
export const pickTrailer = (videos: Video[]) =>
  videos.find((video) => video.type === "Trailer") ?? videos[0];
