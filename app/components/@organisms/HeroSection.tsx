'use client';

import { useTranslations } from 'next-intl';
import { m } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { fadeUp, stagger } from '@lib/animations';
import { scrollToSection } from '@lib/scrollTo';
import styles from './HeroSection.module.scss';

const heroStagger = stagger(0.06);

// Every value here is drawn from the project's own data files —
// skills.ts, projects.ts, experience.ts. Nothing is invented.
const SPEC = [
  { key: 'EXPERIENCE', i18nKey: 'years' },
  { key: 'CORE', value: 'React · Next.js · TypeScript' },
  { key: 'STATE', value: 'Jotai · TanStack Query' },
  { key: 'TESTING', value: 'Playwright · Vitest' },
  { key: 'I18N', value: 'next-intl · 11 locales' },
] as const;

export default function HeroSection() {
  const t = useTranslations('hero');

  return (
    <section id="hero" className={styles.hero}>
      <m.div
        className={styles.shell}
        variants={heroStagger}
        initial="hidden"
        animate="visible"
      >
        <div className={styles.lede}>
          {/* A greeting, not an eyebrow — sentence case, body face, no
              tracking. The page should say hello before it hands over a
              datasheet. */}
          <m.p variants={fadeUp} className={styles.greeting}>
            {t('greeting')}
          </m.p>
          <m.h1 variants={fadeUp} className={styles.name}>
            {t('name')}
          </m.h1>
          <m.p variants={fadeUp} className={styles.role}>
            {t('title')}
          </m.p>
          <m.p variants={fadeUp} className={styles.description}>
            {t('description')}
          </m.p>
          <m.div variants={fadeUp} className={styles.actions}>
            <button
              type="button"
              className={styles.primary}
              onClick={() => scrollToSection('projects')}
            >
              {t('ctaProjects')}
              <ArrowRight size={15} aria-hidden="true" />
            </button>
            <button
              type="button"
              className={styles.secondary}
              onClick={() => scrollToSection('contact')}
            >
              {t('ctaContact')}
            </button>
          </m.div>
        </div>

        {/* The Workbench artifact slot. A typographic frame — top rule,
            label, bottom rule — never re-drawn window chrome. */}
        <m.dl variants={fadeUp} className={styles.spec}>
          <div className={styles.specHead}>
            <span className={styles.specTitle}>{t('specTitle')}</span>
          </div>
          {SPEC.map((row) => (
            <div key={row.key} className={styles.specRow}>
              <dt className={styles.specKey}>{row.key}</dt>
              <dd className={styles.specValue}>
                {'i18nKey' in row ? t(`spec.${row.i18nKey}`) : row.value}
              </dd>
            </div>
          ))}
        </m.dl>
      </m.div>
    </section>
  );
}
