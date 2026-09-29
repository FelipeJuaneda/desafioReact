import { RiBookmarkFill, RiBookmarkLine } from "@remixicon/react";
import { m } from "motion/react";
import { useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import { paths } from "@/app/paths";
import { Button } from "@/components/ui/Button";
import { useAuthContext } from "@/features/auth/useAuthContext";
import { toFavoriteInput } from "@/features/favorites/favorite";
import { useFavoriteContext } from "@/features/favorites/useFavoriteContext";
import { cn } from "@/lib/cn";
import type { MediaType, MovieSummary, TvSummary } from "@/types/tmdb";

/**
 * The bookmark swells briefly when a title is saved: confirmation where the finger is,
 * before the toast is read. `initial={false}` keeps it still on first render.
 */
const BookmarkMark = ({ saved, className }: { saved: boolean; className?: string }) => {
  const Icon = saved ? RiBookmarkFill : RiBookmarkLine;
  return (
    <m.span
      aria-hidden
      className="inline-grid place-items-center"
      initial={false}
      animate={{ scale: saved ? [1, 1.28, 1] : 1 }}
      // Keyframes need a tween (springs take two values): quick swell, slower settle.
      transition={{ duration: 0.42, times: [0, 0.3, 1], ease: "easeOut" }}
    >
      <Icon className={className} />
    </m.span>
  );
};

interface SaveButtonProps {
  mediaType: MediaType;
  item: MovieSummary | TvSummary;
  /** "chip": 44px icon over a poster. "full": labelled secondary button. */
  variant?: "chip" | "full";
  className?: string;
}

/** Adds or removes a title from "Mi lista". Guests are invited to sign in and come back. */
export const SaveButton = ({ mediaType, item, variant = "full", className }: SaveButtonProps) => {
  const { user } = useAuthContext();
  const { isFavorite, addFavorite, removeFavorite } = useFavoriteContext();
  const navigate = useNavigate();
  const location = useLocation();
  const input = toFavoriteInput(mediaType, item);
  const saved = isFavorite(mediaType, item.id);

  const toggle = async () => {
    if (!user) {
      const back = encodeURIComponent(location.pathname + location.search);
      toast("Iniciá sesión para guardar títulos en tu lista", {
        action: { label: "Ingresar", onClick: () => navigate(`${paths.signIn}?volver=${back}`) },
      });
      return;
    }
    try {
      if (saved) {
        await removeFavorite(mediaType, item.id);
        toast(`Quitaste "${input.title}" de tu lista`);
      } else {
        await addFavorite(input);
        toast.success(`Guardaste "${input.title}" en tu lista`);
      }
    } catch {
      toast.error("No pudimos actualizar tu lista. Probá de nuevo en un momento.");
    }
  };

  if (variant === "chip") {
    return (
      <button
        type="button"
        aria-pressed={saved}
        aria-label={saved ? `Quitar "${input.title}" de Mi lista` : `Guardar "${input.title}"`}
        onClick={toggle}
        className={cn(
          "grid size-11 place-items-center rounded-aperture transition-colors duration-(--duration-fast)",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-edge",
          saved ? "bg-edge text-on-edge" : "bg-leader/80 text-emulsion hover:bg-leader",
          className,
        )}
      >
        <BookmarkMark saved={saved} className="size-5" />
      </button>
    );
  }

  return (
    <Button variant="secondary" aria-pressed={saved} onClick={toggle} className={className}>
      <BookmarkMark saved={saved} />
      {saved ? "Guardada" : "Guardar"}
    </Button>
  );
};
