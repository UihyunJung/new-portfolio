'use client';

import { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { m } from 'motion/react';
import { Github, Linkedin, Mail, Copy, Check } from 'lucide-react';
import SectionWrapper from '@components/@atoms/SectionWrapper';
import { socialLinks } from '@lib/data/socialLinks';
import { fadeUp, stagger } from '@lib/animations';
import styles from './ContactSection.module.scss';

const ICON_MAP = {
  github: Github,
  linkedin: Linkedin,
  email: Mail,
} as const;

const contactStagger = stagger(0.1);

export default function ContactSection() {
  const t = useTranslations('contact');
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText('uihyun.jung@gmail.com');
      setCopied(true);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard API unavailable (e.g. insecure context) — silently ignore */
    }
  };

  return (
    <SectionWrapper id="contact">
      <m.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={contactStagger}
        className={styles.content}
      >
        <m.h2 variants={fadeUp} className={styles.heading}>
          {t('heading')}
        </m.h2>
        <m.p variants={fadeUp} className={styles.description}>
          {t('description')}
        </m.p>
        <m.div variants={fadeUp} className={styles.emailRow}>
          <a href="mailto:uihyun.jung@gmail.com" className={styles.email}>
            uihyun.jung@gmail.com
          </a>
          <button type="button" className={styles.copyBtn} onClick={copyEmail}>
            {copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
            {copied ? t('copied') : t('copy')}
          </button>
        </m.div>
        <m.div variants={fadeUp} className={styles.links}>
          {socialLinks.map((link) => {
            const Icon = ICON_MAP[link.icon];
            return (
              <a
                key={link.key}
                href={link.href}
                target={link.icon !== 'email' ? '_blank' : undefined}
                rel={link.icon !== 'email' ? 'noopener noreferrer' : undefined}
                className={styles.iconLink}
                aria-label={link.key}
              >
                <Icon size={22} />
              </a>
            );
          })}
        </m.div>
      </m.div>
    </SectionWrapper>
  );
}
