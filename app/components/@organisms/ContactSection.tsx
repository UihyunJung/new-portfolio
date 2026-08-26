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
      /* 클립보드 API를 쓸 수 없는 경우(예: 비보안 컨텍스트) — 조용히 넘긴다 */
    }
  };

  return (
    <SectionWrapper id="contact">
      <SectionHeading>{t('heading')}</SectionHeading>
      <p className={styles.description}>{t('description')}</p>

      <div className={styles.emailRow}>
        {/* 타이포그래피 링크 — 그라데이션 글자 채움이 아니라 단색 잉크. */}
        <a href={`mailto:${EMAIL}`} className={styles.email}>
          {EMAIL}
        </a>
        <button
          type="button"
          className={styles.copyBtn}
          onClick={copyEmail}
          data-state={copied ? 'success' : 'idle'}
        >
          {/* 두 표시를 항상 마운트해 둬야 교체가 툭 튀지 않고 크로스페이드가
              된다. 조건부 렌더는 전이할 출발점이 없다. */}
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
