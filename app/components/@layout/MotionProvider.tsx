'use client';

import { LazyMotion, MotionConfig, domAnimation } from 'motion/react';

export default function MotionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // The CSS `prefers-reduced-motion` block only reaches CSS transitions.
  // motion/react drives inline transforms, so it needs telling separately.
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation}>{children}</LazyMotion>
    </MotionConfig>
  );
}
