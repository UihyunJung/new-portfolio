'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import clsx from 'clsx';
import { Menu, X } from 'lucide-react';
import useActiveSection from '@hooks/useActiveSection';
import { scrollToSection, scrollToTop } from '@lib/scrollTo';
import ThemeToggle from './ThemeToggle';
import LocaleSwitcher from './LocaleSwitcher';
import styles from './Header.module.scss';

const NAV_ITEMS = [
  'about',
  'skills',
  'experience',
  'projects',
  'contact',
] as const;

export default function Header() {
  const t = useTranslations('nav');
  const activeSection = useActiveSection();
  const [menuOpen, setMenuOpen] = useState(false);

  // No body scroll lock here. `overflow: hidden` on <body> makes it a scroll
  // container, which re-parents the sticky bar from the viewport to the body
  // box — it jumps to the top of the document and vanishes.

  const go = (id: string) => {
    setMenuOpen(false);
    scrollToSection(id);
  };

  const home = (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuOpen(false);
    scrollToTop();
  };

  return (
    <>
      <header className={styles.bar}>
        <div className={styles.inner}>
          <a href="#hero" className={styles.mark} onClick={home}>
            UJ
          </a>

          {/* A numbered section index, not a link row — it carries the
              reading position the way the side-rail did. No CTA button. */}
          <nav className={styles.index} aria-label={t('landmark')}>
            <ul className={styles.indexList}>
              {NAV_ITEMS.map((item, i) => {
                const isActive = activeSection === item;
                return (
                  <li key={item}>
                    <button
                      type="button"
                      className={clsx(
                        styles.indexLink,
                        isActive && styles.isActive,
                      )}
                      aria-current={isActive ? 'true' : undefined}
                      onClick={() => go(item)}
                    >
                      <span className={styles.indexNum} aria-hidden="true">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      {t(item)}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className={styles.actions}>
            <ThemeToggle />
            <LocaleSwitcher />
            <button
              type="button"
              className={styles.menuBtn}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? t('closeMenu') : t('openMenu')}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
            >
              {menuOpen ? (
                <X size={20} aria-hidden="true" />
              ) : (
                <Menu size={20} aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </header>

      <nav
        id="mobile-nav"
        className={clsx(styles.sheet, menuOpen && styles.sheetOpen)}
        aria-label={t('landmark')}
        inert={!menuOpen ? true : undefined}
      >
        <ul className={styles.sheetInner}>
          {NAV_ITEMS.map((item, i) => {
            const isActive = activeSection === item;
            return (
              <li key={item}>
                <button
                  type="button"
                  className={clsx(styles.sheetLink, isActive && styles.isActive)}
                  aria-current={isActive ? 'true' : undefined}
                  onClick={() => go(item)}
                >
                  <span className={styles.sheetIndex} aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {t(item)}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
