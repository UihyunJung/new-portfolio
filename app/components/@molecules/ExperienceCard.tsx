import { useTranslations } from 'next-intl';
import styles from './ExperienceCard.module.scss';

interface ExperienceCardProps {
  experienceKey: string;
  period: string;
}

export default function ExperienceCard({ experienceKey, period }: ExperienceCardProps) {
  const t = useTranslations('experience');

  return (
    <div className={styles.card}>
      <span className={styles.period}>{period}</span>
      <div className={styles.content}>
        <h3 className={styles.company}>{t(`items.${experienceKey}.company`)}</h3>
        <span className={styles.role}>{t(`items.${experienceKey}.role`)}</span>
        <p className={styles.description}>{t(`items.${experienceKey}.description`)}</p>
      </div>
    </div>
  );
}
