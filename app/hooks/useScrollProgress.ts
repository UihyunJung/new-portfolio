'use client';

import { useEffect, type RefObject } from 'react';

/**
 * 핀 컨테이너가 스크롤포트를 지나는 진행률 p∈[0,1]을 콜백으로 넘긴다.
 * CSS의 `contain 0%`(컨테이너 위가 스크롤포트 위에 닿음)가 0이고
 * `contain 100%`(컨테이너 아래가 스크롤포트 아래에 닿음)가 1이다.
 *
 * 이 훅이 이 사이트에서 스크롤로 모션을 구동하는 유일한 JS다. 캔버스에는
 * CSS 타임라인이 닿지 않아서이고, 그래서 세 가지를 지킨다.
 *
 * - 상시 rAF 루프가 없다. scroll·resize 이벤트를 프레임 하나로 모아 그때만
 *   부른다(usePointerField와 같은 게이트). 스크롤이 멈추면 아무것도 안 한다.
 * - 핀 여부는 JS가 정하지 않는다. CSS 가드(@supports, reduced-motion,
 *   min-height)가 정한 결과를 `view-timeline-name` 계산값으로 읽을 뿐이다.
 *   핀이 아니면 p=0 한 번만 넘기고 끝난다.
 * - 분모는 innerHeight가 아니라 스크롤포트 높이다. 모바일 툴바가 접혀도
 *   CSS의 contain과 같은 기준을 본다.
 */
export default function useScrollProgress<T extends HTMLElement>(
  subjectRef: RefObject<T | null>,
  onProgress: (p: number) => void,
): void {
  useEffect(() => {
    const subject = subjectRef.current;
    if (!subject) return;

    // 미지원 브라우저는 빈 문자열을 돌려준다 — 그것도 핀이 아니다.
    const timeline = getComputedStyle(subject)
      .getPropertyValue('view-timeline-name')
      .trim();
    const pinned = timeline !== '' && timeline !== 'none';

    if (!pinned) {
      onProgress(0);
      return;
    }

    let frame = 0;
    let last = -1;

    const measure = () => {
      frame = 0;
      const rect = subject.getBoundingClientRect();
      const travel = rect.height - document.documentElement.clientHeight;
      const p = travel > 0 ? Math.min(1, Math.max(0, -rect.top / travel)) : 0;
      if (p === last) return;
      last = p;
      onProgress(p);
    };

    const schedule = () => {
      if (frame) return;
      frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);

    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [subjectRef, onProgress]);
}
