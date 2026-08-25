import { useTranslations } from 'next-intl';
import SectionWrapper from '@components/@atoms/SectionWrapper';
import SectionHeading from '@components/@atoms/SectionHeading';
import ExperienceCard from '@components/@molecules/ExperienceCard';
import { experiences } from '@lib/data/experience';
import styles from './ExperienceSection.module.scss';

export default function ExperienceSection() {
  const t = useTranslations('experience');

  return (
    <SectionWrapper id="experience">
      <SectionHeading>{t('heading')}</SectionHeading>

      {/* An index of ruled rows — period in the margin, the record beside
          it, and a rail down the gutter that fills as the section passes.
          The rail is the only place scroll position is drawn literally. */}
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
