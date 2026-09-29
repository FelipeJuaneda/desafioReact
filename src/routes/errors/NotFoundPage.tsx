import { paths } from "@/app/paths";
import { ButtonLink } from "@/components/ui/Button";
import { EndOfReel } from "@/routes/errors/EndOfReel";

const NotFoundPage = () => (
  <>
    <title>Fin del rollo · PelicuLed</title>
    <meta name="robots" content="noindex" />
    <EndOfReel
      code="404"
      title="Esta página no está en el rollo"
      actions={
        <>
          <ButtonLink to={paths.home}>Volver al inicio</ButtonLink>
          <ButtonLink variant="secondary" to={paths.search()}>
            Buscar un título
          </ButtonLink>
        </>
      }
    >
      Puede que el enlace esté mal escrito o que la página ya no exista.
    </EndOfReel>
  </>
);

export default NotFoundPage;
