'use client';

import { useTranslations } from 'next-intl';
import { m } from 'motion/react';
import SectionWrapper from '@components/@atoms/SectionWrapper';
import { fadeUp, stagger } from '@lib/animations';
import styles from './AboutSection.module.scss';

const aboutStagger = stagger(0.1);

export default function AboutSection() {
  const t = useTranslations('about');
  const highlights = ['highlight1', 'highlight2', 'highlight3'] as const;

  return (
    <SectionWrapper id="about">
      <m.div
        variants={aboutStagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        <m.h2 variants={fadeUp} className={styles.heading}>
          {t('heading')}
        </m.h2>
        <m.p variants={fadeUp} className={styles.bio}>
          {t('bio')}
        </m.p>
        <m.div variants={fadeUp} className={styles.highlights}>
          {highlights.map((key) => (
            <div key={key} className={styles.card}>
              <span className={styles.cardValue}>{t(`${key}.value`)}</span>
              <span className={styles.cardLabel}>{t(`${key}.label`)}</span>
            </div>
          ))}
        </m.div>
      </m.div>
    </SectionWrapper>
  );
}
