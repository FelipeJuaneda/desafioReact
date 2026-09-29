import { useEffect, useState, type MouseEvent } from "react";
import { toast } from "sonner";
import { useFavoriteContext } from "@/features/favorites/useFavoriteContext";
import { getTitle, type TitleDetail } from "@/types/tmdb";

interface AddToFavoriteButtonProps {
  dataDetail: TitleDetail;
}

const AddToFavoriteButton = ({ dataDetail }: AddToFavoriteButtonProps) => {
  const {
    favoritemovie,
    favoritetv,
    addMovieToFavorite,
    removeMovieToFavorite,
    addTvToTvList,
    removeTvToTvList,
  } = useFavoriteContext();
  const [isFavorite, setIsFavorite] = useState(false);

  // Movies are told apart from series by having a runtime; series by their season count.
  const runtime = "runtime" in dataDetail ? dataDetail.runtime : null;
  const seasons = "number_of_seasons" in dataDetail ? dataDetail.number_of_seasons : null;
  const title = getTitle(dataDetail);

  useEffect(() => {
    if (favoritemovie && runtime) {
      const ifMovieIsIn = favoritemovie.find((e) => e.id === dataDetail.id);
      setIsFavorite(!!ifMovieIsIn);
    } else if (favoritetv && seasons) {
      const ifTvIsIn = favoritetv.find((e) => e.id === dataDetail.id);
      setIsFavorite(!!ifTvIsIn);
    }
  }, [dataDetail.id, favoritemovie, favoritetv, runtime, seasons]);

  const removedToast = () =>
    toast(
      <div className="flex flex-row gap-3">
        <i className="ri-delete-bin-line text-base" />
        <span className="text-sm">{`"${title}" eliminado de favoritos`}</span>
      </div>,
    );

  const handleToggleFavorite = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if ("runtime" in dataDetail && dataDetail.runtime) {
      if (isFavorite) {
        removeMovieToFavorite(dataDetail.id);
        removedToast();
      } else {
        toast.success(`"${title}" agregado a favoritos`);
        addMovieToFavorite(dataDetail);
      }
    } else if ("number_of_seasons" in dataDetail && dataDetail.number_of_seasons) {
      if (isFavorite) {
        removeTvToTvList(dataDetail.id);
        removedToast();
      } else {
        toast.success(`"${title}" agregado a favoritos`);
        addTvToTvList(dataDetail);
      }
    }
    setIsFavorite(!isFavorite);
  };

  return (
    <div className="flex gap-3 pt-3 pb-3">
      <button
        className="h-11 w-11 rounded-full bg-verde-principal-500 p-2 hover:bg-verde-principal-400 focus:outline-none"
        onClick={handleToggleFavorite}
      >
        {isFavorite ? (
          <i className="ri-heart-fill text-xl text-red-600" />
        ) : (
          <i className="ri-heart-line text-xl" />
        )}
      </button>
    </div>
  );
};

export default AddToFavoriteButton;
