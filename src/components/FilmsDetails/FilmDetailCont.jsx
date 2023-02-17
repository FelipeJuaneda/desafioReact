import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppContext } from "../../contexts/AppContext";
import FilmDetail from "./FilmDetail";
import pororoLoad from "../images/pororoLoad.gif";
import { useFavoriteContext } from "../../contexts/FavoriteContext";
import { animateScroll as scroll } from "react-scroll";

const FilmDetailCont = () => {
  const { moviesList, apiKey, baseUrl } = useAppContext();
  const { favoritemovie } = useFavoriteContext();

  //parametro id de la pelicula para url
  const { filmId } = useParams();
  //seteo la pelicula encontrada con el mismo id que el parametro
  const [film, setFilm] = useState([]);
  //mas detalles de pelicula seleccionada
  const [filmDetail, setFilmDetail] = useState([]);
  //elenco de la pelicula
  const [filmCredits, setFilmCredits] = useState([]);
  //aca guardo los videos/trailer de las pelis
  const [videosFilm, setVideosFilm] = useState([]);

  useEffect(() => {
    scroll.scrollToTop();

    //detalle de pelicula
    const getFilmDetail = async () => {
      try {
        const dataFilmDetail = await fetch(
          `${baseUrl}movie/${filmId}?api_key=${apiKey}&language=es`
        );
        const dataFilmDetailJson = await dataFilmDetail.json();
        setFilmDetail(dataFilmDetailJson);
      } catch (error) {
        console.log(error);
      }
    };
    getFilmDetail();
    //creditos de la pelicula
    const getFilmCredit = async () => {
      try {
        const dataFilmCredit = await fetch(
          `${baseUrl}movie/${filmId}/credits?api_key=${apiKey}&language=es`
        );
        const dataFilmCreditJson = await dataFilmCredit.json();
        setFilmCredits(dataFilmCreditJson.cast);
      } catch (error) {
        console.log(error);
      }
    };
    getFilmCredit();
    //video / trailer de pelicula
    const getMovieVideos = async () => {
      try {
        const dataMovieVideos = await fetch(
          `${baseUrl}movie/${filmId}/videos?api_key=${apiKey}&language=es`
        );
        const dataMovieVideosJson = await dataMovieVideos.json();
        setVideosFilm(dataMovieVideosJson.results);
      } catch (error) {
        console.log(error);
      }
    };
    getMovieVideos();
    setFilm(
      moviesList.find((m) => m.id === parseInt(filmId)) ||
        favoritemovie.find((f) => f.id === parseInt(filmId)) ||
        true
    );
  }, [apiKey, baseUrl, favoritemovie, filmId, moviesList]);

  return (
    <div>
      {film ? (
        <FilmDetail
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
