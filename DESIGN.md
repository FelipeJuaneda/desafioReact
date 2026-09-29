---
name: PelicuLed
description: Catálogo de películas y series leído como un rollo de 35 mm.
colors:
  leader: "#0e0d0b"
  acetate: "#171511"
  acetate-raised: "#211e19"
  frameline: "#3a352d"
  control-line: "#756c5b"
  emulsion: "#ede6d6"
  emulsion-muted: "#a89f8c"
  emulsion-subtle: "#948b78"
  edge: "#eaa53c"
  edge-hover: "#f2b659"
  on-edge: "#1a1206"
  danger: "#f07058"
  success: "#8cc382"
  info: "#7fb3a8"
  lt-ground: "#f1ebdd"
  lt-surface: "#fbf7ee"
  lt-ink: "#1b1813"
  lt-muted: "#5b5345"
  lt-line: "#cfc5b0"
  lt-control-line: "#877e69"
  lt-edge-ink: "#87560a"
  lt-danger: "#b3321d"
typography:
  display-xl:
    fontFamily: "Sofia Sans Extra Condensed Variable, Sofia Sans Variable, sans-serif"
    fontSize: "clamp(2.75rem, 1.4rem + 4.6vw, 6rem)"
    fontWeight: 800
    lineHeight: 0.9
  display-lg:
    fontFamily: "Sofia Sans Extra Condensed Variable, Sofia Sans Variable, sans-serif"
    fontSize: "clamp(1.75rem, 1.3rem + 1.6vw, 2.5rem)"
    fontWeight: 800
    lineHeight: 1
  display-md:
    fontFamily: "Sofia Sans Extra Condensed Variable, Sofia Sans Variable, sans-serif"
    fontSize: "1.625rem"
    fontWeight: 800
    lineHeight: 1
  title:
    fontFamily: "Sofia Sans Variable, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 700
    lineHeight: 1.2
  body-lg:
    fontFamily: "Sofia Sans Variable, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.55
  body:
    fontFamily: "Sofia Sans Variable, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.55
  small:
    fontFamily: "Sofia Sans Variable, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.45
  code:
    fontFamily: "Martian Mono Variable, ui-monospace, monospace"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.35
    letterSpacing: "0.06em"
    fontVariation: "'wdth' 75"
    fontFeature: "'tnum'"
rounded:
  perf: "2px"
  aperture: "4px"
  sheet: "8px"
spacing:
  gutter: "clamp(1rem, 0.5rem + 2.5vw, 3rem)"
  container-reel: "90rem"
components:
  button-primary:
    backgroundColor: "{colors.edge}"
    textColor: "{colors.on-edge}"
    rounded: "{rounded.aperture}"
    height: "48px"
    padding: "0 20px"
  button-primary-hover:
    backgroundColor: "{colors.edge-hover}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.emulsion}"
    rounded: "{rounded.aperture}"
    height: "48px"
    padding: "0 20px"
  button-secondary-hover:
    backgroundColor: "{colors.acetate}"
  button-lighttable-primary:
    backgroundColor: "{colors.lt-ink}"
    textColor: "{colors.lt-ground}"
    rounded: "{rounded.aperture}"
    height: "48px"
  input:
    backgroundColor: "{colors.leader}"
    textColor: "{colors.emulsion}"
    rounded: "{rounded.aperture}"
    height: "48px"
    padding: "12px 14px"
  input-lighttable:
    backgroundColor: "{colors.lt-surface}"
    textColor: "{colors.lt-ink}"
    rounded: "{rounded.aperture}"
    height: "48px"
  chip:
    backgroundColor: "{colors.acetate}"
    textColor: "{colors.emulsion-muted}"
    rounded: "{rounded.perf}"
    height: "44px"
    padding: "0 14px"
  poster-frame:
    backgroundColor: "{colors.acetate-raised}"
    rounded: "{rounded.aperture}"
  strip:
    backgroundColor: "{colors.lt-surface}"
    textColor: "{colors.lt-ink}"
    rounded: "{rounded.aperture}"
    padding: "12px"
  sheet:
    backgroundColor: "{colors.lt-surface}"
    rounded: "{rounded.sheet}"
    padding: "32px"
---

# Design System: PelicuLed

Fuente de verdad de los tokens: [`src/styles/tokens.css`](src/styles/tokens.css) (Tailwind 4 `@theme`: cada token es una utilidad, p. ej. `bg-leader`, `text-emulsion`, `rounded-aperture`). Este documento explica cómo usarlos; si difieren, manda el CSS.

## Overview

**Creative North Star: "Borde de 35 mm"**

El catálogo es un rollo de copia de 35 mm. Cada título es un cuadro; sus datos (tipo, año, duración, géneros, puntaje) se imprimen como el **código de borde** de la película: monoespaciada condensada, cifras tabulares, filetes finos entre campos. La escena de uso es de noche, con el celular en un cuarto oscuro: la interfaz es el negro de cola de proyección y la imagen del título es lo único que brilla.

Hay dos suelos y cada pantalla vive en uno solo. **Proyección** (negro cálido) para explorar, ver fichas y buscar. **Mesa de luz** (crema iluminado) para Mi lista, donde "apoyás" los cuadros que guardaste. Las pantallas de cuenta son un **set de rodaje** sobre proyección: el formulario va escrito en una claqueta. El ámbar del código de borde es el único acento y siempre significa algo: foco, sección activa, contadores, acción principal.

Rechazos explícitos: hero a sangre con filas neutras infinitas al estilo streaming; la tira de película como borde decorativo (las perforaciones y el código de borde aparecen solo donde llevan estado); gradientes violetas, glassmorphism, glows o neón; cards dentro de cards; emojis como íconos; texto gris sobre color; Inter por defecto.

**Key Characteristics:**

- Un solo acento (ámbar), con significado fijo.
- Tipografía de lata de película: títulos en Sofia Sans Extra Condensed 800 en mayúsculas.
- Metadatos como código de borde (Martian Mono condensada, tabular).
- Esquinas de ventanilla de proyector (4 px), filetes de 1 px, sin sombras en proyección.
- Las imágenes se "revelan": pasan de gris de bajo contraste a color al cargar.

## Colors

Negros y cremas cálidos (nunca grises neutros), un ámbar de acento y tres colores de estado usados con mínima superficie.

### Primary

- **Ámbar de código de borde** (`edge` #eaa53c): foco visible, navegación activa, contadores de cuadros, puntaje y acción principal. 7,9:1 sobre `leader`. Texto sobre ámbar: `on-edge` #1a1206 (8,8:1). Sobre la mesa de luz, el ámbar como texto pasa a `lt-edge-ink` #87560a (5,3:1).

### Neutral (proyección)

- **Negro de cola** (`leader` #0e0d0b): fondo de página.
- **Acetato** (`acetate` #171511) y **acetato elevado** (`acetate-raised` #211e19): superficies; la elevación es un paso de superficie, no una sombra.
- **Filete** (`frameline` #3a352d): solo líneas decorativas (no alcanza 3:1). Los bordes de controles usan `control-line` #756c5b (3,2:1).
- **Emulsión** (`emulsion` #ede6d6, 13,4:1) para texto; `emulsion-muted` (6,3:1) secundario; `emulsion-subtle` (4,9:1) placeholders.

### Neutral (mesa de luz)

- `lt-ground` #f1ebdd fondo, `lt-surface` #fbf7ee superficie, `lt-ink` #1b1813 texto (14,9:1), `lt-muted` #5b5345 secundario (6,4:1), `lt-control-line` #877e69 bordes de control (3,4:1), `lt-line` solo decorativo.

### Estados

- `danger` #f07058 / `lt-danger` #b3321d, `success` #8cc382, `info` #7fb3a8. Siempre acompañados de ícono o texto, nunca solo color.

**The One Accent Rule.** El ámbar no decora. Si algo es ámbar, es interactivo, está activo o es un dato clave (tipo de título, puntaje).

**The One Ground Rule.** Una pantalla es de proyección o de mesa de luz, nunca las dos mezcladas en el contenido. El header y la tab bar son siempre de proyección.

## Typography

**Display Font:** Sofia Sans Extra Condensed (fallback Sofia Sans, sans-serif)
**Body Font:** Sofia Sans (fallback system-ui)
**Label/Mono Font:** Martian Mono, eje `wdth` al 75 % (fallback ui-monospace)

Las tres son variables y self-hosted con Fontsource. Las dos Sofia Sans se precargan en el build; Martian Mono no (entra con `swap` sin mover el layout).

### Hierarchy

- **display-xl** (800, clamp 2,75–6 rem, 0,9, mayúsculas): h1 de página y título destacado.
- **display-lg** (800, clamp 1,75–2,5 rem, 1): títulos de sección y de rieles.
- **display-md** (800, 1,625 rem, 1): estados vacíos, títulos de tiras de Mi lista y de la hoja de cuenta.
- **title** (700, 1,125 rem, 1,2): títulos de bloque y taglines.
- **body-lg** (400, 1,0625 rem, 1,55): sinopsis y leads, máx. 65 caracteres por línea.
- **body** (400, 1 rem, 1,55): texto base; es el mínimo en mobile.
- **small** (400, 0,875 rem, 1,45): ayudas y errores de campo.
- **code** (500, 0,75 rem, 1,35, tracking 0,06 em, mayúsculas, tabular): el código de borde.

**The Can Label Rule.** Todo título en display va en mayúsculas y con `text-balance`; nunca en cursiva, nunca en peso liviano.

**The Edge Code Rule.** Los metadatos de un título se escriben con `<EdgeCode>`, no con texto suelto: mismo orden (tipo, año, duración, géneros, puntaje), filetes entre campos, tipo y puntaje en acento.

## Layout

- **Contenedor:** `container-reel` (90 rem) centrado, con `gutter` fluido (1–3 rem).
- **Breakpoints (mobile-first, `min-width`):** sm 40 rem · md 48 rem · lg 64 rem · xl 80 rem · 2xl 96 rem.
- **Mobile:** tab bar inferior fija (Inicio, Películas, Series, Buscar, Mi lista); el contenido reserva su alto más `safe-area-inset-bottom`. Desde md, navegación y búsqueda en el header.
- **Proporciones:** pósters 2:3; backdrops 16:9, y en desktop "scope" 2.39:1 entre barras negras.
- **Grillas de títulos:** 2 columnas en mobile hasta 6 en xl; rieles horizontales con scroll-snap, contador de cuadros (`04 / 20`) y botones anterior/siguiente.
- **Ritmo:** secciones separadas por 3,5 rem (`gap-14`); dentro de un bloque, 0,75–1,5 rem.
- **Targets:** mínimo 44×44 px; botones de 48 px de alto.

## Elevation & Depth

**Proyección: plana.** No hay sombras: la jerarquía se hace con pasos de superficie (`leader` → `acetate` → `acetate-raised`) y filetes de 1 px. Sin blur (el `backdrop-blur` sobre pósters trababa el pintado y además rompe la regla de "sin glass").

**Mesa de luz: un solo relieve.** `shadow-strip` (`0 1px 2px rgb(27 24 19 / .10), 0 10px 24px -12px rgb(27 24 19 / .22)`) para las tiras de Mi lista y la hoja de cuenta, como papel apoyado sobre la mesa.

**Capas (z-index):** raised 1 · sticky 20 · tabbar 30 · popover 40 · overlay 50 · dialog 60 · toast 70.

## Shapes

- **perf** (2 px): chips, perforaciones, skeletons, subrayados de foco en texto.
- **aperture** (4 px): botones, inputs, pósters, imágenes, tiras. Es el radio por defecto.
- **sheet** (8 px): diálogos, menús y la hoja de cuenta.
- Bordes de 1 px. Los marcos de imagen usan `outline` interno de 1 px (`-outline-offset-1`) para no sumar tamaño.
- Nada de pills ni círculos, salvo el avatar de cuenta.

## Components

- **Button** (`src/components/ui/Button.tsx`, estilos en `buttonClasses.ts`): variantes `primary` (ámbar), `secondary` (borde `control-line`), `ghost`; tamaños `md` 48 px y `sm` 44 px; `iconOnly` exige `aria-label`. Prop `tone="lighttable"` para la mesa de luz (primario en tinta, foco en tinta). `ButtonLink` es un `<a>` real con el mismo aspecto. `aria-pressed` pinta el estado activo (filtros).
- **Field** (`Field.tsx`): label visible siempre, hint o error debajo vinculados con `aria-describedby`, `aria-invalid` con borde de error e ícono. `PasswordField` suma un toggle "Mostrar contraseña" como botón real con `aria-pressed`.
- **Poster** (`Poster.tsx`): marco 2:3 en `acetate-raised`, efecto de revelado, `srcset` con el ancho justo; si no hay imagen, muestra el título sobre un cuadro sin exponer.
- **EdgeCode** (`EdgeCode.tsx`): la línea de metadatos; descarta campos vacíos.
- **Rail** (`Rail.tsx`, columnas en `railColumns.ts`): cuadros enteros por vista (2 a 6 pósters, 3 a 8 retratos). El ancho de columna sale del ancho del riel, así que nunca se corta un cuadro. Encima, una barra lisa con un tramo ámbar que marca lo visible y se arrastra para recorrer el riel; contador de rango (`01–06 / 20`) y botones anterior/siguiente.
- **TitleCard / TitleGrid**: póster + título (h3) + código de borde; la tarjeta que se abre recibe `view-transition-name: title-art`.
- **StatePanel** (`StatePanel.tsx`): vacío, error y "no encontrado": título, una oración, una salida. Borde discontinuo. `role="alert"` solo en errores.
- **Dialog** (`Dialog.tsx`, Headless UI): hoja `sheet` sobre scrim `leader/85`, foco atrapado, Escape y botón "Cerrar".
- **Skeleton**: mismas cajas que el contenido real (medidas en `lh` del tipo real), pulso `expose` / `expose-light`. Un skeleton que no coincide es un bug de CLS.
- **Strip** (Mi lista): póster chico + título display-md + código de borde + fecha de guardado + "Quitar" (con deshacer).
- **Claqueta** (`features/auth/AuthLayout.tsx`): pantallas de cuenta. Barras rayadas crema y negro (el único lugar con contraste puro), campos de tiza PROD. / ESCENA / TOMA / FECHA y el formulario adentro. Cada envío cierra la barra superior y la vuelve a abrir; un intento fallido sube la TOMA. Al lado, el muro de afiches de la semana (`PosterWall.tsx`) derivando en columnas atenuadas; en mobile, una tira.

**Movimiento.** Duraciones 140 / 220 / 360 ms y 700 ms para el revelado; easing `ease-out` rápido. La firma es la **transición de ventanilla**: el póster se expande hasta el backdrop proyectado al abrir un título (View Transitions). El resto usa **Motion** (`motion/react` con `LazyMotion`, tokens en `src/lib/motion.ts`):

- Las pantallas entran con una subida corta de 10 px, solo en navegación interna (nunca en la carga inicial ni encima de la transición de ventanilla).
- Grillas y rieles se revelan al entrar en pantalla, escalonados por columna; la primera fila se pinta de una.
- El marcador de guardado hace un pulso; el contador del riel rueda; las tiras de Mi lista se reacomodan con layout animations; la claqueta golpea en cada envío.

Con `prefers-reduced-motion`, Motion deja solo fundidos y las derivas en CSS se detienen. En navegadores automatizados (e2e, auditorías) Motion salta directo al estado final.

## Do's and Don'ts

**Do**

- Usar el ámbar solo para foco, estado activo, contadores, dato clave o la acción principal.
- Escribir metadatos con `<EdgeCode>` y títulos en display mayúsculas.
- Dar a cada skeleton la geometría exacta del contenido.
- Mantener 44 px de target y foco visible de 2 px (ámbar en proyección, tinta en mesa de luz).
- Escribir en español rioplatense, con voseo y verbos concretos ("Guardá", "Revisá tu conexión").

**Don't**

- No usar perforaciones ni tira de película como adorno: solo donde marcan posición o estado.
- No agregar sombras, blur, glass, glows ni gradientes en proyección.
- No mezclar los dos suelos dentro del contenido de una pantalla.
- No usar `frameline` ni `lt-line` para bordes de controles (no llegan a 3:1).
- No reutilizar un mismo nombre de token en dos espacios de Tailwind (`--text-edge` chocaba con `--color-edge`; por eso el tamaño se llama `code`).
