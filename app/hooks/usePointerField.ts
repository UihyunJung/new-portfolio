'use client';

import { useEffect, useRef } from 'react';

/**
 * 요소 안 커서 위치를 CSS 변수로 내보낸다 — `--pointer-x`, `--pointer-y`,
 * 그리고 `--pointer-on`(커서가 위에 있으면 1, 아니면 0).
 *
 * 그걸로 무엇을 할지는 스타일시트의 몫이다. 스포트라이트든 색조든 시차든.
 * React에서 렌더링하는 게 없으므로 커서가 히어로를 가로질러도 리렌더가
 * 일어나지 않는다.
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
