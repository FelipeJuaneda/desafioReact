import { useEffect, useState } from "react";
import { baseUrl, apiKey } from "../utils/config";
const useDetail = ({ detailId, type }) => {
  // const [data, setData] = useState()
  const [dataDetail, setDataDetail] = useState();
  const [dataCredits, setDataCredits] = useState();
  const [dataVideos, setDataVideos] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    //detalle de pelicula
    const getFilmDetail = async () => {
      try {
        const dataFilmDetail = await fetch(
          `${baseUrl}${type}/${detailId}?api_key=${apiKey}&language=es`
        );
        const dataFilmDetailJson = await dataFilmDetail.json();
        setDataDetail(dataFilmDetailJson);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getFilmDetail();
    //creditos de la pelicula
    const getFilmCredit = async () => {
      try {
        const dataFilmCredit = await fetch(
          `${baseUrl}${type}/${detailId}/credits?api_key=${apiKey}&language=es`
        );
        const dataFilmCreditJson = await dataFilmCredit.json();
        setDataCredits(dataFilmCreditJson.cast);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getFilmCredit();
    //video / trailer de pelicula
    const getMovieVideos = async () => {
      try {
        const dataMovieVideos = await fetch(
          `${baseUrl}${type}/${detailId}/videos?api_key=${apiKey}&language=es`
        );
        const dataMovieVideosJson = await dataMovieVideos.json();
        setDataVideos(dataMovieVideosJson.results);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getMovieVideos();
    // setData(
    //   moviesList.find((m) => m.id === parseInt(detailId)) ||
    //     favoritemovie.find((f) => f.id === parseInt(detailId)) ||
    //     true
    // );
  }, [apiKey, baseUrl, detailId, type]);

  return { dataDetail, dataCredits, dataVideos, loading };
};

export default useDetail;
