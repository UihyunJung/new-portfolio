# Portfolio — 정의현 (Uihyun Jung)

프론트엔드 개발자 정의현의 포트폴리오 사이트.

**Live**: [nooroong.com](https://nooroong.com)

## Tech Stack

- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript
- **Styling**: SCSS Modules + CSS 커스텀 프로퍼티(디자인 토큰)
- **Animation**: CSS 전용 — `animation-timeline: view()` / `scroll(root)`.
  JS 애니메이션 라이브러리를 쓰지 않는다
- **i18n**: next-intl (한국어 / English)
- **Theme**: next-themes (라이트 / 다크, `data-theme` 기반)
- **Icons**: lucide-react
- **Fonts**: Wanted Sans Variable (local) + Space Grotesk · JetBrains Mono
- **Deploy**: Vercel
- **CI**: GitHub Actions (lint + build)

런타임 의존성은 일곱 개다 — `next`, `react`, `react-dom`, `next-intl`,
`next-themes`, `lucide-react`, `clsx`.

## Getting Started

```bash
npm install
npm run dev      # http://localhost:3000
```

## Scripts

| Command         | Description                    |
| --------------- | ------------------------------ |
| `npm run dev`   | 개발 서버                      |
| `npm run build` | 프로덕션 빌드 (타입 체크 포함) |
| `npm run start` | 프로덕션 서버                  |
| `npm run lint`  | ESLint                         |

## Project Structure

```
app/
  [locale]/            # 다국어 라우팅 (ko, en)
    layout.tsx         # 루트 레이아웃 (폰트, 메타데이터, JSON-LD)
    page.tsx           # 메인 페이지 (모든 섹션 조합)
    error.tsx          # 에러 바운더리
    not-found.tsx
  assets/styles/
    @tokens/           # 색·타이포·간격·모션·브레이크포인트
    @utilities/        # 믹스인 (반응형, 목소리, 접근성, 스크롤 모션)
    @global/           # 리셋
  components/
    @atoms/            # SectionWrapper, SectionHeading, SplitText, StatValue, ScrollToTop
    @molecules/        # ProjectCard, ProjectShots, PublishingLedger, ExperienceCard
    @organisms/        # Hero / About / Skills / Experience / Projects / Contact
    @layout/           # Header, Footer, ThemeProvider, ThemeToggle, LocaleSwitcher
  hooks/               # useActiveSection, useMagnetic, usePointerField
  lib/data/            # 정적 데이터 (skills, projects, publishing, experience, socialLinks)
i18n/                  # next-intl 설정
messages/              # 번역 파일 (ko.json, en.json)
public/images/projects/# 프로젝트 화면 (원본 + 썸네일 2종)
.design/               # 디자인 캔버스 소스 (.dc.html + canvas.json)
```

## Features

- SPA 스크롤 네비게이션 (Hero → About → Skills → Experience → Projects → Contact)
- 라이트/다크 테마 (시스템 설정 감지)
- 한국어/영어 전환
- 반응형 레이아웃 (모바일/태블릿/데스크톱)
- 스크롤 구동 애니메이션 — 스크롤 리스너나 IntersectionObserver 없이 CSS만.
  `prefers-reduced-motion`과 미지원 브라우저에서는 모션이 빠질 뿐 레이아웃은
  완성된 상태
- 프로젝트 섹션: `<details>` 기반 펼침 목록, 네이티브 `<dialog>` 라이트박스,
  퍼블리싱 고객사 25건 원장
- SEO (메타데이터, JSON-LD, sitemap, robots.txt)
- 웹 접근성 (WCAG 2.1 AA, 키보드 네비게이션, skip-to-content)

## Documentation

- **[DESIGN.md](./DESIGN.md)** — 디자인 시스템의 결정과 제약. 색·타이포·기하·
  모션의 규칙과 하지 않는 것들
- **[CLAUDE.md](./CLAUDE.md)** — 이 저장소에서 작업할 때의 안내

## License

All rights reserved.
