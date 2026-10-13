import { m } from "motion/react";
import { useEffect, useState } from "react";

/**
 * The countdown leader at the head of a film reel (3, 2, 1, with the sweeping hand) while the
 * search runs. It only lasts as long as the request; with reduced motion the hand stays still.
 */
export const LeaderCountdown = () => {
  const [count, setCount] = useState(3);
  useEffect(() => {
    const timer = setInterval(() => setCount((n) => (n === 1 ? 3 : n - 1)), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div role="status" className="grid justify-items-center gap-5 py-14">
      <svg aria-hidden viewBox="0 0 120 120" className="size-36 text-frameline">
        <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="60" cy="60" r="40" fill="none" stroke="currentColor" strokeWidth="1" />
        <path d="M60 2v116M2 60h116" stroke="currentColor" strokeWidth="1" />
        <m.path
          d="M60 60 L60 6"
          stroke="var(--color-edge)"
          strokeWidth="3"
          strokeLinecap="round"
          style={{ originX: "60px", originY: "60px" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, ease: "linear", repeat: Infinity }}
        />
        <text
          x="60"
          y="60"
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-emulsion font-display text-[3.25rem] font-extrabold"
        >
          {count}
        </text>
      </svg>
      <p className="text-body text-emulsion-muted">Buscando entre miles de títulos…</p>
    </div>
  );
};
