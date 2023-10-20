import { Link, useNavigate } from "react-router-dom";
import DetailVideos from "./DetailVideos";
import DetailCast from "./DetailCast";
import AddToFavoriteButton from "../../components/AddToFavoriteButton/AddToFavoriteButton";
import "./Detail.css";

const Detail = ({ dataDetail, dataCredits, dataVideos, type }) => {
  //para guardar la navegacion y volver para atras
  const navigate = useNavigate();

  //convirtiendo minutos en horas, y separando los minutos restantes
  const hours = Math.trunc(dataDetail.runtime / 60);
  const minutes = dataDetail.runtime % 60;

  return (
    <div className="detailFilmCont absolute top-0 left-0 right-0 overflow-y-auto bg-[#eeeeee] flex flex-col items-center gap-10 z-50">
      <div
        id="backDrop"
        className="relative w-full bg-repeat bg-cover posterFilm h-128"
        style={{
          backgroundImage: `url("https://www.themoviedb.org/t/p/w1920_and_h800_multi_faces${dataDetail.backdrop_path}")`,
        }}
      >
        <div id="gradientBackdrop" className="w-full h-full ">
          <div className="absolute imgFilm -bottom-14 left-14 1024:hidden">
            <img
              className="rounded imgDetail w-60 drop-shadow-2xl"
              src={
                dataDetail.poster_path === null
                  ? "https://www.orbis.com.ar/wp-content/themes/barberry/images/placeholder.jpg"
                  : `https://image.tmdb.org/t/p/w500/${dataDetail.poster_path}`
              }
              alt=" poster pelicula"
            />
          </div>
          <div className="absolute bottom-0 w-4/6 overviewCalif left-80 1024:w-full 1024:h-[70%] 1024:left-0 1024:text-center 1024:flex 1024:justify-center 1024:items-center flex-col 580:h-4/5">
            <span className="text-3xl text-white underline uppercase underline-offset-4 decoration-sky-500 hover:decoration-sky-300 font-cineFontFamily">
              {dataDetail.title || dataDetail.name}
            </span>
            <div
              id="generosDuracion"
              className="flex items-baseline gap-2 1024:text-sm 1024:flex 1024:flex-wrap 1024:justify-start"
            >
              {dataDetail.genres
                ? dataDetail.genres.map((e) => (
                    <Link to={`/genre/${e.id}`} key={e.id}>
                      <p className="text-green-500 cursor-pointer font-cineFontFamily">
                        {e.name},
                      </p>
                    </Link>
                  ))
                : null}
              <span className="text-white">
                {type === "movie"
                  ? `° ${hours}h ${minutes}m`
                  : dataDetail.number_of_seasons === 1
                  ? `${dataDetail.number_of_seasons} temporada`
                  : `${dataDetail.number_of_seasons} temporadas`}
                {}
              </span>
            </div>

            <p
              id="resumenParrafo"
              className="overflow-auto text-base text-blue-50 font-cineFontFamily 1024:w-full 1024:text-center 1024:text-sm"
            >
              <span className="underline">Resumen:</span>
              <br />
              {dataDetail.overview}
            </p>
            <div className="text-start">
              <p className="text-blue-50 decoration-8">
                Estreno: {dataDetail.release_date || dataDetail.first_air_date}
              </p>
              <span className="text-blue-50 decoration-8">
                Calificacion: {dataDetail.vote_average}
              </span>
            </div>

            {/* aca va los botones favs */}
            <AddToFavoriteButton dataDetail={dataDetail} />
          </div>
        </div>
      </div>

      {/* elenco de pelicula */}
      <DetailCast dataCredits={dataCredits} />

      {/* Trailers y videos de pelicula */}
      <DetailVideos dataVideos={dataVideos} />

      <button
        className="fixed z-10 backButton btn btn-danger top-10 right-10 550:top-4 550:right-4"
        onClick={() => navigate(-1)}
      >
        Volver
      </button>
    </div>
  );
};

export default Detail;
