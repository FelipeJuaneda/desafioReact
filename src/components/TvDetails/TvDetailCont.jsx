import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import TvDetail from "./TvDetail";
import pororoLoad from "../images/pororoLoad.gif";

const TvDetailCont = () => {
  const { tvPopularList, apiKey, baseUrl } = useAppContext();
  //parametro id de la pelicula para url
  const { tvId } = useParams();
  //seteo las peliculas encontradas con el mismo id que el parametro
  const [tvShowState, setTvShowState] = useState({});
  //mas detalles de serie seleccionada
  const [tvDetail, setTvDetail] = useState([]);
  //elenco de serie
  const [tvCredits, setTvCredits] = useState();
  //aca guardo los videos/trailer de las pelis
  const [videosTv, setVideosTv] = useState([]);
  useEffect(() => {
    //detalle de serie
    const getTvDetail = async () => {
      await fetch(`${baseUrl}tv/${tvId}?api_key=${apiKey}&language=es`)
        .then((result) => result.json())
        .then((data) => setTvDetail(data));
    };
    getTvDetail();
    //creditos de la serie
    const getTvCredit = async () => {
      await fetch(`${baseUrl}tv/${tvId}/credits?api_key=${apiKey}&language=es`)
        .then((response) => response.json())
        .then((data) => setTvCredits(data));
    };
    getTvCredit();
    //video / trailer de serie
    const getTvVideos = () => {
      fetch(`${baseUrl}tv/${tvId}/videos?api_key=${apiKey}&language=es`)
        .then((response) => response.json())
        .then((data) => {
          setVideosTv(data.results);
        });
    };
    getTvVideos();
    // eslint-disable-next-line eqeqeq
    setTvShowState(
      // eslint-disable-next-line eqeqeq
      tvPopularList ? tvPopularList.find((m) => m.id == tvId) : null
    );
  }, [apiKey, baseUrl, tvId, tvPopularList]);

  return (
    <div>
      {tvShowState ? (
        <TvDetail
          tvShowState={tvShowState}
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
