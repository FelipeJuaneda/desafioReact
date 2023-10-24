import { Link, useNavigate } from "react-router-dom";
import DetailVideos from "./DetailVideos";
import DetailCast from "./DetailCast";
import AddToFavoriteButton from "../../components/AddToFavoriteButton/AddToFavoriteButton";
import "./Detail.css";

const Detail = ({ dataDetail, dataCredits, dataVideos, type }) => {
  const navigate = useNavigate();
  const hours = Math.trunc(dataDetail.runtime / 60);
  const minutes = dataDetail.runtime % 60;

  return (
    <div className="absolute top-0 left-0 right-0 z-50 flex flex-col items-center gap-10 overflow-y-auto 900:gap-5 detailFilmCont bg-verde-principal-50">
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
              loading="lazy"
              src={
                dataDetail.poster_path === null
                  ? "https://www.orbis.com.ar/wp-content/themes/barberry/images/placeholder.jpg"
                  : `https://image.tmdb.org/t/p/w500/${dataDetail.poster_path}`
              }
              alt={`poster de ${dataDetail.title || dataDetail.name}`}
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
                      <p className="cursor-pointer text-verde-principal-500 font-cineFontFamily">
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
        className="fixed z-10 px-6 py-3 font-sans text-xs font-bold text-white uppercase transition-all bg-red-600 rounded-lg shadow-md top-10 right-10 md:top-4 md:right-4 middle-none center shadow-pink-500/20 hover:shadow-lg hover:shadow-red-500/40 focus:opacity-85 focus:shadow-none active:opacity-85 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
        data-ripple-light="true"
        onClick={() => navigate(-1)}
      >
        Volver
      </button>
    </div>
  );
};

export default Detail;
