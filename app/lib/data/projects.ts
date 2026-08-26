export interface ProjectShot {
  /**
   * File stem and message key. Resolves to two files under
   * `public/images/projects/` — `<id>-thumb.jpg` for the strip and
   * `<id>.jpg` for the viewer — and to a caption at
   * `projects.items.<key>.shots.<id>`.
   */
  id: string;
  /** Intrinsic size of the full image, so nothing reflows as it loads. */
  width: number;
  height: number;
}

export interface Project {
  key: string;
  type: 'work' | 'personal';
  techStack: string[];
  highlightKeys: string[];
  /** Screenshots, in the order the strip and the viewer show them. */
  shots?: ProjectShot[];
  /**
   * Work under NDA. The panel says so where the screens would be, because
   * an empty slot reads as an oversight rather than as a reason.
   */
  confidential?: boolean;
  /** Renders the 25-entry client ledger where the screens would be. */
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
    ],
    links: {
      github: 'https://github.com/UihyunJung/noopdaa-blog',
    },
  },
];
