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

  // Always mounted, never conditionally rendered: an element that only
  // exists while it is visible has no state to transition *from*, so it can
  // only pop. `inert` keeps the hidden button out of the tab order.
  return (
    <div className={styles.container}>
      <button
        className={styles.btn}
        onClick={scrollToTop}
        type="button"
        aria-label={t('backToTop')}
        data-visible={visible ? 'true' : 'false'}
        inert={!visible ? true : undefined}
      >
        <ArrowUp size={18} aria-hidden="true" />
      </button>
    </div>
  );
}
