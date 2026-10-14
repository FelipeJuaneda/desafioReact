import { RiExternalLinkLine } from "@remixicon/react";
import type { ReactNode } from "react";
import { Link } from "react-router";
import { paths } from "@/app/paths";
import { EdgeCode } from "@/components/ui/EdgeCode";

const SECTIONS = [
  { id: "idea", label: "La idea" },
  { id: "diseno", label: "Dirección de diseño" },
  { id: "arquitectura", label: "Arquitectura" },
  { id: "recomendador", label: "El recomendador" },
  { id: "rendimiento", label: "Rendimiento" },
  { id: "calidad", label: "Calidad" },
  { id: "stack", label: "Stack" },
] as const;

const Section = ({
  id,
  title,
  children,
}: {
  id: (typeof SECTIONS)[number]["id"];
  title: string;
  children: ReactNode;
}) => (
  <section aria-labelledby={id} className="grid scroll-mt-28 gap-5 border-t border-frameline pt-10">
    <h2 id={id} className="font-display text-display-lg font-extrabold text-emulsion uppercase">
      {title}
    </h2>
    <div className="grid max-w-[68ch] gap-4 text-body-lg text-emulsion-muted [&_strong]:font-semibold [&_strong]:text-emulsion">
      {children}
    </div>
  </section>
);

const SWATCHES = [
  { name: "Cola de proyección", token: "leader", value: "#0e0d0b", className: "bg-leader" },
  { name: "Acetato", token: "acetate", value: "#171511", className: "bg-acetate" },
  { name: "Emulsión", token: "emulsion", value: "#ede6d6", className: "bg-emulsion" },
  { name: "Código de borde", token: "edge", value: "#eaa53c", className: "bg-edge" },
  { name: "Lápiz graso", token: "grease", value: "#e5402f", className: "bg-grease" },
];

const WEIGHTS = [
  { label: "Calidad: puntaje ponderado por cantidad de votos", value: 38 },
  { label: "Ánimo: el género principal pesa más que uno secundario", value: 30 },
  { label: "Con quién la ves", value: 17 },
  { label: "Época", value: 8 },
  { label: "Qué tan conocida es", value: 7 },
];

/** One box of the architecture diagram. */
const Node = ({ title, children }: { title: string; children: ReactNode }) => (
  <div className="grid gap-1 rounded-aperture border border-control-line bg-acetate px-4 py-3">
    <p className="text-title font-bold text-emulsion">{title}</p>
    <p className="text-small text-emulsion-muted">{children}</p>
  </div>
);

const Arrow = ({ label }: { label: string }) => (
  <p className="flex items-center gap-2 py-1 pl-4 font-code text-code font-medium text-edge uppercase [font-stretch:75%]">
    <span aria-hidden className="h-6 w-px bg-edge" />
    {label}
  </p>
);

const externalLink =
  "inline-flex items-center gap-1 rounded-perf font-semibold text-emulsion underline decoration-edge/50 underline-offset-4 hover:decoration-edge focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-edge [&_svg]:size-4";

/**
 * The case study: why PelicuLed looks and works the way it does. Read mode: one comfortable
 * column, an index that stays in view on desktop.
 */
const HowItsMadePage = () => (
  <div className="mx-auto grid max-w-(--container-reel) gap-10 px-(--spacing-gutter) pt-8 pb-6 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-16 lg:pt-12">
    <title>Cómo está hecha · PelicuLed</title>
    <meta
      name="description"
      content="El caso de estudio de PelicuLed: dirección de diseño, arquitectura, el algoritmo del recomendador, rendimiento y calidad."
    />

    <nav
      aria-label="En esta página"
      className="hidden lg:sticky lg:top-[calc(var(--header-height)+2rem)] lg:block lg:self-start"
    >
      <ol className="grid gap-1 border-l border-frameline">
        {SECTIONS.map((section) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              className="-ml-px block border-l border-transparent py-1.5 pl-4 text-small text-emulsion-muted hover:border-edge hover:text-emulsion focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-edge"
            >
              {section.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>

    <article className="grid gap-12">
      <header className="grid max-w-[68ch] gap-4">
        <h1 className="font-display text-display-xl font-extrabold text-balance text-emulsion uppercase">
          Cómo está hecha
        </h1>
        <p className="text-body-lg text-emulsion-muted">
          PelicuLed empezó como un desafío de React: un listado de películas con Create React App.
          Lo rehice de cero como un producto: identidad propia, arquitectura limpia, accesible,
          medida y testeada. Esto es lo que hay detrás.
        </p>
        <EdgeCode
          items={[
            { label: "React 19", emphasis: true },
            { label: "TypeScript estricto" },
            { label: "Vite" },
            { label: "Vercel" },
          ]}
        />
      </header>

      <Section id="idea" title="La idea">
        <p>
          Un catálogo para <strong>decidir qué ver</strong>, no un clon de una plataforma de
          streaming: acá no se reproduce nada, así que todo gira alrededor del momento previo a que
          se apaguen las luces.
        </p>
        <p>
          De ahí salen las funciones: ver en qué plataformas de Argentina está cada título, un{" "}
          <Link to={paths.recommender} className={externalLink}>
            recomendador
          </Link>{" "}
          que pregunta con quién la ves y cuánto tiempo tenés, la{" "}
          <Link to={paths.releases} className={externalLink}>
            cartelera de estrenos
          </Link>{" "}
          con aviso en tu calendario, tu lista sincronizada entre dispositivos y enlaces que se
          comparten con una tarjeta propia.
        </p>
      </Section>

      <Section id="diseno" title="Dirección de diseño">
        <p>
          La dirección se llama <strong>Borde de 35 mm</strong>: el catálogo se lee como un rollo de
          película. Cada título es un cuadro, y sus datos (tipo, año, duración, puntaje) se imprimen
          como el código de borde de la copia, en monoespaciada condensada. Cada zona toma una
          escena del oficio: la cuenta es un set con claqueta, Mi lista es la sala de montaje y
          tachar un título es una marca de lápiz graso.
        </p>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-5" aria-label="Paleta">
          {SWATCHES.map((swatch) => (
            <li key={swatch.token} className="grid gap-2">
              <span
                aria-hidden
                className={`h-16 rounded-aperture outline outline-1 -outline-offset-1 outline-frameline ${swatch.className}`}
              />
              <span className="text-small font-semibold text-emulsion">{swatch.name}</span>
              <span className="font-code text-code text-emulsion-subtle uppercase [font-stretch:75%]">
                {swatch.value}
              </span>
            </li>
          ))}
        </ul>
        <p>
          Un solo acento, el ámbar del código de borde, y siempre con significado: foco, sección
          activa, contadores o el dato clave. La tipografía viene de la lata de película: títulos en{" "}
          <strong>Sofia Sans Extra Condensed</strong>, lectura en Sofia Sans y metadatos en Martian
          Mono. Todo está en tokens de Tailwind y documentado en DESIGN.md.
        </p>
      </Section>

      <Section id="arquitectura" title="Arquitectura">
        <p>
          Un sitio estático en el CDN de Vercel y un puñado de funciones. La clave de TMDB nunca
          llega al navegador: todas las llamadas pasan por un proxy propio que agrega el token, deja
          pasar solo los endpoints que la app usa y cachea en el borde.
        </p>
        <div className="grid gap-0 sm:max-w-xl" role="group" aria-label="Diagrama de arquitectura">
          <Node title="Navegador">
            React 19, React Router en modo data (cada pantalla se carga aparte) y TanStack Query
            como caché de datos.
          </Node>
          <Arrow label="/api/tmdb · caché en el CDN" />
          <Node title="Funciones de Vercel">
            Proxy de TMDB, la tarjeta para compartir (satori + resvg), los meta tags por título para
            los bots y el sitemap.
          </Node>
          <Arrow label="Token del lado del servidor" />
          <Node title="TMDB">Catálogo, imágenes y dónde ver cada título (datos de JustWatch).</Node>
        </div>
        <p>
          La cuenta usa <strong>Firebase Auth</strong> (email y Google) y la lista vive en{" "}
          <strong>Firestore</strong> con reglas por usuario. Firestore se descarga recién cuando
          alguien inicia sesión.
        </p>
      </Section>

      <Section id="recomendador" title="El recomendador">
        <p>
          Seis respuestas se traducen en búsquedas a TMDB: géneros según el ánimo, duración, época,
          tus plataformas y, en familia, solo títulos aptos para todo público. Cada candidato recibe
          un puntaje explicable:
        </p>
        <ul className="grid gap-3" aria-label="Pesos del puntaje">
          {WEIGHTS.map((weight) => (
            <li key={weight.label} className="grid gap-1.5">
              <div className="flex items-baseline justify-between gap-4 text-small">
                <span className="text-emulsion">{weight.label}</span>
                <span className="font-code text-code font-medium whitespace-nowrap text-edge tabular-nums">
                  {weight.value} %
                </span>
              </div>
              <span aria-hidden className="h-1.5 rounded-perf bg-frameline">
                <span
                  className="block h-full rounded-perf bg-edge"
                  style={{ width: `${(weight.value / 38) * 100}%` }}
                />
              </span>
            </li>
          ))}
        </ul>
        <p>
          El puntaje de TMDB se pondera por la cantidad de votos, para que un 9,5 con 20 votos no le
          gane a un 8,2 con 20.000. Si los filtros dejan muy poco, primero se aflojan duración y
          época. Al final, un paso de <strong>diversidad</strong> (maximal marginal relevance) evita
          diez títulos del mismo género o de la misma saga, y cada resultado dice por qué está ahí.
        </p>
      </Section>

      <Section id="rendimiento" title="Rendimiento">
        <p>
          El JavaScript de la primera visita tiene un <strong>presupuesto de 150 kB</strong> que
          controla la integración continua: si un cambio lo pasa, el build falla. Hoy pesa alrededor
          de 146 kB, con las animaciones incluidas.
        </p>
        <p>
          Algunas decisiones que lo sostienen: cada pantalla es un chunk aparte, Firebase se carga
          después del primer render, el HTML pide los datos del destacado mientras baja el JS, y un
          plugin de Vite convierte cada ícono en su propio módulo para que cada pantalla descargue
          solo los que usa. Los skeletons tienen la geometría exacta del contenido, así que nada
          salta al cargar.
        </p>
      </Section>

      <Section id="calidad" title="Calidad">
        <p>
          <strong>Accesibilidad WCAG 2.2 AA</strong> como requisito: contraste calculado por token,
          foco visible, áreas táctiles de 44 px, formularios con errores vinculados y animaciones
          que respetan "reducir movimiento".
        </p>
        <p>
          Más de cien tests unitarios y de integración (Vitest y Testing Library) y flujos completos
          en el navegador con Playwright, que además corren axe en cada pantalla clave y fallan ante
          cualquier violación AA. GitHub Actions valida formato, lint, tipos, tests, build y
          presupuesto en cada push. En producción, Speed Insights mide los Web Vitals de usuarios
          reales.
        </p>
      </Section>

      <Section id="stack" title="Stack">
        <EdgeCode
          items={[
            { label: "React 19", emphasis: true },
            { label: "TypeScript 6" },
            { label: "Vite 8" },
            { label: "React Router 8" },
            { label: "TanStack Query 5" },
            { label: "Tailwind CSS 4" },
            { label: "Motion" },
            { label: "Headless UI" },
            { label: "Firebase" },
            { label: "Vercel" },
            { label: "Vitest" },
            { label: "Playwright" },
          ]}
        />
        <p>
          El código está en{" "}
          <a
            href="https://github.com/FelipeJuaneda/desafioReact"
            target="_blank"
            rel="noopener noreferrer"
            className={externalLink}
          >
            GitHub
            <RiExternalLinkLine aria-hidden />
            <span className="sr-only">(se abre en otra pestaña)</span>
          </a>
          , con el README y las decisiones documentadas. Hecho por Felipe Juaneda.
        </p>
      </Section>
    </article>
  </div>
);

export default HowItsMadePage;
