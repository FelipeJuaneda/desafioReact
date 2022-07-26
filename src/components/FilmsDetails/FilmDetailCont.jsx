import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import FilmDetail from "./FilmDetail";
import pororoLoad from "../images/pororoLoad.gif";

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
  //aca guardo los videos/trailer de las pelis
  const [videosFilm, setVideosFilm] = useState([]);

  useEffect(() => {
    getFilmDetail();
    getFilmCredit();
    getMovieVideos();
    // eslint-disable-next-line eqeqeq
    setFilm(moviesList ? moviesList.find((m) => m.id == filmId) : null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filmId, moviesList]);

  //detalle de pelicula
  const getFilmDetail = async () => {
    await fetch(`${baseUrl}movie/${filmId}?api_key=${apiKey}&language=es`)
      .then((response) => response.json())
      .then((data) => setFilmDetail(data));
  };
  //creditos de la pelicula
  const getFilmCredit = async () => {
    await fetch(
      `${baseUrl}movie/${filmId}/credits?api_key=${apiKey}&language=es`
    )
      .then((response) => response.json())
      .then((data) => setFilmCredits(data));
  };
  //video / trailer de pelicula
  const getMovieVideos = () => {
    fetch(`${baseUrl}movie/${filmId}/videos?api_key=${apiKey}&language=es`)
      .then((response) => response.json())
      .then((data) => {
        setVideosFilm(data.results);
      });
  };

  return (
    <div>
      {film ? (
        <FilmDetail
          film={film}
          details={filmDetail}
          filmCredits={filmCredits}
          videosFilm={videosFilm}
        />
      ) : (
        <div className="flex justify-center">
          <img src={pororoLoad} alt="Pochoclo cargando" />
        </div>
      )}
    </div>
  );
};

export default FilmDetailCont;
