import { isRouteErrorResponse, useRouteError } from "react-router";
import { paths } from "@/app/paths";
import { Button, ButtonLink } from "@/components/ui/Button";
import { EndOfReel } from "@/routes/errors/EndOfReel";
import NotFoundPage from "@/routes/errors/NotFoundPage";

// After a deploy, an open tab may ask for screen chunks that no longer exist.
const isStaleChunk = (error: unknown) =>
  error instanceof Error &&
  /dynamically imported module|Importing a module script failed|error loading dynamically/i.test(
    error.message,
  );

/** Anything a screen throws lands here, inside the shell, instead of a blank page. */
export const RouteError = () => {
  const error = useRouteError();
  if (isRouteErrorResponse(error) && error.status === 404) return <NotFoundPage />;

  const stale = isStaleChunk(error);
  if (import.meta.env.DEV) console.error(error);

  return (
    <>
      <title>Se cortó la proyección · PelicuLed</title>
      <EndOfReel
        code={stale ? "Nueva versión" : "Error"}
        title={stale ? "Hay una versión nueva" : "Se cortó la proyección"}
        actions={
          <>
            <Button onClick={() => window.location.reload()}>Recargar</Button>
            <ButtonLink variant="secondary" to={paths.home}>
              Volver al inicio
            </ButtonLink>
          </>
        }
      >
        {stale
          ? "PelicuLed se actualizó mientras navegabas. Recargá la página para seguir."
          : "Algo falló al mostrar esta pantalla. Recargá la página; si vuelve a pasar, probá en un rato."}
      </EndOfReel>
    </>
  );
};
