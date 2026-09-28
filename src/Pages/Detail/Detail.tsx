import { Link } from "react-router";
import DetailVideos from "./DetailVideos";
import DetailCast from "./DetailCast";
import AddToFavoriteButton from "../../components/AddToFavoriteButton/AddToFavoriteButton";
import {
  getTitle,
  type Credits,
  type MediaType,
  type TitleDetail,
  type Videos,
} from "../../types/tmdb";
import "./Detail.css";

interface DetailProps {
  dataDetail: TitleDetail;
  dataCredits: Credits | null;
  dataVideos: Videos | null;
  type: MediaType;
}

const Detail = ({ dataDetail, dataCredits, dataVideos, type }: DetailProps) => {
  const runtime = "runtime" in dataDetail ? (dataDetail.runtime ?? 0) : 0;
  const seasons = "number_of_seasons" in dataDetail ? dataDetail.number_of_seasons : undefined;
  const releaseDate =
    "release_date" in dataDetail ? dataDetail.release_date : dataDetail.first_air_date;
  const title = getTitle(dataDetail);
  const hours = Math.trunc(runtime / 60);
  const minutes = runtime % 60;

  return (
    <div className="relative h-full w-full overflow-y-auto bg-verde-principal-50">
      <div
        id="backDrop"
        className="posterFilm relative w-full bg-cover bg-center"
        style={{
          backgroundImage: `url("https://www.themoviedb.org/t/p/w1920_and_h800_multi_faces${dataDetail.backdrop_path}")`,
        }}
      >
        <div id="gradientBackdrop">
          <div className="flex w-full gap-6 p-4 pt-16 md:p-10">
            <div className="hidden h-[450px] w-[300px] md:left-14 md:flex xl:min-w-[300px]">
              <img
                className="m-auto w-full rounded drop-shadow-2xl"
                loading="lazy"
                src={
                  dataDetail.poster_path === null
                    ? "https://www.orbis.com.ar/wp-content/themes/barberry/images/placeholder.jpg"
                    : `https://image.tmdb.org/t/p/w300_and_h450_bestv2/${dataDetail.poster_path}`
                }
                alt={`Poster de ${title}`}
              />
            </div>
            <div className="flex w-full flex-col justify-end md:justify-center xl:justify-end">
              <span className="font-cineFontFamily text-3xl uppercase text-white underline decoration-sky-500 underline-offset-4 hover:decoration-sky-300">
                {title}
              </span>
              <div
                id="generosDuracion"
                className="flex items-baseline gap-2 1024:flex 1024:flex-wrap 1024:justify-start 1024:text-sm"
              >
                {dataDetail.genres
                  ? dataDetail.genres.map((e) => (
                      <Link to={`/genre/${e.id}`} key={e.id}>
                        <p className="cursor-pointer font-cineFontFamily text-verde-principal-500">
                          {e.name}
                        </p>
                      </Link>
                    ))
                  : null}
                <span className="text-white">
                  {type === "movie"
                    ? `° ${hours}h ${minutes}m`
                    : seasons === 1
                      ? `${seasons} temporada`
                      : `${seasons} temporadas`}
                </span>
              </div>

              <p
                id="resumenParrafo"
                className="w-full overflow-auto font-cineFontFamily text-base text-blue-50 1024:text-sm 2xl:w-3/4"
              >
                <span className="underline">Resumen:</span>
                <br />
                {dataDetail.overview}
              </p>
              <div className="text-start">
                <p className="text-blue-50 decoration-8">Estreno: {releaseDate}</p>
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
