import { useTranslations } from 'next-intl';
import SectionWrapper from '@components/@atoms/SectionWrapper';
import ExperienceCard from '@components/@molecules/ExperienceCard';
import { experiences } from '@lib/data/experience';
import styles from './ExperienceSection.module.scss';

export default function ExperienceSection() {
  const t = useTranslations('experience');

  return (
    <SectionWrapper id="experience">
      <h2 className={styles.heading}>{t('heading')}</h2>

      {/* An index of ruled rows — period in the margin, the record beside it. */}
      <div className={styles.index}>
        {experiences.map((exp) => (
          <ExperienceCard
            key={exp.key}
            experienceKey={exp.key}
            period={exp.period}
          />
        ))}
      </div>
    </SectionWrapper>
  );
}
