'use client';

import { useTranslations } from 'next-intl';
import { m } from 'motion/react';
import {
  Monitor, Atom, Layers, Globe, Wifi, FlaskConical,
  Code2, FileCode, FileType, Palette, PaintBucket, Smartphone,
  Database, TestTube, Braces, GitBranch, Container, Rocket,
  Server, Sparkles, CheckSquare, Zap, Languages, Radio,
} from 'lucide-react';
import SectionWrapper from '@components/@atoms/SectionWrapper';
import SkillCard from '@components/@molecules/SkillCard';
import { skillCategories, type SkillName } from '@lib/data/skills';
import { fadeUp, stagger } from '@lib/animations';
import styles from './SkillsSection.module.scss';

const SKILL_ICONS: Record<SkillName, typeof Atom> = {
  React: Atom,
  'Next.js': Globe,
  TypeScript: FileCode,
  JavaScript: Braces,
  HTML5: Code2,
  'SCSS / Sass': Palette,
  'CSS Modules': PaintBucket,
  'Responsive Design': Smartphone,
  Jotai: Database,
  Recoil: Database,
  'TanStack Query': Layers,
  SWR: Layers,
  Vitest: TestTube,
  Playwright: FlaskConical,
  Jest: TestTube,
  'Testing Library': CheckSquare,
  Git: GitBranch,
  Docker: Container,
  'GitHub Actions': Rocket,
  Vercel: Server,
  ESLint: Sparkles,
  Prettier: FileType,
  'Motion / React': Zap,
  'react-hook-form': Monitor,
  Zod: Sparkles,
  'next-intl': Languages,
  WebSocket: Radio,
};

const skillsStagger = stagger(0.08);

export default function SkillsSection() {
  const t = useTranslations('skills');

  return (
    <SectionWrapper id="skills">
      <m.div
        className={styles.content}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={skillsStagger}
      >
        <m.h2 variants={fadeUp} className={styles.heading}>
          {t('heading')}
        </m.h2>
        <div className={styles.categories}>
          {skillCategories.map((category) => (
            <m.div key={category.key} variants={fadeUp} className={styles.category}>
              <h3 className={styles.categoryLabel}>{t(`categories.${category.key}`)}</h3>
              <div className={styles.grid}>
                {category.skills.map((skill) => (
                  <SkillCard key={skill.name} name={skill.name} icon={SKILL_ICONS[skill.name]} />
                ))}
              </div>
            </m.div>
          ))}
        </div>
      </m.div>
    </SectionWrapper>
  );
}
