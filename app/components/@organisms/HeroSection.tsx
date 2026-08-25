'use client';

import { useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';
import { scrollToSection } from '@lib/scrollTo';
import SplitText from '@components/@atoms/SplitText';
import StatValue from '@components/@atoms/StatValue';
import useMagnetic from '@hooks/useMagnetic';
import usePointerField from '@hooks/usePointerField';
import { SKILL_NAMES } from '@lib/data/skills';
import styles from './HeroSection.module.scss';

// Every value here is drawn from the project's own data files —
// skills.ts, projects.ts, experience.ts. Nothing is invented.
const SPEC = [
  { key: 'EXPERIENCE', i18nKey: 'years' },
  { key: 'CORE', value: 'React · Next.js · TypeScript' },
  { key: 'STATE', value: 'Jotai · TanStack Query' },
  { key: 'TESTING', value: 'Playwright · Vitest' },
  { key: 'I18N', value: 'next-intl · 11 locales' },
] as const;

// The entrance is CSS from end to end, and deliberately so: a JS entrance
// writes its hidden state into the server HTML, which leaves the
// description, both calls to action and the whole spec panel invisible
// until hydration — and permanently invisible if it never happens. The
// block-level cues live in HeroSection.module.scss beside the keyframes;
// only the two split lines need their timing passed in.
const NAME_CUE = 180;
const NAME_STEP = 70;
const ROLE_CUE = 470;
const ROLE_STEP = 90;

export default function HeroSection() {
  const t = useTranslations('hero');
  const fieldRef = usePointerField<HTMLElement>();
  const ctaRef = useMagnetic<HTMLButtonElement>();

  return (
    <section id="hero" className={styles.hero} ref={fieldRef}>
      {/* Atmosphere. A ruled field the accent light moves across — the only
          place on the page where anything follows the cursor. */}
      <div className={styles.field} aria-hidden="true">
        <span className={styles.grid} />
        <span className={styles.spot} />
      </div>

      <div className={styles.shell}>
        <div className={styles.lede}>
          {/* A greeting, not an eyebrow — sentence case, body face, no
              tracking. The page should say hello before it hands over a
              datasheet. */}
          <p className={styles.greeting}>{t('greeting')}</p>

          <h1 className={styles.name}>
            <SplitText delay={NAME_CUE} step={NAME_STEP}>
              {t('name')}
            </SplitText>
          </h1>

          {/* Split by word, not character: at mono display size the line is
              one shell wide on a phone, and character masks let the browser
              break it mid-word. */}
          <p className={styles.role}>
            <SplitText by="word" delay={ROLE_CUE} step={ROLE_STEP}>
              {t('title')}
            </SplitText>
            <span className={styles.roleRule} aria-hidden="true" />
          </p>

          <p className={styles.description}>{t('description')}</p>

          <div className={styles.actions}>
            <button
              type="button"
              ref={ctaRef}
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
          </div>
        </div>

        {/* The Workbench artifact slot. A typographic frame — top rule,
            label, bottom rule — never re-drawn window chrome. The panel
            settles first, then deals its rows out. */}
        <dl className={styles.spec}>
          <div className={styles.specHead}>
            <span className={styles.specTitle}>{t('specTitle')}</span>
          </div>
          {SPEC.map((row) => (
            <div key={row.key} className={styles.specRow}>
              <dt className={styles.specKey}>{row.key}</dt>
              <dd className={styles.specValue}>
                {'i18nKey' in row ? (
                  <StatValue>{t(`spec.${row.i18nKey}`)}</StatValue>
                ) : (
                  row.value
                )}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <span className={styles.cue} aria-hidden="true">
        <span className={styles.cueRail} />
        SCROLL
      </span>

      {/* The stack, running. Decorative repetition of the skills sheet
          below, so it is hidden from the reading order rather than read
          out twice. */}
      <div className={styles.ticker} aria-hidden="true">
        <div className={styles.tickerTrack}>
          {[0, 1].map((copy) => (
            <p key={copy} className={styles.tickerRun}>
              {SKILL_NAMES.map((name) => (
                <span key={name} className={styles.tickerItem}>
                  {name}
                </span>
              ))}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
