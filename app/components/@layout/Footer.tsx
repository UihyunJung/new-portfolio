import { useTranslations } from 'next-intl';
import { Github, Linkedin, Mail } from 'lucide-react';
import { socialLinks } from '@lib/data/socialLinks';
import styles from './Footer.module.scss';

const ICON_MAP = {
  github: Github,
  linkedin: Linkedin,
  email: Mail,
} as const;

export default function Footer() {
  const t = useTranslations('footer');
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.links}>
          {socialLinks.map((link) => {
            const Icon = ICON_MAP[link.icon];
            return (
              <a
                key={link.key}
                href={link.href}
                className={styles.iconLink}
                target={link.href.startsWith('mailto') ? undefined : '_blank'}
                rel={
                  link.href.startsWith('mailto')
                    ? undefined
                    : 'noopener noreferrer'
                }
                aria-label={link.key}
              >
                <Icon size={20} />
              </a>
            );
          })}
        </div>
        <p className={styles.copyright}>{t('copyright', { year })}</p>
      </div>
    </footer>
  );
}
