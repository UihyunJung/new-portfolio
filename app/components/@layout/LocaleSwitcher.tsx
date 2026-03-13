'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@i18n/navigation';
import styles from './LocaleSwitcher.module.scss';

export default function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = () => {
    const nextLocale = locale === 'ko' ? 'en' : 'ko';
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <button
      className={styles.switcher}
      onClick={switchLocale}
      aria-label={
        locale === 'ko' ? 'Switch to English' : '한국어로 전환'
      }
      type="button"
    >
      {locale === 'ko' ? 'EN' : 'KO'}
    </button>
  );
}
