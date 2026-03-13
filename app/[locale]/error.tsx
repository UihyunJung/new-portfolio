'use client';

import { useTranslations } from 'next-intl';
import styles from '@components/@atoms/ErrorPage.module.scss';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('error');

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t('title')}</h1>
      <p className={styles.description}>{t('description')}</p>
      <button onClick={reset} type="button" className={styles.link}>
        {t('retry')}
      </button>
    </div>
  );
}
