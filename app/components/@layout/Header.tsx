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
  const a11y = useTranslations('a11y');
  const activeSection = useActiveSection();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuBtnRef = useRef<HTMLButtonElement>(null);

  // 열린 시트는 Esc로 닫히고 포커스는 연 버튼으로 돌아간다. 시트는 닫히면
  // inert라 포커스를 돌려주지 않으면 body로 떨어진다.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setMenuOpen(false);
      menuBtnRef.current?.focus();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  // 인덱스의 틱은 다섯 개가 페이드하는 게 아니라 항목 사이를 움직이는 바
  // 하나다. 읽는 위치는 단일한 물체이므로 하나처럼 보여야 한다. 인덱스에
  // hover하는 동안은 커서를 따라가고, 벗어나면 실제로 화면에 있는 섹션으로
  // 돌아간다.
  //
  // 위치는 커스텀 프로퍼티로 요소에 직접 쓴다. DOM에서 재서 DOM이 쓰는
  // 값이라, 상태를 거치면 스크롤로 섹션이 바뀔 때마다 렌더가 하나 늘 뿐이다.
  const listRef = useRef<HTMLUListElement>(null);
  const tickRef = useRef<HTMLSpanElement>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const target = hovered ?? activeSection;

  const measure = useCallback(() => {
    const list = listRef.current;
    const tick = tickRef.current;
    if (!list || !tick) return;

    const entry = list.querySelector<HTMLElement>(`[data-nav='${target}']`);
    // 와이드 브레이크포인트 아래에서는 인덱스가 display:none이라 폭이 0이고,
    // 히어로에는 대응하는 항목 자체가 없다.
    if (!entry || entry.offsetWidth === 0) {
      tick.dataset.on = 'false';
      return;
    }

    // 1px 바를 폭만큼 늘린다. 이동 전체가 컴포지터에 남는다.
    tick.style.setProperty('--tick-x', `${entry.offsetLeft}px`);
    tick.style.setProperty('--tick-scale', String(entry.offsetWidth));

    if (tick.dataset.on !== 'true') {
      tick.dataset.on = 'true';
      // 전이는 한 프레임 뒤에 켜진다. 그래야 틱의 첫 등장이 왼쪽 끝에서
      // 미끄러져 오는 게 아니라 제자리에서 나타나는 페이드가 된다.
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

  // 여기서 body 스크롤을 잠그지 않는다. <body>의 `overflow: hidden`은 body를
  // 스크롤 컨테이너로 만들고, 그러면 sticky 바의 기준이 뷰포트에서 body 박스로
  // 옮겨간다 — 바가 문서 맨 위로 튀어 올라가 사라진다.

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
            <span className="sr-only"> {a11y('home')}</span>
          </a>

          {/* 링크 줄이 아니라 번호가 붙은 섹션 인덱스. 사이드 레일이 하던 것처럼
              읽는 위치를 나른다. CTA 버튼은 없다. */}
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
              ref={menuBtnRef}
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

        {/* 읽기 진행률. CSS에서 문서 스크롤러에 묶는다. 리스너도 상태도
            하이드레이션할 것도 없고, 스크롤 타임라인이 없는 브라우저에서는
            아무것도 그리지 않는다. */}
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
                  className={clsx(
                    styles.sheetLink,
                    isActive && styles.isActive,
                  )}
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
