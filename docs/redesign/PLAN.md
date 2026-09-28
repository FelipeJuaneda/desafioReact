# PelicuLed: plan de rediseño

Estado: **Fase 1 entregada, esperando aprobación** (2026-09-28). Rama: `redesign`.
Contexto de producto: [`PRODUCT.md`](../../PRODUCT.md). Lámina visual: [`lamina-35mm.html`](./lamina-35mm.html).

## Decisiones confirmadas

| # | Decisión | Estado |
|---|---|---|
| 1 | Favoritos por usuario en Firestore, con migración desde localStorage | Confirmado |
| 2 | Navegación pública; cuenta solo para "Mi lista" | Confirmado |
| 3 | Alcance: películas + series; personas solo como ficha desde el reparto | Confirmado |
| 4 | Rotar key de TMDB y restringir la de Firebase | **Pendiente (acción del dueño)** |
| 5 | Sacar login con Facebook; quedan email y Google | Confirmado |
| 6 | `.env.local` para desarrollo | **Pendiente (acción del dueño)** |
| 7 | Dirección visual: Borde de 35 mm | Confirmado |
| 8 | TypeScript 6.0 | Confirmado |

## 1. Dirección visual: Borde de 35 mm

**Tesis.** El catálogo como un rollo de copia de 35 mm: cada título es un cuadro con su código de borde. Nada en PelicuLed reproduce películas; el producto vive en el momento previo, cuando la copia está en el proyector. Por eso el mundo sale del material físico del cine y no de las apps de streaming.

**Qué rechaza.** El default de la categoría (backdrop a sangre + filas infinitas de posters neutros, tipo Netflix) y el cliché de "tira de película como borde decorativo". Las perforaciones y los códigos de borde solo aparecen donde cargan información:

- **Pista de perforaciones = indicador de scroll** del carrusel. Son 4 perforaciones por cuadro, como en el 35 mm real; se iluminan las de los cuadros visibles.
- **Código de borde = metadatos.** Tipo, año, duración, géneros y puntaje en una línea monoespaciada con cifras tabulares, legible de un vistazo.
- **Contador de cuadros = posición** (`04 / 20`).

**Dos fondos con significado.**
- *Proyección* (negro de cola cálido): explorar, detalle, búsqueda. La escena de uso es de noche, con el teléfono en un cuarto oscuro.
- *Mesa de luz* (crema iluminado): Mi lista y autenticación, donde "apoyás" los cuadros que guardaste. Rompe el cliché de "fondo negro + un acento".

**Interacción firma.** La *transición de ventanilla*: el cuadro del poster se expande hasta el backdrop proyectado al abrir un título (View Transitions API con elemento compartido; con reduced motion, un crossfade).

**Motion.** Avance intermitente (pasos cortos en contadores, easing de salida rápida en cuadros). Las imágenes **se revelan**: pasan de gris de bajo contraste a color pleno en lugar de aparecer de golpe.

**Evita explícitamente.** Gradientes violetas, glassmorphism, glows o neón, cards dentro de cards, emojis como íconos, texto gris sobre color y Inter por defecto.

## 2. Tokens

### Color (contraste AA medido contra la superficie más clara donde se usa)

| Token | Valor | Uso | Contraste |
|---|---|---|---|
| `leader` | `#0e0d0b` | Fondo proyección | — |
| `acetate` | `#171511` | Superficie | — |
| `acetate-raised` | `#211e19` | Superficie elevada, skeleton | — |
| `frameline` | `#3a352d` | Líneas decorativas (no esenciales) | — |
| `control-line` | `#756c5b` | Bordes de inputs y botones secundarios | 3,2:1 |
| `emulsion` | `#ede6d6` | Texto principal | 13,4:1 |
| `emulsion-muted` | `#a89f8c` | Texto secundario | 6,3:1 |
| `emulsion-subtle` | `#948b78` | Placeholder, texto terciario | 4,9:1 |
| `edge` | `#eaa53c` | **Único acento:** foco, nav activa, contadores, acción principal | 7,9:1 |
| `edge-hover` | `#f2b659` | Hover del primario | — |
| `on-edge` | `#1a1206` | Texto sobre ámbar | 8,8:1 |
| `danger` | `#f07058` | Errores | 5,7:1 |
| `success` | `#8cc382` | Confirmaciones | 8,1:1 |
| `info` | `#7fb3a8` | Informativo (uso mínimo) | 7,1:1 |
| `lt-ground` / `lt-surface` | `#f1ebdd` / `#fbf7ee` | Fondo y superficie mesa de luz | — |
| `lt-ink` | `#1b1813` | Texto sobre mesa de luz | 14,9:1 |
| `lt-muted` | `#5b5345` | Texto secundario claro | 6,4:1 |
| `lt-control-line` | `#877e69` | Bordes de controles claros | 3,4:1 |
| `lt-edge-ink` | `#87560a` | Acento como texto sobre claro | 5,3:1 |
| `lt-danger` | `#b3321d` | Errores sobre claro | 5,2:1 |

Estados: hover = paso de superficie o `edge-hover`; presionado/activo = borde y texto `edge`; deshabilitado = `acetate-raised` + `emulsion-subtle`; foco = anillo `edge` de 2px con offset de 2px (sobre claro, `lt-ink`).

### Tipografía (autohospedada con `@fontsource-variable`)

| Rol | Fuente | Por qué |
|---|---|---|
| Display | **Sofia Sans Extra Condensed** 700–800, mayúsculas | La voz de las etiquetas de latas y claquetas: condensada, con carácter y con títulos largos que entran en mobile |
| Lectura | **Sofia Sans** 400/650 | Misma familia, humanista y muy legible en español |
| Código de borde | **Martian Mono** (ancho 75), cifras tabulares | Datos y medidas, no disfraz "técnico": año, duración, puntaje, contadores |

| Paso | Tamaño | Línea | Uso |
|---|---|---|---|
| `display-xl` | `clamp(2.75rem, 1.4rem + 4.6vw, 6rem)` | 0,9 | Título destacado y detalle |
| `display-lg` | `clamp(1.75rem, 1.3rem + 1.6vw, 2.5rem)` | 1 | Títulos de sección |
| `display-md` | `1.625rem` | 1 | Estados vacíos y strips de Mi lista |
| `title` | `1.125rem` / 700 | 1,2 | Títulos de bloque |
| `body-lg` | `1.0625rem` | 1,55 | Sinopsis, lead |
| `body` | `1rem` | 1,55 | Texto base (mínimo en mobile) |
| `small` | `0.875rem` | 1,45 | Ayudas y errores de campo |
| `edge` | `0.75rem`, tracking 0,06em | 1,35 | Código de borde |

Medida de lectura: 60–70ch. Tracking mínimo −0,01em en display.

### Espaciado, forma, profundidad y capas

| Categoría | Valores |
|---|---|
| Espaciado (base 4px) | 0 · 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 |
| Gutter | `clamp(1rem, .5rem + 2.5vw, 3rem)` |
| Ancho máximo | 90rem |
| Radios | `perf` 2px (chips, perforaciones) · `aperture` 4px (cards, botones, inputs, imágenes) · `sheet` 8px (diálogos y hojas) |
| Sombras | Proyección: sin sombras, la elevación es cambio de superficie. Mesa de luz: `0 1px 2px rgb(27 24 19/.10), 0 10px 24px -12px rgb(27 24 19/.22)` |
| Z-index | base 0 · raised 1 · sticky 20 · tabbar 30 · popover 40 · overlay 50 · dialog 60 · toast 70 |
| Breakpoints (mobile-first, `min-width`) | sm 40rem · md 48rem · lg 64rem · xl 80rem · 2xl 96rem |
| Targets | mínimo 44×44px; botones de 48px de alto |

### Motion

| Token | Valor | Uso |
|---|---|---|
| `dur-fast` | 140ms | Hover, estados de botón |
| `dur-base` | 220ms | Menús, perforaciones |
| `dur-slow` | 360ms | Diálogos, escala de cuadro |
| `dur-develop` | 700ms | Revelado de imágenes |
| `ease-out` | `cubic-bezier(.16, 1, .3, 1)` | Entradas (exponencial) |
| `ease-in-out` | `cubic-bezier(.65, 0, .35, 1)` | Transiciones de ida y vuelta |
| `advance` | `steps(2, end)` | Contadores y perforaciones |

Con `prefers-reduced-motion`: sin escalas ni desplazamientos. Los cambios de estado se mantienen como fundidos instantáneos, así que el feedback no se pierde.

### Íconos
`@remixicon/react` (SVG, se importa cada ícono por separado), en línea y peso uniformes. "Guardar" usa un marcador (bookmark) y no un corazón: es una lista para ver después, no un "me gusta".

## 3. Stack

| Hoy | Propuesta | Breaking changes relevantes |
|---|---|---|
| CRA 5 + react-scripts | **Vite 8** | `REACT_APP_*` → `VITE_*`, `index.html` en la raíz, sin `%PUBLIC_URL%` |
| React 18.2 | **React 19.3** + React Compiler | Metadatos `<title>`/`<meta>` nativos por página, `useActionState` en formularios, `ref` como prop |
| react-router-dom 6.3 | **react-router 8** | `react-router-dom` [ya no existe](https://remix.run/blog/react-router-v8); requiere React ≥ 19.2.7 y Node ≥ 22.22; solo ESM |
| Jest (react-scripts) | **Vitest 5** + Testing Library 16 + MSW 3 | [Vitest 5](https://vitest.dev/blog/vitest-5.html) requiere Vite ≥ 6.4 y Node ≥ 22.12 |
| — | **Playwright** (e2e) | Contra los emuladores de Firebase |
| JavaScript | **TypeScript 6.0** | TS 7 no es compatible todavía con `typescript-eslint` (peer `<6.1`) |
| ESLint de CRA | **ESLint 10** (flat config) + typescript-eslint + react-hooks + jsx-a11y, **Prettier** + plugin de Tailwind | — |
| Tailwind 3.1 + forms | **Tailwind 4.3** (`@tailwindcss/vite`, tokens en `@theme`) | Config en CSS; renombres (`shadow-sm` → `shadow-xs`, `outline-none` → `outline-hidden`, `ring` pasa a 1px); piso de navegadores Safari 16.4 / Chrome 111 / Firefox 128 |
| Headless UI 1.6 | **Headless UI 2.2** | Componentes planos (`PopoverButton`, `DialogPanel`), nueva API de transiciones |
| Heroicons v1 + Remix (fuente) + SVG sueltos | **@remixicon/react** | Una sola librería |
| Swiper 8 | **Rail propio** (scroll-snap nativo) | Se elimina la dependencia |
| react-paginate | **"Cargar más"** con `useInfiniteQuery` | Se elimina la dependencia |
| @szhsin/react-accordion | Grilla de trailers + `Dialog` | Se elimina la dependencia |
| react-scroll, @formkit/auto-animate, web-vitals | — | Se eliminan (no se usan o están mal usadas) |
| fetch en componentes | **TanStack Query 5** | Caché, dedupe, reintentos, favorito optimista |
| Firebase 9 (Auth + Analytics) | **Firebase 12** (Auth + Firestore) | Se quitan Analytics y Facebook; errores `auth/invalid-credential` mapeados |
| sonner 1 | **sonner 2** | — |
| Key de TMDB en el bundle | **Proxy serverless en Vercel** `api/tmdb/[...path]` con token v4 del lado servidor y `Cache-Control` | En dev, proxy de Vite que inyecta el token |
| `desafio-react` | **`peliculed`** | — |

**Por qué "Cargar más" y no paginación ni scroll infinito automático.** Explorar un catálogo no tiene "página 437": los números no significan nada para quien busca qué ver. El scroll infinito automático rompe el footer, la navegación por teclado y la sensación de progreso. Un botón "Cargar más" (con contador "40 de 1.240") es accesible y predecible, y conserva la posición gracias a la caché. Los filtros (género, orden, año, puntaje mínimo) viven en la URL y se resuelven del lado de TMDB, no filtrando la página actual como hoy.

**Búsqueda.** Input con debounce de 300ms, resultados combinados de películas y series (`search/multi`), estado "sin resultados" con sugerencias (géneros populares) y la query en la URL (`/buscar?q=`).

## 4. Arquitectura

```
api/
  tmdb/[...path].ts        proxy Vercel (token server-side, caché en el edge)
src/
  app/                     main.tsx, router.tsx (rutas lazy), providers.tsx, error-boundary
  routes/                  una carpeta por pantalla, componente + loader de datos
    home/ movies/ series/ title/ person/ search/ my-list/ auth/ not-found/
  features/
    auth/                  AuthProvider, useAuth, RequireAuth, firebase-errors.ts, forms
    catalog/               queries TMDB (discover, trending, genres), TitleCard, TitleGrid, FilterBar
    title/                 TitleHero, CastRail, VideoGallery, EdgeCode
    search/                useSearch, SearchField, SearchResults
    favorites/             repositorio Firestore, useFavorites (optimista), migración local→nube, SaveButton
    people/                PersonHeader, Filmography
  components/ui/           Button, IconButton, Field/Input, Dialog, Menu, Tabs, Toast, Skeleton,
                           EmptyState, ErrorState, Rail, Poster (lazy, srcset TMDB, fallback, revelado)
  layouts/                 AppLayout (header, tab bar mobile, footer con atribución TMDB), AuthLayout
  services/
    tmdb/                  client.ts, endpoints.ts, images.ts (tamaños w185/w342/w500/w780/w1280)
    firebase/              app.ts, auth.ts, firestore.ts
  hooks/                   useDebouncedValue, useMediaQuery, usePrefersReducedMotion
  lib/                     format (duración, año, puntaje es-AR), slug, cn
  styles/                  tokens.css (@theme), base.css (fuentes, selección, scrollbar, foco)
  types/                   tmdb.ts, favorites.ts
  test/                    setup, handlers MSW, fixtures
e2e/                       Playwright
firestore.rules · firebase.json (emuladores) · .env.example · vercel.json
```

**Convenciones.** Alias `@/` → `src/`. Componentes en PascalCase (`TitleCard.tsx`), hooks `useX.ts`, carpetas en kebab-case, un componente por archivo, tests junto al código (`*.test.tsx`). Cada feature exporta su API pública desde `index.ts` y nadie importa internals de otra feature. Los componentes de UI no conocen TMDB ni Firebase.

**Modelo de datos (Firestore).**
`users/{uid}/favorites/{mediaType}-{tmdbId}` → `{ tmdbId: number, mediaType: "movie" | "tv", title: string, posterPath: string | null, releaseDate: string | null, voteAverage: number, addedAt: Timestamp }`.
Reglas: solo el dueño lee y escribe; se validan los tipos y los campos permitidos. Migración: al primer login, los favoritos de `localStorage` (formato viejo) se suben en batch y se limpia la clave local.

**Rutas (con redirecciones desde las viejas).**

| Nueva | Vieja | Acceso |
|---|---|---|
| `/` | `/` | Pública (antes exigía login) |
| `/peliculas?genero=&orden=` | `/popularFilms`, `/genre/:id` | Pública |
| `/series?genero=&orden=` | `/popularTv` | Pública |
| `/pelicula/:id-:slug` | `/film/:id` | Pública |
| `/serie/:id-:slug` | `/tvShow/:id` | Pública |
| `/persona/:id-:slug` | — | Pública |
| `/buscar?q=` | — | Pública |
| `/mi-lista` | `/favoriteList` | Requiere cuenta, redirige a `/ingresar?volver=` |
| `/ingresar` · `/registro` · `/recuperar` | `/login` · `/register` · `/recoverPassword` | Públicas |
| `*` | `*` | 404 "Fin del rollo" |

`/popularPeople` redirige a `/`.

## 5. Plan por fases

### Fase 2: Base y estructura (commits chicos, conventional commits)
1. `chore: rename package to peliculed`
2. `build: migrate from CRA to Vite 8` (sin cambiar comportamiento; la app anda igual)
3. `build: upgrade to React 19 and react-router 8`
4. `build: add TypeScript 6 and migrate files` (conversión por carpeta)
5. `chore: configure ESLint 10 flat config and Prettier`
6. `test: replace Jest with Vitest, Testing Library and MSW`
7. `refactor: reorganize into app/routes/features/components/services`
8. `feat(api): add TMDB proxy on Vercel and typed TMDB client`
9. `refactor: move data fetching to TanStack Query`
10. `feat(favorites): Firestore repository with rules and local migration` (necesita Firestore habilitado)
11. `chore(security): env vars, .env.example, gitignore .env, remove Analytics`
12. `chore: remove unused dependencies and dead code`
13. `style: Tailwind 4 with design tokens and self-hosted fonts`
14. `feat(ui): accessible base components` (Button, Field, Dialog, Menu, Tabs, Toast, Skeleton, Empty/Error, Rail, Poster)
15. `fix:` en commits separados para los bugs críticos: ProtectedRoute, menú mobile, géneros de series, carga del detalle, errores de Firebase

Cierre: build y tests en verde, la app andando igual que antes pero sobre la base nueva.

### Fase 3: Rediseño pantalla por pantalla
Orden: shell (header, tab bar, footer) → Home → Películas/Series con filtros → Búsqueda → Detalle de título → Persona → Mi lista → Ingresar/Registro/Recuperar → 404 y errores.
En cada pantalla: estados de carga (skeletons con la forma del contenido), vacío, error y éxito; posters 2:3 con `srcset` del tamaño justo y fallback; accesibilidad AA; `critique` y `polish` de impeccable; capturas en 375, 768 y 1440.

### Fase 4: Calidad y cierre
Code splitting por ruta, presupuesto de bundle, Lighthouse ≥ 90 (performance y accesibilidad), metadatos y Open Graph por página, favicon y wordmark nuevos, tests de flujos críticos (login, búsqueda, favoritos, detalle), pasada de consistencia, finish review de impeccable y `DESIGN.md`, README profesional con capturas y decisiones.

## 6. Riesgos y dependencias externas

- **Keys:** hasta que se rote la de TMDB, la vieja sigue en el historial público. Recomiendo rotarla en vez de reescribir el historial.
- **Firestore:** hay que habilitarlo en la consola de Firebase y desplegar las reglas (`firebase deploy --only firestore:rules`).
- **Vercel:** Node ≥ 22.22 en el proyecto, framework "Vite", variables `TMDB_READ_TOKEN` (servidor) y `VITE_FIREBASE_*` (cliente).
- **Piso de navegadores** de Tailwind 4 (Safari 16.4+): aceptable para un producto de 2026.
- **Tiempos:** TypeScript suma entre 1 y 1,5 días dentro de la Fase 2.
