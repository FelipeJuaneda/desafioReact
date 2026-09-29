# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

People who want to discover films and series, check the details of a title, and keep the ones they care about for later. Mixed usage: phone on the couch deciding what to watch tonight, and desktop for longer browsing sessions. Spanish-speaking audience (Rioplatense register).

It is also a portfolio piece: recruiters and developers evaluate it as evidence of product, design, and engineering judgment.

## Product Purpose

PelicuLed lets anyone explore films and series (catalog from TMDB), read a rich detail page (synopsis, runtime, genres, rating, cast, trailers), and save titles to a personal list that follows them across devices. Success: a visitor finds something worth watching in a few minutes, and a signed-in user trusts their list to be there next time.

## Positioning

A catalog explorer with its own cinematic identity, not a streaming-service clone: nothing here plays a film, so the experience is about discovery and anticipation, the moment before the lights go down. It must not imitate Netflix, Prime Video, or Disney+.

## Operating Context

- Browsing is public; an account is only needed to keep a personal list (confirmed 2026-09-28).
- Sign-in methods: email/password and Google. Facebook sign-in is being removed (confirmed 2026-09-28).
- Primary content: films and series. People appear as cast of a title and have their own profile page reached from the cast; there is no standalone "popular people" section (confirmed 2026-09-28).
- Data comes from the TMDB API (Spanish locale); TMDB attribution is required by its terms.

## Capabilities and Constraints

- Discover: popular / trending films and series, browse by genre, search.
- Detail: title, poster, backdrop, year, runtime or seasons, genres, rating, synopsis, cast, trailers.
- Personal list ("favoritos"): stored per user in Firestore, replacing the current device-only localStorage list; favorites already saved on a device migrate on first sign-in (confirmed 2026-09-28).
- Auth: Firebase Authentication; Firebase error messages shown in clear Spanish.
- Hosting: Vercel (current deploy at desafio-react-pi.vercel.app).
- Undecided: whether the old public git history gets rewritten after rotating the leaked keys (user action).

## Brand Commitments

- Name: PelicuLed (capital P and L). The existing popcorn icon is not binding.
- Tone requested by the owner: cinematic, immersive, with personality, but clean and usable; an identity of its own.
- Language: Spanish, Rioplatense voseo in UI copy.

## Evidence on Hand

- Real catalog content, imagery, and metadata via TMDB (posters, backdrops, profile photos, trailers).
- No testimonials, user counts, or press exist; none may be invented.

## Product Principles

1. Discovery over consumption: every screen should help decide what to watch next, not pretend to play it.
2. The title is the hero: posters and backdrops carry the emotion; interface chrome stays out of their way.
3. Public by default, account by choice: never gate browsing behind sign-in.
4. Fast and honest states: loading, empty, and error states are designed, never blank.
5. Built like a real product: accessible, tested, and maintainable enough to be read as a code sample.

## Accessibility & Inclusion

WCAG 2.2 AA: text contrast, visible focus, full keyboard operation (including carousels), labelled forms, meaningful alt text on posters, touch targets of at least 44px, and `prefers-reduced-motion` respected.
