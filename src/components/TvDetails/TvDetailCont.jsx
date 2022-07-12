import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import TvDetail from "./TvDetail";

const TvDetailCont = () => {
  //parametro id de la pelicula para url
  const { tvId } = useParams();
  //seteo las peliculas encontradas con el mismo id que el parametro
  const [tvShowState, setTvShowState] = useState({});
  const { tvPopularList } = useAppContext();

  //lo pongo en un useEffect para generar un re render
  useEffect(() => {
    // eslint-disable-next-line eqeqeq
    setTvShowState(
      // eslint-disable-next-line eqeqeq
      tvPopularList ? tvPopularList.find((m) => m.id == tvId) : null
    );
  }, [tvId, tvPopularList]);

  return (
    <div>
      {tvShowState ? (
        <TvDetail tvShowState={tvShowState} />
      ) : (
        <p>Cargando...</p>
      )}
    </div>
  );
};

export default TvDetailCont;
