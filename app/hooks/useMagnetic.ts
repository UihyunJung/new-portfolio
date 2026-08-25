'use client';

import { useEffect, useRef } from 'react';

/** Distance at which the control starts to feel the cursor. */
const REACH = 140;
/** How far it travels, as a fraction of the cursor's offset. */
const PULL = 0.32;

/**
 * Gives a control a small magnetic pull toward the cursor.
 *
 * Writes `--magnet-x` / `--magnet-y` rather than `transform`, so the
 * stylesheet stays in charge of how they compose with press and hover
 * states. Reads are batched into one rAF per frame; nothing is written
 * once the cursor is out of range.
 *
 * Opt-out is not a nicety here: on a coarse pointer there is no cursor to
 * follow, and for a reduced-motion reader an element that chases them is
 * exactly the kind of unrequested movement to suppress.
 */
export default function useMagnetic<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!fine.matches || calm.matches) return;

    let frame = 0;
    let engaged = false;

    const onMove = (event: PointerEvent) => {
      const { clientX, clientY } = event;
      if (frame) return;

      frame = requestAnimationFrame(() => {
        frame = 0;
        const box = el.getBoundingClientRect();
        const dx = clientX - (box.left + box.width / 2);
        const dy = clientY - (box.top + box.height / 2);
        const distance = Math.hypot(dx, dy);

        if (distance < REACH) {
          const force = (1 - distance / REACH) * PULL;
          el.style.setProperty('--magnet-x', `${(dx * force).toFixed(2)}px`);
          el.style.setProperty('--magnet-y', `${(dy * force).toFixed(2)}px`);
          engaged = true;
        } else if (engaged) {
          el.style.removeProperty('--magnet-x');
          el.style.removeProperty('--magnet-y');
          engaged = false;
        }
      });
    };

    window.addEventListener('pointermove', onMove, { passive: true });

    return () => {
      window.removeEventListener('pointermove', onMove);
      if (frame) cancelAnimationFrame(frame);
      el.style.removeProperty('--magnet-x');
      el.style.removeProperty('--magnet-y');
    };
  }, []);

  return ref;
}
