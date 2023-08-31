import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppContext } from "../../contexts/AppContext";
import TvDetail from "./TvDetail";
import pororoLoad from "../../images/pororoLoad.gif";
import { useFavoriteContext } from "../../contexts/FavoriteContext";
import { animateScroll as scroll } from "react-scroll";

const TvDetailCont = () => {
  const { tvPopularList, apiKey, baseUrl } = useAppContext();
  const { favoritetv } = useFavoriteContext();

  //parametro id de la serie para url
  const { tvId } = useParams();
  //seteo la serie encontradas con el mismo id que el parametro
  const [tvShowState, setTvShowState] = useState([]);
  //mas detalles de serie seleccionada
  const [tvDetail, setTvDetail] = useState([]);
  //elenco de serie
  const [tvCredits, setTvCredits] = useState([]);
  //aca guardo los videos/trailer de las series
  const [videosTv, setVideosTv] = useState([]);

  useEffect(() => {
    scroll.scrollToTop();

    //detalle de serie
    const getTvDetail = async () => {
      try {
        const dataTvDetail = await fetch(
          `${baseUrl}tv/${tvId}?api_key=${apiKey}&language=es`
        );
        const dataJsonTvDetail = await dataTvDetail.json();
        setTvDetail(dataJsonTvDetail);
      } catch (error) {
        console.log(error);
      }
    };
    getTvDetail();
    //creditos de la serie
    const getTvCredit = async () => {
      try {
        const dataTvCredit = await fetch(
          `${baseUrl}tv/${tvId}/credits?api_key=${apiKey}&language=es`
        );
        const dataJsonTvCredit = await dataTvCredit.json();
        setTvCredits(dataJsonTvCredit.cast);
      } catch (error) {
        console.log(error);
      }
    };
    getTvCredit();
    //video / trailer de serie
    const getTvVideos = async () => {
      try {
        const dataTvVideos = await fetch(
          `${baseUrl}tv/${tvId}/videos?api_key=${apiKey}&language=es`
        );
        const dataJsonTvVideos = await dataTvVideos.json();
        setVideosTv(dataJsonTvVideos.results);
      } catch (error) {
        console.log(error);
      }
    };
    getTvVideos();
    setTvShowState(
      tvPopularList.find((m) => m.id === parseInt(tvId)) ||
        favoritetv.find((m) => m.id === parseInt(tvId)) ||
        true
    );
  }, [apiKey, baseUrl, tvId, tvPopularList, favoritetv]);

  return (
    <div>
      {tvShowState ? (
        <TvDetail
          details={tvDetail}
          tvCredits={tvCredits}
          videosTv={videosTv}
        />
      ) : (
        <div className="flex justify-center">
          <img src={pororoLoad} alt="Pochoclo cargando" />
        </div>
      )}
    </div>
  );
};

export default TvDetailCont;
