import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import FilmDetail from "./FilmDetail";

const FilmDetailCont = () => {
  //parametro id de la pelicula para url
  const { filmId } = useParams();
  //seteo las peliculas encontradas con el mismo id que el parametro
  const [film, setFilm] = useState({});
  const { moviesList } = useAppContext();

  //lo pongo en un useEffect para generar un re render
  useEffect(() => {
    setFilm(moviesList ? moviesList.find((m) => m.id == filmId) : null);
  }, [filmId, moviesList]);

  return <div>{film ? <FilmDetail film={film} /> : <p>Cargando...</p>}</div>;
};

export default FilmDetailCont;
