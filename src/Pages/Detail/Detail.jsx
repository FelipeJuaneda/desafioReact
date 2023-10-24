import { Link } from "react-router-dom";
import DetailVideos from "./DetailVideos";
import DetailCast from "./DetailCast";
import AddToFavoriteButton from "../../components/AddToFavoriteButton/AddToFavoriteButton";
import "./Detail.css";

const Detail = ({ dataDetail, dataCredits, dataVideos, type }) => {
  const hours = Math.trunc(dataDetail.runtime / 60);
  const minutes = dataDetail.runtime % 60;

  return (
    <div className="relative w-full h-full overflow-y-auto bg-verde-principal-50">
      <div
        id="backDrop"
        className="relative w-full bg-center bg-cover posterFilm"
        style={{
          backgroundImage: `url("https://www.themoviedb.org/t/p/w1920_and_h800_multi_faces${dataDetail.backdrop_path}")`,
        }}
      >
        <div id="gradientBackdrop">
          <div className="flex w-full gap-6 p-4 pt-16 md:p-10 ">
            <div className="hidden md:left-14 md:flex h-[450px] xl:min-w-[300px] w-[300px]">
              <img
                className="w-full m-auto rounded drop-shadow-2xl"
                loading="lazy"
                src={
                  dataDetail.poster_path === null
                    ? "https://www.orbis.com.ar/wp-content/themes/barberry/images/placeholder.jpg"
                    : `https://image.tmdb.org/t/p/w300_and_h450_bestv2/${dataDetail.poster_path}`
                }
                alt={`Poster de ${dataDetail.title || dataDetail.name}`}
              />
            </div>
            <div className="flex flex-col justify-end w-full ">
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
                          {e.name}
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
                </span>
              </div>

              <p
                id="resumenParrafo"
                className="w-full overflow-auto text-base 2xl:w-3/4 text-blue-50 font-cineFontFamily 1024:text-sm"
              >
                <span className="underline">Resumen:</span>
                <br />
                {dataDetail.overview}
              </p>
              <div className="text-start">
                <p className="text-blue-50 decoration-8">
                  Estreno:{" "}
                  {dataDetail.release_date || dataDetail.first_air_date}
                </p>
                <span className="text-blue-50 decoration-8">
                  Calificacion: {dataDetail.vote_average}
                </span>
              </div>

              {/* Aquí van los botones de favoritos */}
              <AddToFavoriteButton dataDetail={dataDetail} />
            </div>
          </div>
        </div>
      </div>

      {/* Elenco de la película */}
      <DetailCast dataCredits={dataCredits} />

      {/* Tráilers y videos de la película */}
      <DetailVideos dataVideos={dataVideos} />
    </div>
  );
};

export default Detail;
