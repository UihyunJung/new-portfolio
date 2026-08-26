import { useTranslations } from 'next-intl';
import SectionWrapper from '@components/@atoms/SectionWrapper';
import SectionHeading from '@components/@atoms/SectionHeading';
import { skillCategories } from '@lib/data/skills';
import styles from './SkillsSection.module.scss';

export default function SkillsSection() {
  const t = useTranslations('skills');

  return (
    <SectionWrapper id="skills" surface>
      <SectionHeading>{t('heading')}</SectionHeading>

      {/* 표 형식 스펙 시트 — 이름, 값, 각주. 헤어라인 행과 등폭 숫자.
          아이콘도 칩도 카드도 없다. */}
      <dl className={styles.sheet}>
        {skillCategories.map((category) => (
          <div key={category.key} className={styles.row}>
            <dt className={styles.key}>{t(`categories.${category.key}`)}</dt>
            <dd className={styles.value}>
              {category.skills.map((skill) => skill.name).join('  ·  ')}
            </dd>
            <span className={styles.count} aria-hidden="true">
              {String(category.skills.length).padStart(2, '0')}
            </span>
          </div>
        ))}
      </dl>
    </SectionWrapper>
  );
}
