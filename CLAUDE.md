# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

디자인 시스템의 결정과 제약은 **[DESIGN.md](./DESIGN.md)** 에 있다. 색·모션·
타이포를 건드리기 전에 먼저 읽을 것.

## Commands

```bash
npm run dev        # 개발 서버 (localhost:3000)
npm run build      # 프로덕션 빌드 + 타입 체크
npm run lint       # ESLint
npm run start      # 프로덕션 서버
```

테스트 프레임워크는 아직 미설정. 빌드(`npm run build`)가 타입 체크를 겸한다.
패키지 매니저는 npm 하나만 쓴다 — 락파일이 둘이면 의존성 트리가 갈린다.

## Architecture

**Next.js 16 App Router** 기반 SPA 포트폴리오. 단일 페이지(`app/[locale]/page.tsx`)에 모든 섹션을 조합.

### i18n (next-intl)

- 지원 언어: `ko`(기본), `en` — `i18n/routing.ts`에서 설정
- 메시지 파일: `messages/ko.json`, `messages/en.json`
- 미들웨어: `proxy.ts` (next-intl `createMiddleware`)
- 네비게이션: `i18n/navigation.ts`의 `Link`, `useRouter`, `usePathname` 사용 (next/link 직접 사용 금지)
- 컴포넌트에서 `useTranslations()` 훅으로 번역 접근
- **문구를 추가하면 두 파일 모두에 넣는다.** 키 개수가 어긋나면 런타임에
  키 이름이 그대로 노출된다

### 테마

`next-themes`로 라이트/다크 전환. `data-theme` 속성 기반. 색상은
`@tokens/_colors.scss`의 CSS 커스텀 프로퍼티로 정의.

`disableTransitionOnChange`는 **끈 채로 둔다.** 이 옵션은
`*{transition:none!important}`를 주입하고 강제 리스타일을 돌려서, 테마를
바꾸는 컨트롤 자신의 모션까지 죽인다. 자세한 이유는 `ThemeProvider.tsx` 주석에.

### 컴포넌트 구조 (Atomic Design)

- `@atoms/` — ScrollToTop, SectionHeading, SectionWrapper, SplitText, StatValue
- `@molecules/` — ExperienceCard, ProjectCard, ProjectShots, PublishingLedger
- `@organisms/` — Hero / About / Skills / Experience / Projects / Contact 섹션
- `@layout/` — Header, Footer, ThemeProvider, ThemeToggle, LocaleSwitcher

`ErrorPage.module.scss`는 짝이 되는 tsx가 없다. `app/[locale]/error.tsx`와
`not-found.tsx`가 함께 쓴다.

### SCSS 아키텍처

- **토큰**: `@tokens/` — `_colors`, `_typography`, `_spacing`, `_motion`,
  `_breakpoints`
- **유틸리티**: `@utilities/_mixins.scss`
  - 반응형: `sm` `md` `lg` `xl` `wide` `hover-fine`
  - 레이아웃: `shell` `band`
  - 목소리: `label`(라틴 토큰) `label-prose`(한글 문장) `display`
    `section-heading` `tnum`
  - 접근성: `focus-ring` `visually-hidden` `tap-target` `affordance`
    `control-states`
  - 모션: `reduced-motion` `supports-scroll-timeline`, 그리고 스크롤 구동
    믹스인들(`reveal-on-scroll` `line-rise` `rule-draw-on-scroll`
    `rail-draw-on-scroll` `document-progress`)
- **전역**: `@global/_reset.scss`
- 컴포넌트별 `.module.scss` (CSS Modules)
- `next.config.ts`에서 `app/assets/styles`를 SCSS include path로 설정 →
  `@use '@tokens/colors'` 형태로 직접 import 가능

**키프레임은 모듈마다 내보내야 한다.** CSS Modules가 이름을 해싱하므로
`@include reveal-keyframes` 같은 믹스인을 그 모듈 최상위에서 한 번 호출해야
`animation-name`이 해석된다.

### 애니메이션

전부 CSS다. 규칙과 층은 [DESIGN.md](./DESIGN.md)에 있다. 코드를 건드릴 때
반드시 지킬 두 가지만 여기 옮겨 둔다.

1. **숨김 상태를 기본 규칙에 쓰지 않는다.** 기본 규칙이 정지 상태이고
   키프레임이 *숨김에서* 출발한다
2. **JS로 콘텐츠를 숨기지 않는다.** 라이브러리의 `initial` 상태는 서버 HTML에
   기록되므로, 페이드인 진입은 하이드레이션 전까지(실패하면 영구히) 콘텐츠를
   안 보이게 만든다

### 데이터

정적 데이터는 `app/lib/data/`에 TypeScript 인터페이스와 함께 정의 —
`skills.ts`, `projects.ts`, `publishing.ts`, `experience.ts`,
`socialLinks.ts`.

번역이 필요한 문자열은 데이터 파일이 아니라 메시지 파일에 둔다. 데이터
파일은 키와 번역하지 않는 값(기간, 이미지 크기, 기술 이름)만 갖는다.

### 훅

`useActiveSection`(스크롤 위치 → 활성 섹션), `useMagnetic`(자석 CTA),
`usePointerField`(커서 스포트라이트). 뒤의 둘은 CSS 커스텀 프로퍼티만 쓰고
리렌더를 일으키지 않는다.

### 이미지

`public/images/projects/`에 `<id>.jpg`(1000px)와 `<id>-thumb.jpg`(320px) 두
크기로 둔다. `next/image`에 넘길 고유 크기는 `projects.ts`의 `ProjectShot`에
적는다 — 로드 중 레이아웃이 밀리지 않게.

## Conventions

- **ESLint 9 Flat Config** (`eslint.config.mjs`) + Prettier (semi, singleQuote, printWidth 80)
- **locale-aware 네비게이션**: `next/link` 대신 `@i18n/navigation`의 `Link` 사용
- **아이콘**: `lucide-react` 사용 (react-icons 금지 — 번들 크기)
- **장식용 아이콘**: `aria-hidden="true"` 필수
- **className 조합**: `clsx` 사용
- **폰트**: Wanted Sans 가변폰트(`next/font/local`) + Space Grotesk ·
  JetBrains Mono(`next/font/google`)
- **주석은 한국어로 쓴다.** 코드가 이미 말하는 것은 적지 않고, 왜 그렇게
  했는지와 되돌리면 안 되는 이유를 적는다
