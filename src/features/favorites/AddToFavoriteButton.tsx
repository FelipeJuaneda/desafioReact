import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useAuthContext } from "@/features/auth/useAuthContext";
import { toFavoriteInput } from "@/features/favorites/favorite";
import { useFavoriteContext } from "@/features/favorites/useFavoriteContext";
import type { MediaType, MovieSummary, TvSummary } from "@/types/tmdb";

interface AddToFavoriteButtonProps {
  mediaType: MediaType;
  item: MovieSummary | TvSummary;
}

const AddToFavoriteButton = ({ mediaType, item }: AddToFavoriteButtonProps) => {
  const { user } = useAuthContext();
  const { isFavorite, addFavorite, removeFavorite } = useFavoriteContext();
  const navigate = useNavigate();
  const input = toFavoriteInput(mediaType, item);
  const saved = isFavorite(mediaType, item.id);

  const handleToggleFavorite = async () => {
    if (!user) {
      toast("Iniciá sesión para guardar títulos en tu lista", {
        action: { label: "Ingresar", onClick: () => navigate("/login") },
      });
      return;
    }
    try {
      if (saved) {
        await removeFavorite(mediaType, item.id);
        toast(
          <div className="flex flex-row gap-3">
            <i className="ri-delete-bin-line text-base" />
            <span className="text-sm">{`"${input.title}" eliminado de favoritos`}</span>
          </div>,
        );
      } else {
        await addFavorite(input);
        toast.success(`"${input.title}" agregado a favoritos`);
      }
    } catch {
      toast.error("No pudimos actualizar tu lista. Probá de nuevo en un momento.");
    }
  };

  return (
    <div className="flex gap-3 pt-3 pb-3">
      <button
        type="button"
        aria-pressed={saved}
        aria-label={saved ? `Quitar "${input.title}" de favoritos` : `Guardar "${input.title}"`}
        className="h-11 w-11 rounded-full bg-verde-principal-500 p-2 hover:bg-verde-principal-400 focus:outline-hidden"
        onClick={handleToggleFavorite}
      >
        {saved ? (
          <i className="ri-heart-fill text-xl text-red-600" aria-hidden="true" />
        ) : (
          <i className="ri-heart-line text-xl" aria-hidden="true" />
        )}
      </button>
    </div>
  );
};

export default AddToFavoriteButton;
