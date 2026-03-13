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

### 애니메이션

- `motion/react`의 `m` 컴포넌트 사용 (`motion` 아닌 `m` — LazyMotion 최적화)
- `MotionProvider`가 `LazyMotion + domAnimation`을 제공
- 공유 variants: `app/lib/animations.ts` (`fadeUp`, `stagger`)
- `prefers-reduced-motion` 반드시 대응 (`@include reduced-motion` mixin)

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
