import { useParams } from "react-router-dom";
import useDetail from "../../hooks/useDetail";
import Detail from "./Detail";
import Loading from "../../components/Loading/Loading";

const DetailCont = ({ type }) => {
  const { detailId } = useParams();
  const { dataDetail, dataCredits, dataVideos, loading } = useDetail({
    detailId,
    type,
  });

  if (loading) {
    return <Loading />;
  }
  return (
    <Detail
      dataDetail={dataDetail}
      dataCredits={dataCredits}
      dataVideos={dataVideos}
    />
  );
};

export default DetailCont;
