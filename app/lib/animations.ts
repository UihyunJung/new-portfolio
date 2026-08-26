import type { Variants } from 'motion/react';

// motion/react 공용 variant.
//
// 지금 페이지에서 쓰는 곳은 없다. 모션 시스템 전체가 CSS로 옮겨갔다 —
// 스크롤에 묶인 것은 animation-timeline: view() / scroll()(@utilities/_mixins.scss),
// 히어로 로드 진입은 지연을 준 일반 키프레임(HeroSection.module.scss)이다.
// 취향 문제가 아니다:
//
//   motion은 variant의 `initial` 상태를 *서버 HTML*에 기록한다. opacity: 0에서
//   페이드인하는 진입은 설명문·CTA·스펙 패널이 하이드레이션 전까지, 실패하면
//   영구히 안 보이는 히어로를 내보낸다. CSS는 이걸 뒤집는다 — 기본 규칙이
//   정지 상태이고 키프레임이 숨김에서 출발하며 마크업만으로 완성된다.
//
// 파일을 남겨 둔 이유는 motion/react가 아직 설치돼 있고 MotionProvider가
// 제공하고 있어서이며, JS 애니메이션이 정말 값을 하는 경우(중단 가능한 드래그,
// 공유 레이아웃 전환, 요소를 기다려야 하는 exit)에 꺼내 쓸 형태이기 때문이다.
// 새 variant를 만들 때의 제약은 위와 같다: 첫 페인트에 존재하는 콘텐츠의
// opacity를 0에서 올리지 말 것.

// 지수형 ease-out. `ease`가 아니다 — 그건 브라우저 기본값이고
// cubic-bezier(0.25, 0.1, 0.25, 1)이 문자 그대로 그 정의다.
const EASE_OUT = [0.16, 1, 0.3, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.42, ease: EASE_OUT },
  },
};

export const stagger = (delay = 0.06): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: delay },
  },
});
