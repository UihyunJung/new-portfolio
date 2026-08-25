'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
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

  // The index's tick is one bar that moves between entries rather than five
  // that fade — the reading position is a single object, so it should look
  // like one. It follows the cursor while the index is hovered and returns
  // to the section actually on screen when it leaves.
  //
  // Position is written straight to the element as custom properties. It is
  // measured from the DOM and consumed by the DOM; routing it through state
  // would only add a render per scroll-driven section change.
  const listRef = useRef<HTMLUListElement>(null);
  const tickRef = useRef<HTMLSpanElement>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const target = hovered ?? activeSection;

  const measure = useCallback(() => {
    const list = listRef.current;
    const tick = tickRef.current;
    if (!list || !tick) return;

    const entry = list.querySelector<HTMLElement>(`[data-nav='${target}']`);
    // Width is 0 while the index is display:none below the wide breakpoint,
    // and there is no entry at all for the hero.
    if (!entry || entry.offsetWidth === 0) {
      tick.dataset.on = 'false';
      return;
    }

    // A 1px bar scaled to width: the whole move stays on the compositor.
    tick.style.setProperty('--tick-x', `${entry.offsetLeft}px`);
    tick.style.setProperty('--tick-scale', String(entry.offsetWidth));

    if (tick.dataset.on !== 'true') {
      tick.dataset.on = 'true';
      // Transitions switch on a frame later, so the tick's first appearance
      // is a fade in place rather than a slide from the left edge.
      requestAnimationFrame(() => {
        if (tickRef.current) tickRef.current.dataset.settled = 'true';
      });
    }
  }, [target]);

  useEffect(() => {
    measure();
  }, [measure]);

  useEffect(() => {
    const list = listRef.current;
    if (!list || typeof ResizeObserver === 'undefined') return;

    const observer = new ResizeObserver(() => measure());
    observer.observe(list);
    return () => observer.disconnect();
  }, [measure]);

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
            <div className={styles.indexTrack}>
              <ul
                ref={listRef}
                className={styles.indexList}
                onMouseLeave={() => setHovered(null)}
              >
                {NAV_ITEMS.map((item, i) => {
                  const isActive = activeSection === item;
                  return (
                    <li key={item}>
                      <button
                        type="button"
                        data-nav={item}
                        className={clsx(
                          styles.indexLink,
                          isActive && styles.isActive,
                        )}
                        aria-current={isActive ? 'true' : undefined}
                        onClick={() => go(item)}
                        onMouseEnter={() => setHovered(item)}
                        onFocus={() => setHovered(item)}
                        onBlur={() => setHovered(null)}
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

              <span ref={tickRef} className={styles.tick} aria-hidden="true" />
            </div>
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

        {/* Reading progress, tied to the document scroller in CSS. No
            listener, no state, nothing to hydrate — and nothing at all in
            a browser without scroll timelines. */}
        <span className={styles.progress} aria-hidden="true" />
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
