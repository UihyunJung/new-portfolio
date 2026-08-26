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

  // 항상 마운트해 두고 조건부로 렌더링하지 않는다. 보이는 동안에만 존재하는
  // 요소는 전이할 출발 상태가 없어 툭 튀는 수밖에 없다. 숨은 버튼은 `inert`로
  // 탭 순서에서 빼둔다.
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
