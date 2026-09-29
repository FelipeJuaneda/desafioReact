import { useParams } from "react-router";
import useDetail from "@/features/title/useDetail";
import Detail from "@/features/title/Detail";
import Loading from "@/components/ui/Loading";
import type { MediaType } from "@/types/tmdb";

const DetailContainer = ({ type }: { type: MediaType }) => {
  const { detailId } = useParams();
  const { dataDetail, dataCredits, dataVideos, loading } = useDetail({
    detailId,
    type,
  });

  if (loading || !dataDetail) return <Loading />;

  return (
    <Detail type={type} dataDetail={dataDetail} dataCredits={dataCredits} dataVideos={dataVideos} />
  );
};

export default DetailContainer;
