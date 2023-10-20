import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useFavoriteContext } from "../../contexts/FavoriteContext";

const AddToFavoriteButton = ({ dataDetail }) => {
  const {
    favoritemovie,
    favoritetv,
    addMovieToFavorite,
    removeMovieToFavorite,
    addTvToTvList,
    removeTvToTvList,
  } = useFavoriteContext();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (favoritemovie && dataDetail.runtime) {
      const ifMovieIsIn = favoritemovie.find((e) => e.id === dataDetail.id);
      setIsFavorite(!!ifMovieIsIn);
    } else if (favoritetv && dataDetail.number_of_seasons) {
      const ifTvIsIn = favoritetv.find((e) => e.id === dataDetail.id);
      setIsFavorite(!!ifTvIsIn);
    }
  }, [
    dataDetail.id,
    favoritemovie,
    favoritetv,
    dataDetail.runtime,
    dataDetail.number_of_seasons,
  ]);

  const handleToggleFavorite = (e) => {
    e.preventDefault();
    if (dataDetail.runtime) {
      if (isFavorite) {
        removeMovieToFavorite(dataDetail.id);
        toast(
          <div className="flex flex-row gap-3">
            <i className="text-base ri-delete-bin-line" />
            <span className="text-sm">
              {`"${
                dataDetail.title || dataDetail.name
              }" eliminado de favoritos`}
            </span>
          </div>
        );
      } else {
        toast.success(
          `"${dataDetail.title || dataDetail.name}" agregado a favoritos`
        );
        addMovieToFavorite(dataDetail);
      }
    } else if (dataDetail.number_of_seasons) {
      if (isFavorite) {
        removeTvToTvList(dataDetail.id);
        toast(
          <div className="flex flex-row gap-3">
            <i className="text-base ri-delete-bin-line" />
            <span className="text-sm">
              {`"${
                dataDetail.title || dataDetail.name
              }" eliminado de favoritos`}
            </span>
          </div>
        );
      } else {
        toast.success(
          `"${dataDetail.title || dataDetail.name}" agregado a favoritos`
        );
        addTvToTvList(dataDetail);
      }
    }
    setIsFavorite(!isFavorite);
  };

  return (
    <div className="flex gap-3 pt-3 pb-3">
      <button
        className="text-xl text-black rounded-full bg-slate-400 btn"
        onClick={handleToggleFavorite}
      >
        {isFavorite ? (
          <i className={`ri-heart-fill text-red-600`} />
        ) : (
          <i className="ri-heart-line" />
        )}
      </button>
    </div>
  );
};

export default AddToFavoriteButton;
