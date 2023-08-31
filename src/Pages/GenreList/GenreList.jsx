import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Element } from "react-scroll";
import { useAppContext } from "../../contexts/AppContext";
import pororoLoad from "../../images/pororoLoad.gif";

import "./GenreList.css";
const GenreList = () => {
  const { apiKey, baseUrl } = useAppContext();
  const { genreId } = useParams();

  //peliculas segun genero guardado aca
  const [filmByGenre, setFilmByGenre] = useState();
  //lista de generos con id y nombre
  const [genreList, setGenreList] = useState([]);

  useEffect(() => {
    const getFilmByGenre = async () => {
      await fetch(
        `${baseUrl}discover/movie?api_key=${apiKey}&with_genres=${genreId}&language=es`
      )
        .then((response) => response.json())
        .then((data) => setFilmByGenre(data));
    };
    getFilmByGenre();
    const getGenreList = async () => {
      await fetch(`${baseUrl}genre/movie/list?api_key=${apiKey}&language=es`)
        .then((response) => response.json())
        .then((data) => setGenreList(data.genres));
    };
    getGenreList();
  }, [apiKey, baseUrl, genreId]);

  //filtrando de la lista de generos el nombre seleccionado
  const genderName = genreList
    ? genreList.filter((e) => e.id === parseInt(genreId))
    : null;

  return (
    <Element name="genreList" id="genreList">
      <div className="w-full h-full">
        <div className="h-24 bg-[#a72509] py-4 px-5 1024:py-1 1024:px-2">
          {genderName.map((e) => (
            <span
              key={e.id}
              className="text-3xl font-bold text-white font-cineFontFamily"
            >
              {e.name}
            </span>
          ))}
        </div>

        <div className="flex flex-col px-10 py-8 gap-7 580:px-2">
          {filmByGenre ? (
            filmByGenre.results.map((e) => {
              return (
                <div
                  className="flex w-11/12 m-auto duration-500 shadow-2xl hover:shadow-xl 1024:w-full"
                  key={e.id}
                >
                  <div className="min-w-[94px] w-[94px] h-[141px] rounded-[50px]">
                    <Link to={`/film/${e.id}`}>
                      <img
                        className="rounded-l-lg"
                        src={`https://www.themoviedb.org/t/p/w94_and_h141_bestv2${e.poster_path}`}
                        alt="poster de pelicula por genero"
                      />
                    </Link>
                  </div>

                  <div className="w-full p-3 rounded-r-lg details bg-slate-200">
                    <div className="flex flex-col titleAndDate">
                      <Link to={`/film/${e.id}`}>
                        <span className="text-lg font-semibold title hover:underline hover:text-stone-600">
                          {e.title}
                        </span>
                      </Link>
                      <span className="date">{e.release_date}</span>
                    </div>
                    <div className="overviewCont">
                      <p className="overview">{e.overview}</p>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex justify-center">
              <img src={pororoLoad} alt="Pochoclo cargando" />
            </div>
          )}
        </div>
      </div>
    </Element>
  );
};

export default GenreList;
