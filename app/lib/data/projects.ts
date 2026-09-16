export interface ProjectShot {
  /**
   * 파일 이름이자 메시지 키. `public/images/projects/` 아래 두 파일
   * (`<id>-thumb.jpg`는 스트립용, `<id>.jpg`는 뷰어용)과
   * `projects.items.<key>.shots.<id>`의 캡션으로 이어진다.
   */
  id: string;
  /** 원본 이미지의 고유 크기. 로드되는 동안 레이아웃이 밀리지 않게 한다. */
  width: number;
  height: number;
}

export interface Project {
  key: string;
  type: 'work' | 'personal';
  techStack: string[];
  highlightKeys: string[];
  /** 스크린샷. 스트립과 뷰어가 보여주는 순서 그대로. */
  shots?: ProjectShot[];
  /**
   * NDA 대상 작업. 화면이 들어갈 자리에 그 사실을 적는다. 빈 칸은 사유가
   * 아니라 누락으로 읽히기 때문이다.
   */
  confidential?: boolean;
  /** 화면이 들어갈 자리에 25건 고객사 원장을 렌더링한다. */
  ledger?: boolean;
  links?: {
    github?: string;
    live?: string;
  };
}

export const projects: Project[] = [
  {
    key: 'lobbyV2',
    type: 'work',
    techStack: [
      'Next.js 16',
      'React 19',
      'TypeScript',
      'Jotai',
      'TanStack Query',
      'SCSS Modules',
      'next-intl',
      'Motion / React',
      'WebSocket',
      'Playwright',
      'Vitest',
    ],
    highlightKeys: ['h1', 'h2', 'h3', 'h4'],
    confidential: true,
  },
  {
    key: 'lobbyV1',
    type: 'work',
    techStack: [
      'Next.js 14',
      'React 18',
      'TypeScript',
      'Recoil',
      'SWR',
      'SCSS Modules',
      'next-intl',
      'next-auth',
      'Motion / React',
      'WebSocket',
      'Jest',
    ],
    highlightKeys: ['h1', 'h2', 'h3'],
    confidential: true,
  },
  {
    key: 'publishing',
    type: 'work',
    techStack: [
      'HTML5',
      'CSS3',
      'SCSS / Sass',
      'JavaScript',
      'jQuery',
      'Responsive Design',
      'Cross-Browser',
      'Web Accessibility',
      'Gulp',
    ],
    highlightKeys: ['h1', 'h2', 'h3'],
    ledger: true,
  },
  {
    key: 'reviewAnalyzer',
    type: 'personal',
    techStack: [
      'Chrome MV3',
      'TypeScript',
      'Vite',
      'Vitest',
      'Cloudflare Workers',
      'Supabase',
      'Gemini API',
      'Paddle Billing',
      'Claude Code',
    ],
    highlightKeys: ['h1', 'h2', 'h3', 'h4'],
    shots: [
      { id: 'review-analyzer-1', width: 1000, height: 626 },
      { id: 'review-analyzer-2', width: 1000, height: 626 },
      { id: 'review-analyzer-3', width: 1000, height: 626 },
      { id: 'review-analyzer-4', width: 1000, height: 626 },
      { id: 'review-analyzer-5', width: 1000, height: 626 },
    ],
    links: {
      live: 'https://chromewebstore.google.com/detail/place-review-analyzer-for/okcpoanbjoeajobklbobjbhhmlfkljeg',
    },
  },
  {
    key: 'averageDown',
    type: 'personal',
    techStack: [
      'Chrome MV3',
      'Vanilla JS',
      'Vite',
      'Vercel Serverless',
      'Upstash Redis',
      'Paddle Billing',
      'Claude Code',
    ],
    highlightKeys: ['h1', 'h2', 'h3', 'h4'],
    shots: [
      { id: 'average-down-1', width: 1000, height: 626 },
      { id: 'average-down-2', width: 1000, height: 626 },
      { id: 'average-down-3', width: 1000, height: 626 },
      { id: 'average-down-4', width: 1000, height: 626 },
      { id: 'average-down-5', width: 1000, height: 626 },
    ],
    links: {
      live: 'https://chromewebstore.google.com/detail/stock-average-down-calcul/dbadoampjeambpjcanmfaadkjibpgefl',
    },
  },
  {
    key: 'noopdaaBlog',
    type: 'personal',
    techStack: [
      'Next.js 16',
      'React 19',
      'TypeScript',
      'Turborepo',
      'Supabase',
      'TailwindCSS',
      'Recharts',
      'Zod',
      'Resend',
    ],
    highlightKeys: ['h1', 'h2', 'h3'],
    shots: [
      { id: 'noopdaa-blog-1', width: 1000, height: 852 },
      { id: 'noopdaa-blog-2', width: 1000, height: 852 },
      { id: 'noopdaa-blog-3', width: 1000, height: 615 },
      { id: 'noopdaa-blog-4', width: 1000, height: 860 },
      { id: 'noopdaa-blog-5', width: 1000, height: 856 },
    ],
    links: {
      live: 'https://noopdaa.com',
    },
  },
];
