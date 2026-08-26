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

      {/* 규칙선으로 나뉜 행의 인덱스 — 기간은 여백에, 기록은 그 옆에, 섹션이
          지나가는 동안 채워지는 레일이 홈통을 따라 내려간다. 스크롤 위치를
          문자 그대로 그리는 유일한 곳이다. */}
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
