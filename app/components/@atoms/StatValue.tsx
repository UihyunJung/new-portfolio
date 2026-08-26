'use client';

import { useEffect, useRef } from 'react';

/** "10+" → 10을 세고 "+"는 유지. "E2E" → 셀 것이 없음. */
const LEADING_NUMBER = /^(\d+)(.*)$/;
const DURATION = 1100;

interface StatValueProps {
  /** 번역 파일에 적힌 그대로의 수치. */
  children: string;
  className?: string;
}

/**
 * 처음 화면에 들어올 때 한 번 올라가는 수치.
 *
 * *최종값*으로 렌더링한다. 그래야 서버에서도, JS 없이도, 크롤러에게도,
 * reduced-motion 사용자에게도 숫자가 맞다. 카운트는 마운트 시점에 아직 화면
 * 아래 있는 수치에만 건다 — 이미 눈앞에 있는 값은 애니메이션할 것이 없고,
 * 0으로 되감으면 그냥 깜빡임이다.
 *
 * 프레임은 상태가 아니라 텍스트 노드에 직접 쓴다. 정수 하나를 움직이려고
 * 초당 60번 리렌더하는 건 잘못된 거래이고, 이 노드의 내용은 그 외에는
 * 정적이라 소유권을 다툴 것도 없다.
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

    // 이미 화면 안: 수치를 건드리지 않는다.
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
          // 지수형 ease-out — --ease-out이 근사하는 곡선.
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
