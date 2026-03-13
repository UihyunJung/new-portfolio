import type { Variants } from 'motion/react';

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  },
};

export const stagger = (delay = 0.1): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: delay },
  },
});
