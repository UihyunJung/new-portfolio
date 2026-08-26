'use client';

import { LazyMotion, MotionConfig, domAnimation } from 'motion/react';

export default function MotionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // CSS의 `prefers-reduced-motion` 블록은 CSS 전이에만 닿는다.
  // motion/react는 인라인 transform을 다루므로 따로 알려 줘야 한다.
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation}>{children}</LazyMotion>
    </MotionConfig>
  );
}
