'use client';

import { useTranslations } from 'next-intl';
import { m } from 'motion/react';
import SectionWrapper from '@components/@atoms/SectionWrapper';
import ExperienceCard from '@components/@molecules/ExperienceCard';
import { experiences } from '@lib/data/experience';
import { fadeUp, stagger } from '@lib/animations';
import styles from './ExperienceSection.module.scss';

const experienceStagger = stagger(0.1);

export default function ExperienceSection() {
  const t = useTranslations('experience');

  return (
    <SectionWrapper id="experience">
      <m.div
        className={styles.content}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={experienceStagger}
      >
        <m.h2 variants={fadeUp} className={styles.heading}>
          {t('heading')}
        </m.h2>
        <div className={styles.timeline}>
          {experiences.map((exp) => (
            <m.div key={exp.key} variants={fadeUp}>
              <ExperienceCard experienceKey={exp.key} period={exp.period} />
            </m.div>
          ))}
        </div>
      </m.div>
    </SectionWrapper>
  );
}
