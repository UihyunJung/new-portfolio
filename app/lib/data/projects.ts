export interface Project {
  key: string;
  type: 'work' | 'personal';
  techStack: string[];
  highlightKeys: string[];
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
    links: {
      github: 'https://github.com/UihyunJung/noopdaa-blog',
    },
  },
];
