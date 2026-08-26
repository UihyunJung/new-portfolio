'use client';

import { useTheme } from 'next-themes';
import { useSyncExternalStore } from 'react';
import { useTranslations } from 'next-intl';
import { Sun, Moon, Monitor } from 'lucide-react';
import clsx from 'clsx';
import styles from './ThemeToggle.module.scss';

// 둘이 아니라 셋인 이유: 프로바이더가 `defaultTheme="system"`으로 돌기
// 때문에, 라이트/다크 두 개만 두면 OS에 제어를 돌려줄 방법이 사라진다.
const OPTIONS = [
  { value: 'light', Icon: Sun },
  { value: 'dark', Icon: Moon },
  { value: 'system', Icon: Monitor },
] as const;

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export default function ThemeToggle() {
  const t = useTranslations('theme');
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  // 서버는 저장된 설정을 알 수 없다. 껍데기를 먼저 그려서 실제 컨트롤이
  // 마운트될 때 헤더가 다시 흐르지 않게 한다.
  if (!mounted) {
    return <div className={styles.group} aria-hidden="true" />;
  }

  // 배경 세 개가 크로스페이드하는 게 아니라, 썸 하나가 셋 사이를 미끄러진다.
  // 옵션 폭이 모두 같아서 위치는 순수한 산술이다 — 측정도 ref도 필요 없다.
  const activeIndex = OPTIONS.findIndex((option) => option.value === theme);

  return (
    <div className={styles.group} role="group" aria-label={t('label')}>
      {activeIndex >= 0 && (
        <span
          className={styles.thumb}
          style={{ '--thumb-index': activeIndex } as React.CSSProperties}
          aria-hidden="true"
        />
      )}
      {OPTIONS.map(({ value, Icon }) => {
        const selected = theme === value;
        return (
          <button
            key={value}
            type="button"
            data-option={value}
            className={clsx(styles.option, selected && styles.isSelected)}
            aria-pressed={selected}
            aria-label={t(value)}
            onClick={() => setTheme(value)}
          >
            <Icon size={15} aria-hidden="true" />
          </button>
        );
      })}
    </div>
  );
}
