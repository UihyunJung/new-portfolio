import { useTranslations } from 'next-intl';
import styles from './Footer.module.scss';

const SOURCE_URL = 'https://github.com/UihyunJung';

export default function Footer() {
  const t = useTranslations('footer');
  const year = new Date().getFullYear();

  return (
    <footer className={styles.foot}>
      <div className={styles.shell}>
        {/* 밀도 있는 타이포그래피 콜로폰 — 사이트맵이 아니라 크레딧이다. */}
        <dl className={styles.colophon}>
          <div className={styles.row}>
            <dt className={styles.key}>{t('builtLabel')}</dt>
            <dd className={styles.value}>{t('builtWith')}</dd>
          </div>
          <div className={styles.row}>
            <dt className={styles.key}>{t('typeLabel')}</dt>
            <dd className={styles.value}>{t('typeset')}</dd>
          </div>
          <div className={styles.row}>
            <dt className={styles.key}>{t('sourceLabel')}</dt>
            <dd className={styles.value}>
              <a
                href={SOURCE_URL}
                className={styles.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                github.com/UihyunJung
              </a>
            </dd>
          </div>
        </dl>

        <p className={styles.copyright}>{t('copyright', { year })}</p>
      </div>
    </footer>
  );
}
