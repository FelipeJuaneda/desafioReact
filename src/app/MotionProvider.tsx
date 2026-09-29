import { LazyMotion, MotionConfig } from "motion/react";
import type { ReactNode } from "react";

const loadFeatures = () => import("@/app/motionFeatures").then((module) => module.default);

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
