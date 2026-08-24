import { useTranslations } from 'next-intl';
import SectionWrapper from '@components/@atoms/SectionWrapper';
import styles from './AboutSection.module.scss';

const HIGHLIGHTS = ['highlight1', 'highlight2', 'highlight3'] as const;

export default function AboutSection() {
  const t = useTranslations('about');

  return (
    <SectionWrapper id="about" rhythm="normal">
      {/* S2 · Hanging — the heading floats in negative space. No eyebrow. */}
      <h2 className={styles.heading}>{t('heading')}</h2>

      <p className={styles.bio}>{t('bio')}</p>

      {/* T4 · Numbered stat strip — real figures, hairline-divided.
          Replaces three equal cards; the numbers carry the section. */}
      <dl className={styles.strip}>
        {HIGHLIGHTS.map((key) => (
          <div key={key} className={styles.stat}>
            <dt className={styles.value}>{t(`${key}.value`)}</dt>
            <dd className={styles.label}>{t(`${key}.label`)}</dd>
          </div>
        ))}
      </dl>
    </SectionWrapper>
  );
}
