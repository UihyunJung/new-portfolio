import { useTranslations } from 'next-intl';
import styles from './ExperienceCard.module.scss';

interface ExperienceCardProps {
  experienceKey: string;
  period: string;
}

export default function ExperienceCard({
  experienceKey,
  period,
}: ExperienceCardProps) {
  const t = useTranslations('experience');

  return (
    <article className={styles.row}>
      <p className={styles.period}>{period}</p>
      <div className={styles.record}>
        <h3 className={styles.company}>
          {t(`items.${experienceKey}.company`)}
        </h3>
        <p className={styles.role}>{t(`items.${experienceKey}.role`)}</p>
        <p className={styles.description}>
          {t(`items.${experienceKey}.description`)}
        </p>
      </div>
    </article>
  );
}
