# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # 개발 서버 (localhost:3000)
npm run build      # 프로덕션 빌드 + 타입 체크
npm run lint       # ESLint
npm run start      # 프로덕션 서버
```

테스트 프레임워크는 아직 미설정. 빌드(`npm run build`)가 타입 체크를 겸한다.

## Architecture

**Next.js 16 App Router** 기반 SPA 포트폴리오. 단일 페이지(`app/[locale]/page.tsx`)에 모든 섹션을 조합.

### i18n (next-intl)

- 지원 언어: `ko`(기본), `en` — `i18n/routing.ts`에서 설정
- 메시지 파일: `messages/ko.json`, `messages/en.json`
- 미들웨어: `proxy.ts` (next-intl `createMiddleware`)
- 네비게이션: `i18n/navigation.ts`의 `Link`, `useRouter`, `usePathname` 사용 (next/link 직접 사용 금지)
- 컴포넌트에서 `useTranslations()` 훅으로 번역 접근

### 테마

`next-themes`로 라이트/다크 전환. `data-theme` 속성 기반. 색상은 `app/assets/styles/@tokens/_colors.scss`의 CSS 커스텀 프로퍼티로 정의.

### 컴포넌트 구조 (Atomic Design)

- `@atoms/` — SectionWrapper, ScrollToTop, ErrorPage 등
- `@molecules/` — SkillCard, ProjectCard, ExperienceCard
- `@organisms/` — HeroSection, AboutSection, SkillsSection 등 (페이지 섹션 단위)
- `@layout/` — Header, Footer, ThemeProvider, MotionProvider, LocaleSwitcher

### SCSS 아키텍처

- **토큰**: `@tokens/` — `_colors.scss`, `_typography.scss`, `_spacing.scss`, `_breakpoints.scss`
- **유틸리티**: `@utilities/_mixins.scss` — `@include sm`, `md`, `lg`, `xl` (반응형), `focus-ring` (접근성), `reduced-motion` (애니메이션)
- 컴포넌트별 `.module.scss` (CSS Modules)
- `next.config.ts`에서 `app/assets/styles`를 SCSS include path로 설정 → `@use '@tokens/colors'` 형태로 직접 import 가능

### 애니메이션 (Kinetic Cobalt)

**전부 CSS다.** JS 애니메이션 라이브러리는 현재 페이지에서 쓰지 않는다.

- **스크롤 연동**: `@utilities/_mixins.scss`의 스크롤 구동 믹스인 —
  `reveal-on-scroll`, `line-rise`, `rule-draw-on-scroll`,
  `rail-draw-on-scroll`, `document-progress`. `animation-timeline: view()` /
  `scroll(root)` 기반. 스크롤 리스너·IntersectionObserver 없음
- **로드 진입**: 히어로만. `SplitText` 아톰(문자/단어 단위 마스크 상승) +
  `HeroSection.module.scss`의 `@mixin enter` 블록 큐
- **포인터**: `useMagnetic`(자석 CTA), `usePointerField`(커서 스포트라이트).
  둘 다 CSS 커스텀 프로퍼티만 쓰고 리렌더를 일으키지 않으며,
  coarse 포인터·reduced-motion에서는 아예 붙지 않는다
- **토큰**: `@tokens/_motion.scss` — 이징 4종(`--ease-out`/`in`/`in-out`/
  `--ease-spring`), 지속시간 4종(`--dur-micro`/`short`/`long`/`travel`),
  `--stagger: 60ms`. 이 밖의 값 금지.
  유일한 예외는 **표면을 가로질러 지나가는 띠**(스킬 행 hover sweep):
  네 이징은 전부 *안착*을 만들려고 앞뒤로 쏠려 있어서, 지나가기만 하는
  움직임에 쓰면 번쩍임이 된다. 이 경우만 `linear`를 쓴다

**절대 규칙 두 가지**

1. **숨김 상태를 기본 규칙에 쓰지 않는다.** 기본 규칙이 정지 상태이고,
   키프레임이 *숨김에서* 출발한다. 스크롤 타임라인 미지원 브라우저와
   reduced-motion 사용자는 완성된 레이아웃을 본다
2. **JS로 콘텐츠를 숨기지 않는다.** motion/react의 `initial`은 **서버 HTML에
   기록**되므로, 페이드인 진입은 하이드레이션 전까지(실패하면 영구히)
   콘텐츠를 안 보이게 만든다. `app/lib/animations.ts` 참고

`MotionProvider`와 `app/lib/animations.ts`는 남아 있지만 현재 미사용.
JS 애니메이션이 실제로 필요한 경우(중단 가능한 드래그, 공유 레이아웃 전환,
exit 애니메이션)에만 꺼내 쓰고, 위 2번 규칙을 지킬 것.

### 데이터

정적 데이터는 `app/lib/data/`에 TypeScript 인터페이스와 함께 정의 (`skills.ts`, `projects.ts`, `experience.ts`, `socialLinks.ts`).

### Path Aliases (tsconfig.json)

| Alias | Path |
|-------|------|
| `@/*` | `./app/*` |
| `@components/*` | `./app/components/*` |
| `@hooks/*` | `./app/hooks/*` |
| `@lib/*` | `./app/lib/*` |
| `@styles/*` | `./app/assets/styles/*` |
| `@i18n/*` | `./i18n/*` |

## Conventions

- **ESLint 9 Flat Config** (`eslint.config.mjs`) + Prettier (semi, singleQuote, printWidth 80)
- **locale-aware 네비게이션**: `next/link` 대신 `@i18n/navigation`의 `Link` 사용
- **아이콘**: `lucide-react` 사용 (react-icons 금지 — 번들 크기)
- **장식용 아이콘**: `aria-hidden="true"` 필수
- **className 조합**: `clsx` 사용
- **폰트**: Wanted Sans 가변폰트 (`next/font/local`)
