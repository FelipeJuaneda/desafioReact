import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import TvDetail from "./TvDetail";

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

  useEffect(() => {
    getTvDetail();
    getTvCredit();
    // eslint-disable-next-line eqeqeq
    setTvShowState(
      // eslint-disable-next-line eqeqeq
      tvPopularList ? tvPopularList.find((m) => m.id == tvId) : null
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tvId, tvPopularList]);

  const getTvDetail = async () => {
    await fetch(`${baseUrl}tv/${tvId}?api_key=${apiKey}&language=es`)
      .then((result) => result.json())
      .then((data) => setTvDetail(data));
  };

  const getTvCredit = async () => {
    await fetch(`${baseUrl}tv/${tvId}/credits?api_key=${apiKey}&language=es`)
      .then((response) => response.json())
      .then((data) => setTvCredits(data));
  };

  return (
    <div>
      {tvShowState ? (
        <TvDetail
          tvShowState={tvShowState}
          details={tvDetail}
          tvCredits={tvCredits}
        />
      ) : (
        <p>Cargando...</p>
      )}
    </div>
  );
};

export default TvDetailCont;
