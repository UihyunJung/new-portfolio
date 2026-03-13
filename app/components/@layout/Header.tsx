'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import clsx from 'clsx';
import { Menu, X } from 'lucide-react';
import useActiveSection from '@hooks/useActiveSection';
import ThemeToggle from './ThemeToggle';
import LocaleSwitcher from './LocaleSwitcher';
import styles from './Header.module.scss';

const NAV_ITEMS = ['about', 'skills', 'experience', 'projects', 'contact'] as const;

export default function Header() {
  const t = useTranslations('nav');
  const activeSection = useActiveSection();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // 메뉴 열린 상태에서 스크롤 방지
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const scrollToSection = (id: string) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={clsx(styles.header, (scrolled || menuOpen) && styles.headerScrolled)}>
      <div className={styles.container}>
        <a
          href="#hero"
          className={styles.logo}
          onClick={(e) => {
            e.preventDefault();
            setMenuOpen(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          UJ
        </a>

        <nav className={styles.nav}>
          {NAV_ITEMS.map((item) => (
            <button
              key={item}
              className={clsx(styles.navLink, activeSection === item && styles.active)}
              onClick={() => scrollToSection(item)}
              type="button"
            >
              {t(item)}
            </button>
          ))}
        </nav>

        <div className={styles.actions}>
          <ThemeToggle />
          <LocaleSwitcher />
          <button
            className={styles.menuBtn}
            onClick={() => setMenuOpen(!menuOpen)}
            type="button"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <nav className={clsx(styles.mobileNav, menuOpen && styles.mobileNavOpen)} inert={!menuOpen ? true : undefined}>
        <div className={styles.mobileNavInner}>
          {NAV_ITEMS.map((item) => (
            <button
              key={item}
              className={clsx(styles.mobileNavLink, activeSection === item && styles.active)}
              onClick={() => scrollToSection(item)}
              type="button"
            >
              {t(item)}
            </button>
          ))}
        </div>
      </nav>
    </header>
  );
}
