# PelicuLed · Logo "Línea de cuadro"

Wordmark dibujado a medida (no es una tipografía): letras cuadradas, cortadas por la línea de cuadro. Arriba crema, abajo ámbar. El ícono es la P sola.

## Archivos

logo/ — wordmark "PelicuLed" (SVG, contornos, viewBox de altura 100 = altura de la P)

- peliculed-logo-color-fondo-oscuro.svg → uso principal (interfaz oscura)
- peliculed-logo-color-fondo-claro.svg → sobre #ede6d6 (ámbar profundo #9a5a0a)
- peliculed-logo-mono-crema.svg / peliculed-logo-mono-negro.svg → un solo color

icono/ — la P sola, fondo transparente, cuadrado 100×100 (mismas 4 variantes)

web/

- favicon.svg, favicon-16.png, favicon-32.png, favicon-48.png
- apple-touch-icon.png (180)
- icon-192.png, icon-512.png
- icon-maskable.svg / icon-maskable-512.png (lo importante dentro del 80 % central)
- og-image-1200x630.png (tarjeta para compartir)

## Colores

- Fondo #0e0d0b · Crema #ede6d6 · Ámbar #eaa53c · Ámbar sobre claro #9a5a0a

## Instrucciones para Claude Code

1. Reemplazar el logo actual (cuadro de película con perforaciones y el wordmark "Pelicu" + "Led" en texto vivo) por `logo/peliculed-logo-color-fondo-oscuro.svg` en todo el sitio. Buscar todas las apariciones del logo anterior (componentes, header, footer, splash, emails, etc.).
2. Header: barra de 60 px, logo a la izquierda con `height: 28px; width: auto`. Mantener `alt="PelicuLed"`.
3. Sobre fondos claros usar la versión `-fondo-claro`; en usos de un solo color, las `mono`.
4. Copiar `web/*` a la carpeta pública y actualizar el `<head>`:

```html
<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
<link rel="icon" href="/favicon-32.png" sizes="32x32" type="image/png" />
<link rel="icon" href="/favicon-16.png" sizes="16x16" type="image/png" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
<meta name="theme-color" content="#0e0d0b" />
<meta property="og:image" content="/og-image-1200x630.png" />
<meta name="twitter:card" content="summary_large_image" />
```

5. En el web manifest:

```json
"icons": [
  { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
  { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" },
  { "src": "/icon-maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
],
"background_color": "#0e0d0b",
"theme_color": "#0e0d0b"
```

6. Borrar los archivos del logo anterior que queden sin uso.
