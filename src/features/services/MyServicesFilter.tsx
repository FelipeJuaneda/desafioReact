import { RiEqualizerLine } from "@remixicon/react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { listServices, servicesQuery } from "./catalog";
import { useMyServices } from "./myServices";
import { ServicesDialog } from "./ServicesDialog";

interface MyServicesFilterProps {
  active: boolean;
  onChange: (active: boolean) => void;
}

/**
 * "Solo en mis plataformas": narrows a list to what the viewer can actually watch. Without
 * saved services it asks for them first, then switches on.
 */
export const MyServicesFilter = ({ active, onChange }: MyServicesFilterProps) => {
  const mine = useMyServices();
  const { data: services = [] } = useQuery(servicesQuery());
  const [picking, setPicking] = useState(false);
  const names = listServices(mine, services);

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
      {mine.length === 0 ? (
        <Button variant="secondary" size="sm" onClick={() => setPicking(true)}>
          <RiEqualizerLine aria-hidden />
          Ver solo lo de mis plataformas
        </Button>
      ) : (
        <>
          <Button
            variant="secondary"
            size="sm"
            aria-pressed={active}
            onClick={() => onChange(!active)}
          >
            <RiEqualizerLine aria-hidden />
            Solo en mis plataformas
          </Button>
          <button
            type="button"
            onClick={() => setPicking(true)}
            className="min-h-11 rounded-perf text-small text-emulsion-muted underline decoration-frameline underline-offset-4 hover:text-emulsion hover:decoration-edge focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-edge"
          >
            {names ? `${names} · Cambiar` : "Cambiar"}
          </button>
        </>
      )}
      <ServicesDialog
        open={picking}
        onClose={() => setPicking(false)}
        onSaved={(ids) => onChange(ids.length > 0)}
      />
    </div>
  );
};
