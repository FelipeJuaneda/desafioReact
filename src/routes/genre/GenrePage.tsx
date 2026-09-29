import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router";
import { genresQuery, moviesByGenreQuery } from "@/services/tmdb/queries";
import pororoLoad from "@/assets/images/pororoLoad.gif";
import "@/routes/genre/GenrePage.css";
const GenreList = () => {
  const { genreId = "" } = useParams();

  //peliculas segun genero
  const { data: filmByGenre } = useQuery(moviesByGenreQuery(genreId));
  //lista de generos con id y nombre
  const { data: genreList = [] } = useQuery(genresQuery("movie"));

  //filtrando de la lista de generos el nombre seleccionado
  const genderName = genreList.filter((e) => e.id === Number(genreId));

  return (
    <div id="genreList">
      <div className="h-full w-full">
        <div className="h-24 bg-[#a72509] py-4 px-5 1024:py-1 1024:px-2">
          {genderName.map((e) => (
            <span key={e.id} className="font-cineFontFamily text-3xl font-bold text-white">
              {e.name}
            </span>
          ))}
        </div>

        <div className="flex flex-col gap-7 px-10 py-8 580:px-2">
          {filmByGenre ? (
            filmByGenre.results.map((e) => {
              return (
                <div
                  className="m-auto flex w-11/12 shadow-2xl duration-500 hover:shadow-xl 1024:w-full"
                  key={e.id}
                >
                  <div className="h-[141px] w-[94px] min-w-[94px] rounded-[50px]">
                    <Link to={`/film/${e.id}`}>
                      <img
                        className="rounded-l-lg"
                        src={`https://www.themoviedb.org/t/p/w94_and_h141_bestv2${e.poster_path}`}
                        alt="poster de pelicula por genero"
                      />
                    </Link>
                  </div>

                  <div className="details w-full rounded-r-lg bg-slate-200 p-3">
                    <div className="titleAndDate flex flex-col">
                      <Link to={`/film/${e.id}`}>
                        <span className="title text-lg font-semibold hover:text-stone-600 hover:underline">
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
    </div>
  );
};

export default GenreList;
