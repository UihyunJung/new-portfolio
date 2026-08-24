import { useTranslations } from 'next-intl';
import SectionWrapper from '@components/@atoms/SectionWrapper';
import { skillCategories } from '@lib/data/skills';
import styles from './SkillsSection.module.scss';

export default function SkillsSection() {
  const t = useTranslations('skills');

  return (
    <SectionWrapper id="skills" surface>
      <h2 className={styles.heading}>{t('heading')}</h2>

      {/* F3 · Tabular spec sheet — name, value, footnote. Hairline rows,
          tabular numerics. No icons, no chips, no cards. */}
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
