'use client';

import { useCallback, useEffect, useRef, type RefObject } from 'react';
import {
  drawRibbon,
  type Rgb,
  type RibbonPalette,
  type RibbonState,
} from '@lib/ribbon';
import useScrollProgress from '@hooks/useScrollProgress';

interface HeroCanvasProps {
  /** 진행률의 기준이 되는 핀 컨테이너. */
  subjectRef: RefObject<HTMLElement | null>;
  className?: string;
}

// 고해상도 화면에서도 2배면 헤어라인이 충분히 선명하다. 3배는 픽셀만 늘린다.
const MAX_DPR = 2;

// 로드 진입. 이름의 글자 상승(180ms부터)과 같은 호흡으로 시작해 설명문이
// 들어오는 1초 즈음 다 그려진다.
const REVEAL_DELAY = 200;
const REVEAL_DURATION = 1500;

// 커서 영향력이 붙고 떨어지는 속도. 프레임마다 목표값으로 이만큼 다가간다.
const POINTER_EASE = 0.08;

/**
 * 히어로 배경의 제너레이티브 리본. 이미지 에셋 없이 canvas에 절차 생성한다.
 *
 * 마크업은 빈 `<canvas>` 하나다 — 크기 속성도 없고 SSR에서 아무것도 하지
 * 않는다. 그리는 일은 전부 effect 안에 있고 React 상태를 쓰지 않으므로 스크롤
 * 중에 리렌더가 없다. 색은 계산된 커스텀 프로퍼티에서 읽어 라이트/다크가
 * 스타일시트와 같은 토큰을 쓴다.
 *
 * 세 입력이 그림을 바꾼다 — 스크롤 진행률, 시간, 커서. 시간과 커서 때문에
 * rAF 루프가 있지만 **히어로가 화면에 있고 탭이 보일 때만** 돈다. 화면 밖으로
 * 나가면 IntersectionObserver가 멈추고, 돌아오면 다시 잇는다. reduced-motion
 * 에서는 루프도 진입도 없이 완성된 한 프레임만 그린다.
 */
export default function HeroCanvas({ subjectRef, className }: HeroCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // 진행률 훅은 이 ref를 통해 그린다. 마운트 순서와 무관하게 안전하도록
  // 초기값은 아무것도 안 한다.
  const progressRef = useRef<(p: number) => void>(() => {});

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fine = window.matchMedia(
      '(hover: hover) and (pointer: fine)',
    ).matches;

    let dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    let palette = readPalette(canvas);
    const state: RibbonState = {
      p: 0,
      t: 0,
      reveal: calm ? 1 : 0,
      pointer: null,
    };

    // 커서 목표값. 실제 state.pointer는 루프에서 이쪽으로 서서히 다가간다.
    let pointerTarget: { x: number; y: number } | null = null;

    const render = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (w === 0 || h === 0) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      drawRibbon(ctx, w, h, state, palette);
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      render();
    };

    // ---- 루프 -----------------------------------------------------------
    // 두 조건이 다 맞을 때만 돈다: 캔버스가 뷰포트와 교차하고, 문서가 보인다.
    let frame = 0;
    let onScreen = false;
    let visible = document.visibilityState === 'visible';
    let lastTick = 0;
    const mounted = performance.now();

    const tick = (now: number) => {
      frame = 0;
      if (!(onScreen && visible)) return;

      const dt = lastTick ? (now - lastTick) / 1000 : 0;
      lastTick = now;
      state.t += dt;

      if (state.reveal < 1) {
        const k = (now - mounted - REVEAL_DELAY) / REVEAL_DURATION;
        // 지수형 ease-out — --ease-out이 근사하는 곡선.
        state.reveal = k <= 0 ? 0 : k >= 1 ? 1 : 1 - Math.pow(2, -10 * k);
      }

      // 커서 영향력은 붙을 때도 떨어질 때도 서서히. 목표가 없으면 강도만
      // 0으로 줄이고 자리는 남겨 두어 사라지는 동안 튀지 않는다.
      const current = state.pointer;
      if (pointerTarget) {
        state.pointer = current
          ? {
              x: current.x + (pointerTarget.x - current.x) * POINTER_EASE * 2,
              y: current.y + (pointerTarget.y - current.y) * POINTER_EASE * 2,
              strength:
                current.strength + (1 - current.strength) * POINTER_EASE,
            }
          : { ...pointerTarget, strength: POINTER_EASE };
      } else if (current) {
        const strength = current.strength * (1 - POINTER_EASE);
        state.pointer = strength < 0.005 ? null : { ...current, strength };
      }

      render();
      frame = requestAnimationFrame(tick);
    };

    const start = () => {
      if (calm || frame || !(onScreen && visible)) return;
      lastTick = 0;
      frame = requestAnimationFrame(tick);
    };

    const stop = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
    };

    progressRef.current = (p) => {
      state.p = p;
      // 루프가 돌고 있으면 다음 프레임이 그린다. 멈춰 있으면(화면 밖,
      // reduced-motion) 여기서 직접 그린다.
      if (!frame) render();
    };

    const sizer = new ResizeObserver(resize);
    sizer.observe(canvas);

    const watcher = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      if (onScreen) start();
      else stop();
    });
    watcher.observe(canvas);

    const onVisibility = () => {
      visible = document.visibilityState === 'visible';
      if (visible) start();
      else stop();
    };
    document.addEventListener('visibilitychange', onVisibility);

    // 스크롤 없이 테마만 바꾸면 다음 프레임까지 옛 색이 남으므로 속성 교체를
    // 직접 본다. next-themes는 OS 테마 전환도 이 속성으로 반영한다.
    const themer = new MutationObserver(() => {
      palette = readPalette(canvas);
      if (!frame) render();
    });
    themer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    // 커서는 fine 포인터에만. 터치는 스크롤 중에 닿는 자리가 손가락이라
    // 리본이 손가락을 따라오면 오히려 방해다.
    const onMove = (event: PointerEvent) => {
      const box = canvas.getBoundingClientRect();
      pointerTarget = {
        x: (event.clientX - box.left) / box.width,
        y: (event.clientY - box.top) / box.height,
      };
    };
    const onLeave = () => {
      pointerTarget = null;
    };
    if (fine && !calm) {
      window.addEventListener('pointermove', onMove, { passive: true });
      document.addEventListener('pointerleave', onLeave);
    }

    return () => {
      stop();
      sizer.disconnect();
      watcher.disconnect();
      themer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      progressRef.current = () => {};
    };
  }, []);

  const handleProgress = useCallback((next: number) => {
    progressRef.current(next);
  }, []);

  useScrollProgress(subjectRef, handleProgress);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}

// 토큰은 oklch 문자열인데 그라데이션 정지점에 알파를 섞어 넣으려면 채널이
// 필요하다. 1×1 캔버스에 칠하고 읽어 sRGB로 푼다 — 브라우저가 색 공간 변환을
// 대신한다.
function readPalette(el: Element): RibbonPalette {
  const style = getComputedStyle(el);
  return {
    accent: toRgb(style.getPropertyValue('--color-accent')),
    rule: toRgb(style.getPropertyValue('--color-rule-2')),
  };
}

let probe: OffscreenCanvasRenderingContext2D | null | undefined;

function toRgb(css: string): Rgb {
  probe ??= new OffscreenCanvas(1, 1).getContext('2d');
  const ctx = probe;
  if (!ctx) return [96, 128, 255];
  ctx.clearRect(0, 0, 1, 1);
  ctx.fillStyle = css.trim();
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  return [r, g, b];
}
