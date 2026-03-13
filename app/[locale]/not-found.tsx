import { useTranslations } from 'next-intl';
import { Link } from '@i18n/navigation';
import styles from '@components/@atoms/ErrorPage.module.scss';

export default function NotFound() {
  const t = useTranslations('notFound');

  return (
    <div className={styles.container}>
      <h1 className={styles.title404}>{t('title')}</h1>
      <p className={styles.description}>{t('description')}</p>
      <Link href="/" className={styles.link}>
        {t('home')}
      </Link>
    </div>
  );
}
