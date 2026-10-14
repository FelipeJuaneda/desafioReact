import { RiCheckLine } from "@remixicon/react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { cn } from "@/lib/cn";
import { tmdbImage } from "@/services/tmdb/images";
import { servicesQuery } from "./catalog";
import { setMyServices, useMyServices } from "./myServices";

const Picker = ({ onSaved }: { onSaved: (ids: number[]) => void }) => {
  const { data: services = [], isPending } = useQuery(servicesQuery());
  const [chosen, setChosen] = useState(useMyServices());
  const toggle = (id: number) =>
    setChosen((current) =>
      current.includes(id) ? current.filter((c) => c !== id) : [...current, id],
    );

  return (
    <div className="grid gap-6">
      <p className="max-w-[60ch] text-body text-emulsion-muted">
        Marcá las que tenés. Las usamos para filtrar el catálogo, avisarte en cada ficha si la podés
        ver y armar tus recomendaciones. Quedan guardadas en este dispositivo.
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4" aria-busy={isPending}>
        {isPending
          ? Array.from({ length: 8 }, (_, i) => (
              <div key={i} aria-hidden className="h-16 rounded-aperture bg-acetate-raised" />
            ))
          : services.map((service) => {
              const pressed = chosen.includes(service.id);
              return (
                <button
                  key={service.id}
                  type="button"
                  aria-pressed={pressed}
                  onClick={() => toggle(service.id)}
                  className={cn(
                    "flex min-h-16 items-center gap-3 rounded-aperture border px-3 py-2.5 text-left text-small font-semibold text-emulsion transition-colors duration-(--duration-fast)",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-edge",
                    pressed
                      ? "border-edge bg-acetate-raised"
                      : "border-control-line bg-leader hover:border-emulsion-muted",
                  )}
                >
                  <span className="relative shrink-0">
                    {service.logoPath ? (
                      <img
                        src={tmdbImage(service.logoPath, 92)}
                        alt=""
                        width={40}
                        height={40}
                        className="size-10 rounded-aperture"
                      />
                    ) : (
                      <span
                        aria-hidden
                        className="block size-10 rounded-aperture bg-acetate-raised"
                      />
                    )}
                    {pressed && (
                      <RiCheckLine
                        aria-hidden
                        className="absolute -right-1.5 -bottom-1.5 size-5 rounded-perf bg-edge p-0.5 text-on-edge"
                      />
                    )}
                  </span>
                  {service.name}
                </button>
              );
            })}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button
          onClick={() => {
            setMyServices(chosen);
            onSaved(chosen);
          }}
        >
          {chosen.length === 0 ? "No tengo ninguna" : "Guardar mis plataformas"}
        </Button>
        <p aria-live="polite" className="text-small text-emulsion-muted">
          {chosen.length === 0
            ? "Ninguna elegida."
            : `${chosen.length} ${chosen.length === 1 ? "elegida" : "elegidas"}.`}
        </p>
      </div>
    </div>
  );
};

interface ServicesDialogProps {
  open: boolean;
  onClose: () => void;
  /** Called with the new choice after saving. */
  onSaved?: (ids: number[]) => void;
}

/** "Mis plataformas": pick once, used everywhere. */
export const ServicesDialog = ({ open, onClose, onSaved }: ServicesDialogProps) => (
  <Dialog open={open} onClose={onClose} title="Mis plataformas" className="max-w-3xl">
    {/* Mounted only while open, so it starts from the saved choice every time. */}
    {open && (
      <Picker
        onSaved={(ids) => {
          onSaved?.(ids);
          onClose();
        }}
      />
    )}
  </Dialog>
);
