import type { Variants } from 'motion/react';

// The page has exactly one orchestrated entrance — the hero, on load.
// Scroll-triggered reveals are deliberately absent: a page where every
// section fades in never settles, and the effect reads as templated.

// Exponential ease-out. Not `ease` — that is the browser default and
// cubic-bezier(0.25, 0.1, 0.25, 1) is literally its definition.
const EASE_OUT = [0.16, 1, 0.3, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.42, ease: EASE_OUT },
  },
};

export const stagger = (delay = 0.06): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: delay },
  },
});
