export const SKILL_NAMES = [
  'React',
  'Next.js',
  'TypeScript',
  'JavaScript',
  'HTML5',
  'SCSS / Sass',
  'CSS Modules',
  'Responsive Design',
  'Jotai',
  'Recoil',
  'TanStack Query',
  'SWR',
  'Vitest',
  'Playwright',
  'Jest',
  'Testing Library',
  'Git',
  'Docker',
  'GitHub Actions',
  'Vercel',
  'ESLint',
  'Prettier',
  'Motion / React',
  'react-hook-form',
  'Zod',
  'next-intl',
  'WebSocket',
] as const;

export type SkillName = (typeof SKILL_NAMES)[number];

export interface Skill {
  name: SkillName;
}

export interface SkillCategory {
  key: string;
  skills: Skill[];
}

export const skillCategories: SkillCategory[] = [
  {
    key: 'frontend',
    skills: [
      { name: 'React' },
      { name: 'Next.js' },
      { name: 'TypeScript' },
      { name: 'JavaScript' },
      { name: 'HTML5' },
    ],
  },
  {
    key: 'styling',
    skills: [
      { name: 'SCSS / Sass' },
      { name: 'CSS Modules' },
      { name: 'Responsive Design' },
    ],
  },
  {
    key: 'stateManagement',
    skills: [
      { name: 'Jotai' },
      { name: 'Recoil' },
      { name: 'TanStack Query' },
      { name: 'SWR' },
    ],
  },
  {
    key: 'testing',
    skills: [
      { name: 'Vitest' },
      { name: 'Playwright' },
      { name: 'Jest' },
      { name: 'Testing Library' },
    ],
  },
  {
    key: 'tools',
    skills: [
      { name: 'Git' },
      { name: 'Docker' },
      { name: 'GitHub Actions' },
      { name: 'Vercel' },
      { name: 'ESLint' },
      { name: 'Prettier' },
    ],
  },
  {
    key: 'libraries',
    skills: [
      { name: 'Motion / React' },
      { name: 'react-hook-form' },
      { name: 'Zod' },
      { name: 'next-intl' },
      { name: 'WebSocket' },
    ],
  },
];
