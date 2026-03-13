# Portfolio — 정의현 (Uihyun Jung)

프론트엔드 개발자 정의현의 포트폴리오 사이트.

**Live**: [nooroong.com](https://nooroong.com)

## Tech Stack

- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript
- **Styling**: SCSS Modules + CSS Custom Properties (design tokens)
- **i18n**: next-intl (한국어 / English)
- **Theme**: next-themes (light / dark)
- **Animation**: Motion (LazyMotion)
- **Icons**: lucide-react
- **Font**: Wanted Sans Variable (local)
- **Deploy**: Vercel
- **CI**: GitHub Actions (lint + build)

## Getting Started

```bash
npm install
npm run dev      # http://localhost:3000
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | 개발 서버 |
| `npm run build` | 프로덕션 빌드 |
| `npm run start` | 프로덕션 서버 |
| `npm run lint` | ESLint |

## Project Structure

```
app/
  [locale]/          # 다국어 라우팅 (ko, en)
    layout.tsx       # 루트 레이아웃
    page.tsx         # 메인 페이지 (모든 섹션 조합)
  assets/styles/     # SCSS 디자인 토큰 & 유틸리티
  components/
    @atoms/          # 기본 UI 요소
    @molecules/      # 조합 컴포넌트 (카드류)
    @organisms/      # 페이지 섹션 (Hero, About, Skills, ...)
    @layout/         # Header, Footer, Provider
  hooks/             # 커스텀 훅
  lib/data/          # 정적 데이터 (skills, projects, experience)
i18n/                # next-intl 설정
messages/            # 번역 파일 (ko.json, en.json)
```

## Features

- SPA 스크롤 네비게이션 (Hero → About → Skills → Experience → Projects → Contact)
- 라이트/다크 테마 (시스템 설정 감지)
- 한국어/영어 전환
- 반응형 레이아웃 (모바일/태블릿/데스크톱)
- 스크롤 기반 애니메이션 (prefers-reduced-motion 대응)
- SEO 최적화 (메타데이터, JSON-LD, sitemap, robots.txt)
- 웹 접근성 (WCAG 2.1 AA, 키보드 네비게이션, skip-to-content)

## License

All rights reserved.
