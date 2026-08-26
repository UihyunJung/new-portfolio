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

      {/* 번호가 붙은 수치 띠 — 실제 숫자를 헤어라인으로 나눈다. 동일한 카드
          세 장을 대체했고, 숫자가 섹션을 지탱하며 처음 스크롤될 때 한 번
          올라간다. */}
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
