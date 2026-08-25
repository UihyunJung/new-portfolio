'use client';

import { useEffect, useRef } from 'react';

/** "10+" → counts 10 and keeps the "+". "E2E" → nothing to count. */
const LEADING_NUMBER = /^(\d+)(.*)$/;
const DURATION = 1100;

interface StatValueProps {
  /** The figure exactly as the translation file writes it. */
  children: string;
  className?: string;
}

/**
 * A statistic that counts up the first time it is scrolled into view.
 *
 * Rendered at its FINAL value, so the figure is correct on the server,
 * without JavaScript, for a crawler, and for a reduced-motion reader. The
 * count is only armed for a figure still below the fold at mount — one
 * already under the reader's eye has nothing to animate, and rewinding it
 * to zero would just be a flicker.
 *
 * The frames are written straight to the text node rather than through
 * state: sixty React renders per second to move one integer is the wrong
 * trade, and the node's content is otherwise static, so nothing else is
 * competing to own it.
 */
export default function StatValue({ children, className }: StatValueProps) {
  const match = LEADING_NUMBER.exec(children);
  const target = match ? Number(match[1]) : null;
  const suffix = match ? match[2] : '';
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (el === null || target === null) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Already on screen: leave the figure alone.
    if (el.getBoundingClientRect().top < window.innerHeight * 0.85) return;

    el.textContent = `0${suffix}`;

    let frame = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();

        const begin = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - begin) / DURATION);
          // Exponential ease-out — the curve --ease-out approximates.
          const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
          el.textContent = `${Math.round(target * eased)}${suffix}`;
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
      el.textContent = `${target}${suffix}`;
    };
  }, [target, suffix]);

  if (target === null) {
    return <span className={className}>{children}</span>;
  }

  return (
    <span ref={ref} className={className}>
      {`${target}${suffix}`}
    </span>
  );
}
