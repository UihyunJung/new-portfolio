'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { ArrowUp } from 'lucide-react';
import { scrollToTop } from '@lib/scrollTo';
import styles from './ScrollToTop.module.scss';

export default function ScrollToTop() {
  const t = useTranslations('nav');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className={styles.container}>
      {visible && (
        <button
          className={styles.btn}
          onClick={scrollToTop}
          type="button"
          aria-label={t('backToTop')}
        >
          <ArrowUp size={18} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
