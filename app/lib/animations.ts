import type { Variants } from 'motion/react';

// Shared motion/react variants.
//
// NOTHING ON THE PAGE CURRENTLY USES THEM. The whole motion system moved to
// CSS — `animation-timeline: view()` / `scroll()` for anything tied to
// scroll position (see @utilities/_mixins.scss), and plain keyframes with
// delays for the hero's load entrance (see HeroSection.module.scss). The
// reason is not taste:
//
//   motion writes a variant's `initial` state into the SERVER HTML. An
//   entrance that fades in from `opacity: 0` therefore ships a hero whose
//   description, calls to action and spec panel are invisible until
//   hydration runs — and permanently invisible if it never does. CSS
//   inverts that: the base rule is the resting state, the keyframes move
//   *from* hidden, and the markup is complete on its own.
//
// The file is kept because motion/react is still installed and provided by
// MotionProvider, and because these are the right shapes to reach for when
// JS animation genuinely earns its place — an interruptible drag, a shared
// layout transition, an exit that has to wait for its element. The rule
// above is the constraint on any new variant: DO NOT animate opacity from
// 0 on content that is present in the first paint.

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
