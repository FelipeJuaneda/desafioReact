import { LazyMotion, MotionConfig, MotionGlobalConfig } from "motion/react";
import type { ReactNode } from "react";

// Automated browsers (e2e, audits) get final states at once, so nothing is measured mid-fade.
if (typeof navigator !== "undefined" && navigator.webdriver) {
  MotionGlobalConfig.skipAnimations = true;
}

const loadFeatures = () =>
  import("@/app/motionFeatures").then((module) => {
    // Lets tests know entrances can run (until now `m` elements sit in their initial state).
    document.documentElement.dataset.motion = "ready";
    return module.default;
  });

/**
 * Motion for the whole app. Features load lazily (`m` components only), so the animation engine
 * stays out of the first-visit bundle. `reducedMotion="user"` turns movement into plain fades
 * for people who ask their system for less motion.
 */
export const MotionProvider = ({ children }: { children: ReactNode }) => (
  <MotionConfig reducedMotion="user">
    <LazyMotion features={loadFeatures} strict>
      {children}
    </LazyMotion>
  </MotionConfig>
);
