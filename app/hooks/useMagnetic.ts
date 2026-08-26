'use client';

import { useEffect, useRef } from 'react';

/** 컨트롤이 커서를 느끼기 시작하는 거리. */
const REACH = 140;
/** 커서 오프셋 대비 얼마나 따라갈지의 비율. */
const PULL = 0.32;

/**
 * 컨트롤에 커서 쪽으로 향하는 약한 인력을 준다.
 *
 * `transform`이 아니라 `--magnet-x` / `--magnet-y`를 쓴다. 그래야 눌림·hover
 * 상태와 어떻게 합성할지를 스타일시트가 계속 쥔다. 읽기는 프레임당 rAF 하나로
 * 묶고, 커서가 사거리 밖이면 아무것도 쓰지 않는다.
 *
 * 여기서 opt-out은 배려가 아니라 필수다. coarse 포인터에는 따라갈 커서가 없고,
 * reduced-motion 사용자에게 자기를 쫓아오는 요소는 정확히 억제해야 할 종류의
 * 움직임이다.
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
