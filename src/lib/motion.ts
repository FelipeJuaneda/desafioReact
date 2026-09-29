// Motion tokens for Motion (motion.dev), mirroring the CSS ones in src/styles/tokens.css.

/** --ease-out: quick start, long settle. The house curve for anything entering. */
export const EASE_OUT = [0.16, 1, 0.3, 1] as const;
/** --ease-in-out: for things that travel and stop (the slate's clapper). */
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;

/** Seconds, same steps as --duration-fast / base / slow. */
export const DURATION = { fast: 0.14, base: 0.22, slow: 0.36 } as const;

/** Content arriving: a short rise with a fade. Small distances read as "settling", not flying. */
export const RISE = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: DURATION.slow, ease: EASE_OUT },
} as const;
