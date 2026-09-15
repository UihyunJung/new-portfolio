'use client';

import { useEffect, useRef, type RefObject } from 'react';
import { drawRibbon, type RibbonPalette } from '@lib/ribbon';
import useScrollProgress from '@hooks/useScrollProgress';

interface HeroCanvasProps {
  /** 진행률의 기준이 되는 핀 컨테이너. */
  subjectRef: RefObject<HTMLElement | null>;
  className?: string;
}

// 고해상도 화면에서도 2배면 헤어라인이 충분히 선명하다. 3배는 픽셀만 늘린다.
const MAX_DPR = 2;

/**
 * 히어로 배경의 제너레이티브 리본. 이미지 에셋 없이 canvas에 절차 생성한다.
 *
 * 마크업은 빈 `<canvas>` 하나다 — 크기 속성도 없고 SSR에서 아무것도 하지
 * 않는다. 그리는 일은 전부 effect 안에 있고 React 상태를 쓰지 않으므로 스크롤
 * 중에 리렌더가 없다. 색은 계산된 커스텀 프로퍼티에서 읽어 라이트/다크가
 * 스타일시트와 같은 토큰을 쓴다.
 *
 * 세 가지 신호에만 다시 그린다 — 스크롤 진행률이 바뀔 때, 캔버스 크기가
 * 바뀔 때, `data-theme`이 바뀔 때. 그 밖에는 아무 일도 하지 않는다.
 */
export default function HeroCanvas({ subjectRef, className }: HeroCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // 그리기 함수는 effect가 만든 클로저에 살고, 훅 콜백은 이 ref를 통해 부른다.
  // 진행률 훅이 마운트 순서와 무관하게 안전하도록 초기값은 아무것도 안 한다.
  const renderRef = useRef<(p: number) => void>(() => {});

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // 색 토큰이 oklch라 캔버스가 그 문자열을 못 읽는 브라우저에서는 그리지
    // 않는다. 스크롤 타임라인을 지원하는 브라우저는 전부 읽는다.
    if (!CSS.supports('color', 'oklch(0% 0 0)')) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let p = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    let palette: RibbonPalette = readPalette(canvas);

    const render = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (w === 0 || h === 0) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      drawRibbon(ctx, w, h, p, palette);
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      render();
    };

    renderRef.current = (next) => {
      p = next;
      render();
    };

    const sizer = new ResizeObserver(resize);
    sizer.observe(canvas);

    // 스크롤 없이 테마만 바꾸면 다음 스크롤까지 옛 색이 남으므로 속성 교체를
    // 직접 본다. next-themes는 OS 테마 전환도 이 속성으로 반영한다.
    const themer = new MutationObserver(() => {
      palette = readPalette(canvas);
      render();
    });
    themer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => {
      sizer.disconnect();
      themer.disconnect();
      renderRef.current = () => {};
    };
  }, []);

  useScrollProgress(subjectRef, (next) => renderRef.current(next));

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}

function readPalette(el: Element): RibbonPalette {
  const style = getComputedStyle(el);
  return {
    accent: style.getPropertyValue('--color-accent').trim(),
    rule: style.getPropertyValue('--color-rule-2').trim(),
  };
}
