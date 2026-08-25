'use client';

import { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Copy, Check } from 'lucide-react';
import SectionWrapper from '@components/@atoms/SectionWrapper';
import SectionHeading from '@components/@atoms/SectionHeading';
import { socialLinks } from '@lib/data/socialLinks';
import styles from './ContactSection.module.scss';

const EMAIL = 'uihyun.jung@gmail.com';

export default function ContactSection() {
  const t = useTranslations('contact');
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard API unavailable (e.g. insecure context) — silently ignore */
    }
  };

  return (
    <SectionWrapper id="contact">
      <SectionHeading>{t('heading')}</SectionHeading>
      <p className={styles.description}>{t('description')}</p>

      <div className={styles.emailRow}>
        {/* C3 · Typographic link — solid ink, not a gradient text fill. */}
        <a href={`mailto:${EMAIL}`} className={styles.email}>
          {EMAIL}
        </a>
        <button
          type="button"
          className={styles.copyBtn}
          onClick={copyEmail}
          data-state={copied ? 'success' : 'idle'}
        >
          {/* Both marks are always mounted so the swap can be a crossfade
              rather than a pop — a conditional render has nothing to
              transition from. */}
          <span className={styles.copyIcon} aria-hidden="true">
            <Copy size={13} className={styles.copyIdle} />
            <Check size={13} className={styles.copyDone} />
          </span>
          {copied ? t('copied') : t('copy')}
        </button>
      </div>

      <ul className={styles.links}>
        {socialLinks
          .filter((link) => link.icon !== 'email')
          .map((link) => (
            <li key={link.key}>
              <a
                href={link.href}
                className={styles.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t(`links.${link.key}`)}
              </a>
            </li>
          ))}
      </ul>
    </SectionWrapper>
  );
}
