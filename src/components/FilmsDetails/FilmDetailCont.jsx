import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import FilmDetail from "./FilmDetail";

const FilmDetailCont = () => {
  const { filmId } = useParams();
  const [film, setFilm] = useState({});
  const { moviesList } = useAppContext();

  useEffect(() => {
    setFilm(moviesList ? moviesList.find((m) => m.id == filmId) : null);
  }, [filmId, moviesList]);

  return <div>{film ? <FilmDetail film={film} /> : <p>Cargando...</p>}</div>;
};

export default FilmDetailCont;
