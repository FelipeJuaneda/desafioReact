import { useEffect, useState } from "react";
import { baseUrl, apiKey } from "../utils/config";

const useDetail = ({ detailId, type }) => {
  const [data, setData] = useState({
    dataDetail: [],
    dataCredits: [],
    dataVideos: [],
  });
  console.log(data);
  const [loading, setLoading] = useState(true);

  const fetchData = async (url, key) => {
    try {
      const response = await fetch(url);
      const data = await response.json();
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
