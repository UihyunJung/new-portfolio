import { useTranslations } from 'next-intl';
import SectionWrapper from '@components/@atoms/SectionWrapper';
import SectionHeading from '@components/@atoms/SectionHeading';
import StatValue from '@components/@atoms/StatValue';
import styles from './AboutSection.module.scss';

const HIGHLIGHTS = ['highlight1', 'highlight2', 'highlight3'] as const;

export default function AboutSection() {
  const t = useTranslations('about');

  return (
    <SectionWrapper id="about">
      <SectionHeading>{t('heading')}</SectionHeading>

      <p className={styles.bio}>{t('bio')}</p>

      {/* T4 · Numbered stat strip — real figures, hairline-divided.
          Replaces three equal cards; the numbers carry the section, and
          they count up the first time they are scrolled to. */}
      <dl className={styles.strip}>
        {HIGHLIGHTS.map((key) => (
          <div key={key} className={styles.stat}>
            <dt className={styles.value}>
              <StatValue>{t(`${key}.value`)}</StatValue>
            </dt>
            <dd className={styles.label}>{t(`${key}.label`)}</dd>
          </div>
        ))}
      </dl>
    </SectionWrapper>
  );
}
