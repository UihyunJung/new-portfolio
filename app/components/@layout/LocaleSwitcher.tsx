'use client';

import { useTransition } from 'react';
import { useLocale } from 'next-intl';
import { Languages, LoaderCircle } from 'lucide-react';
import clsx from 'clsx';
import { useRouter, usePathname } from '@i18n/navigation';
import styles from './LocaleSwitcher.module.scss';

export default function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  // 언어 전환은 테마와 달리 서버 왕복이다(동적 라우트를 새 언어로 다시
  // 렌더). 1~2초 동안 아무 반응이 없으면 눌렸는지 알 수 없어서, 전환을
  // transition으로 감싸 끝날 때까지 대기 상태를 보여 준다.
  const [isPending, startTransition] = useTransition();

  const switchLocale = () => {
    if (isPending) return; // 대기 중 재클릭은 요청만 중복시킨다
    const nextLocale = locale === 'ko' ? 'en' : 'ko';
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <button
      className={clsx(styles.switcher, isPending && styles.isPending)}
      onClick={switchLocale}
      type="button"
      aria-busy={isPending}
    >
      {/* 두 글자 코드만으로는 "언어 컨트롤"이라는 맥락이 서지 않아 아이콘이
          그 역할을 맡는다. 코드 자체는 동작 기준이다 — 지금 언어가 아니라
          누르면 바뀔 언어를 가리킨다. 대기 중에는 같은 자리에서 아이콘만
          스피너로 바뀌어 버튼 폭이 흔들리지 않는다. 라벨은 미리 뒤집지
          않는다 — 실패하면 거짓이 된다. */}
      {isPending ? (
        <LoaderCircle size={14} aria-hidden="true" className={styles.spinner} />
      ) : (
        <Languages size={14} aria-hidden="true" />
      )}
      <span className={styles.code}>{locale === 'ko' ? 'EN' : 'KO'}</span>
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
