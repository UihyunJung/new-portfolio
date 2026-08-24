'use client';

import { useTheme } from 'next-themes';
import { useSyncExternalStore } from 'react';
import { useTranslations } from 'next-intl';
import { Sun, Moon, Monitor } from 'lucide-react';
import clsx from 'clsx';
import styles from './ThemeToggle.module.scss';

// Three options, not two: the provider runs `defaultTheme="system"`, so a
// light/dark pair would strip the ability to hand control back to the OS.
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

  // The server can't know the stored preference; render the shell so the
  // header doesn't reflow once the real control mounts.
  if (!mounted) {
    return <div className={styles.group} aria-hidden="true" />;
  }

  return (
    <div className={styles.group} role="group" aria-label={t('label')}>
      {OPTIONS.map(({ value, Icon }) => {
        const selected = theme === value;
        return (
          <button
            key={value}
            type="button"
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
