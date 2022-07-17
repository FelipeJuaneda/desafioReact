import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import FilmDetail from "./FilmDetail";

const FilmDetailCont = () => {
  const { moviesList, apiKey, baseUrl } = useAppContext();
  //parametro id de la pelicula para url
  const { filmId } = useParams();
  //seteo las peliculas encontradas con el mismo id que el parametro
  const [film, setFilm] = useState({});
  //mas detalles de pelicula seleccionada
  const [filmDetail, setFilmDetail] = useState([]);
  //elenco de la pelicula
  const [filmCredits, setFilmCredits] = useState();

  useEffect(() => {
    getFilmDetail();
    getFilmCredit();
    // eslint-disable-next-line eqeqeq
    setFilm(moviesList ? moviesList.find((m) => m.id == filmId) : null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filmId, moviesList]);

  const getFilmDetail = async () => {
    await fetch(`${baseUrl}movie/${filmId}?api_key=${apiKey}&language=es`)
      .then((response) => response.json())
      .then((data) => setFilmDetail(data));
  };
  const getFilmCredit = async () => {
    await fetch(
      `${baseUrl}movie/${filmId}/credits?api_key=${apiKey}&language=es`
    )
      .then((response) => response.json())
      .then((data) => setFilmCredits(data));
  };

  return (
    <div>
      {film ? (
        <FilmDetail
          film={film}
          details={filmDetail}
          filmCredits={filmCredits}
        />
      ) : (
        <p>Cargando...</p>
      )}
    </div>
  );
};

export default FilmDetailCont;
