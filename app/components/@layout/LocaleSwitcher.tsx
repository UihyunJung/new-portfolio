'use client';

import { useLocale } from 'next-intl';
import { Languages } from 'lucide-react';
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
      {/* The icon supplies the "this is a language control" context that a
          bare two-letter code can't. The code itself stays action-labelled:
          it names the language you get, not the one you're in. */}
      <Languages size={14} aria-hidden="true" />
      {locale === 'ko' ? 'EN' : 'KO'}
    </button>
  );
}
