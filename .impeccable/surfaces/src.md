---
version: 1
slug: "src"
primary_target: "src"
related_targets: []
---

# Surface brief: PelicuLed app (all routes)

## Scope and mode
Whole web app. Home and title detail are Experience (the titles lead); listings, search, my list and auth are Operate inside the same world (task clarity outranks expression there).

## Audience, job, constraints
Spanish-speaking viewers deciding what to watch (phone at night on the couch, desktop for longer sessions). Browse is public; account only for "Mi lista". Real TMDB content only; no invented claims. WCAG 2.2 AA, 44px targets, reduced motion honored.

## Direction contract
THESIS: The catalog as a reel of 35 mm print: every title is a frame with its edge code. Refuses the streaming default (full-bleed hero plus endless neutral rows) and refuses filmstrip-as-border decoration: perforations and edge codes only appear where they carry state.

OWN-WORLD: Two grounds: projection (warm leader black #0e0d0b, acetate surfaces #171511/#211e19, emulsion cream text #ede6d6) and light table (#f1ebdd, for Mi lista and auth). Edge-code amber #eaa53c is the only accent: focus, active nav, frame counters, primary action. Sofia Sans Extra Condensed for titles like can labels, Sofia Sans for reading, Martian Mono condensed for edge-code metadata in tabular figures. Aperture corners (4px), 1px frame lines, no glows, no glass.

STORY: A visitor lands on the reel, sees what is showing now, scrubs through frames, opens one, and understands it in one glance (year, runtime, genres, rating printed as the edge code). Saving a title lays its frame on the light table.

FIRST VIEWPORT: Home: the current featured title projected in scope ratio (2.39:1 backdrop between black leader bars), title set large in extra condensed caps on the lower bar, edge-code metadata line beneath, primary action "Ver ficha" and secondary "Guardar". Below, the first rail begins, its perforation track acting as the scroll indicator with a frame counter (04 / 20).

FORM: Borde de 35 mm, rank 1 on the ordered list (IMPECCABLE'S PICK chosen by the user over the assigned rank-3 marquee), seed key 2c7eeca9. Signature interaction: the gate transition, a poster frame expands into the projected backdrop when opening a title (View Transitions, shared element; crossfade under reduced motion). Motion grammar: intermittent advance (short steps for counters, quick-out easing for frames), images develop from low-contrast gray to full color on load.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Unresolved
- Exact type scale and fluid clamps get tuned against real TMDB titles in Phase 3.
- Logo/wordmark to be designed in Phase 3 (popcorn icon is not binding).
