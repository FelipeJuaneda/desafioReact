import { Link } from "react-router";
import { SwiperSlide } from "swiper/react";

import Loading from "@/components/ui/Loading";
import SwiperCarousel from "@/components/ui/SwiperCarousel";
import type { Favorite } from "@/features/favorites/favorite";
import { useFavoriteContext } from "@/features/favorites/useFavoriteContext";
import type { MediaType } from "@/types/tmdb";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";

const FavoriteList = () => {
  const { favorites, status, removeFavorite } = useFavoriteContext();

  if (status === "loading") return <Loading />;

  const generateFavoriteSection = (mediaType: MediaType, type: "Peliculas" | "Series") => {
    const list: Favorite[] = favorites.filter((f) => f.mediaType === mediaType);
    return (
      <div>
        <div className="flex justify-center pt-4 pb-4">
          <span className="flex gap-2 font-cineFontFamily text-3xl">
            <i className={`ri-heart-fill text-red-500`} /> {type} Favoritas{" "}
            <i className={`ri-heart-fill text-red-500`} />
          </span>
        </div>
        <SwiperCarousel>
          {list.length > 0 ? (
            list.map((el) => (
              <SwiperSlide key={el.id}>
                <div className="w-full object-cover">
                  <Link to={`/${mediaType === "movie" ? "film" : "tvShow"}/${el.tmdbId}`}>
                    <img
                      src={
                        el.posterPath === null
                          ? "https://www.orbis.com.ar/wp-content/themes/barberry/images/placeholder.jpg"
                          : "https://image.tmdb.org/t/p/w220_and_h330_face" + el.posterPath
                      }
                      className="h-full w-full rounded-md"
                      alt={`Afiche de ${el.title}`}
                      loading="lazy"
                    />
                  </Link>
                </div>

                <button
                  type="button"
                  aria-label={`Quitar "${el.title}" de favoritos`}
                  onClick={() => void removeFavorite(el.mediaType, el.tmdbId)}
                  className="btn absolute top-0 left-0 flex h-9 w-9 items-center justify-center bg-red-500"
                >
                  <i className="ri-dislike-fill" aria-hidden="true" />
                </button>
              </SwiperSlide>
            ))
          ) : (
            <p className="text-center">
              No agregaste ninguna {type.toLowerCase().slice(0, -1)} a favorito!
            </p>
          )}
        </SwiperCarousel>
      </div>
    );
  };

  return (
    <section>
      {status === "error" && (
        <p role="alert" className="pt-4 text-center">
          No pudimos cargar tu lista. Revisá tu conexión y recargá la página.
        </p>
      )}
      {generateFavoriteSection("movie", "Peliculas")}
      {generateFavoriteSection("tv", "Series")}
    </section>
  );
};

export default FavoriteList;
