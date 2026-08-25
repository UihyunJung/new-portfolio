'use client';

import { useEffect, useRef } from 'react';

/**
 * Publishes the cursor's position inside an element as CSS variables:
 * `--pointer-x`, `--pointer-y` and `--pointer-on` (1 while the cursor is
 * over it, 0 otherwise).
 *
 * What the element does with them is the stylesheet's business — a
 * spotlight, a tint, a parallax offset. Nothing renders from React, so a
 * pointer moving across the hero never triggers a re-render.
 */
export default function usePointerField<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!fine.matches || calm.matches) return;

    let frame = 0;

    const onMove = (event: PointerEvent) => {
      const { clientX, clientY } = event;
      if (frame) return;

      frame = requestAnimationFrame(() => {
        frame = 0;
        const box = el.getBoundingClientRect();
        el.style.setProperty('--pointer-x', `${clientX - box.left}px`);
        el.style.setProperty('--pointer-y', `${clientY - box.top}px`);
        el.style.setProperty('--pointer-on', '1');
      });
    };

    const onLeave = () => el.style.setProperty('--pointer-on', '0');

    el.addEventListener('pointermove', onMove, { passive: true });
    el.addEventListener('pointerleave', onLeave);

    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return ref;
}
