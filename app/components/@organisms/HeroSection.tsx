'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { m } from 'motion/react';
import { ArrowDown } from 'lucide-react';
import { fadeUp, stagger } from '@lib/animations';
import styles from './HeroSection.module.scss';

const heroStagger = stagger(0.15);

export default function HeroSection() {
  const t = useTranslations('hero');
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches && videoRef.current) {
      videoRef.current.pause();
    }
  }, []);

  const scrollToAbout = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className={styles.hero}>
      {/* Video background */}
      <div className={styles.videoBg} aria-hidden="true">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          poster="/videos/hero-bg-poster.jpg"
          className={styles.video}
        >
          <source src="/videos/hero-bg.mp4" type="video/mp4" />
        </video>
        <div className={styles.videoOverlay} />
      </div>

      <div className={styles.container}>
        <m.div
          variants={heroStagger}
          initial="hidden"
          animate="visible"
          className={styles.content}
        >
          <m.p variants={fadeUp} className={styles.greeting}>
            {t('greeting')}
          </m.p>
          <m.h1 variants={fadeUp} className={styles.name}>
            {t('name')}
          </m.h1>
          <m.p variants={fadeUp} className={styles.title}>
            {t('title')}
          </m.p>
          <m.p variants={fadeUp} className={styles.description}>
            {t('description')}
          </m.p>
          <m.div variants={fadeUp}>
            <button
              type="button"
              className={styles.cta}
              onClick={scrollToAbout}
              aria-label={t('ctaAriaLabel')}
            >
              <ArrowDown size={24} />
            </button>
          </m.div>
        </m.div>
      </div>
    </section>
  );
}
