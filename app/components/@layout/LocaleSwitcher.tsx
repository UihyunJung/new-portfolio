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
    <button className={styles.switcher} onClick={switchLocale} type="button">
      {/* 두 글자 코드만으로는 "언어 컨트롤"이라는 맥락이 서지 않아 아이콘이
          그 역할을 맡는다. 코드 자체는 동작 기준이다 — 지금 언어가 아니라
          누르면 바뀔 언어를 가리킨다. */}
      <Languages size={14} aria-hidden="true" />
      {locale === 'ko' ? 'EN' : 'KO'}
      {/* aria-label로 덮지 않는다. 보이는 "EN"이 접근성 이름에 남아야 음성
          제어로 부를 수 있고(2.5.3), 설명은 바뀔 언어로 적으므로 lang을
          붙여야 리더가 그 언어로 읽는다. */}
      {locale === 'ko' ? (
        <span className="sr-only" lang="en">
          {' '}
          Switch to English
        </span>
      ) : (
        <span className="sr-only" lang="ko">
          {' '}
          한국어로 전환
        </span>
      )}
    </button>
  );
}
