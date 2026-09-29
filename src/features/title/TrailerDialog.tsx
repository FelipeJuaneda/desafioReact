import { useState } from "react";
import { Dialog } from "@/components/ui/Dialog";
import type { Video } from "@/types/tmdb";

interface TrailerDialogProps {
  video: Video | null;
  onClose: () => void;
}

/** Plays a YouTube video from the privacy-enhanced domain; the player only loads when opened. */
export const TrailerDialog = ({ video, onClose }: TrailerDialogProps) => {
  // Keep the last video on screen while the dialog fades out, instead of collapsing mid-exit.
  const [shown, setShown] = useState(video);
  if (video && video !== shown) setShown(video);

  return (
    <Dialog open={video !== null} onClose={onClose} title={shown?.name ?? "Tráiler"}>
      {shown && (
        <div className="aspect-video overflow-hidden rounded-aperture bg-leader">
          {video && (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${shown.key}?autoplay=1&rel=0`}
              title={shown.name}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              className="size-full"
            />
          )}
        </div>
      )}
    </Dialog>
  );
};
