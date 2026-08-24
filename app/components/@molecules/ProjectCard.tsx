import { useTranslations } from 'next-intl';
import { ArrowUpRight } from 'lucide-react';
import styles from './ProjectCard.module.scss';

interface ProjectCardProps {
  /** Anchor target for the section's overview index. */
  id: string;
  projectKey: string;
  type: 'work' | 'personal';
  techStack: string[];
  highlightKeys: string[];
  links?: {
    github?: string;
    live?: string;
  };
}

export default function ProjectCard({
  id,
  projectKey,
  type,
  techStack,
  highlightKeys,
  links,
}: ProjectCardProps) {
  const t = useTranslations('projects');

  return (
    <article id={id} className={styles.block}>
      <header className={styles.head}>
        <h3 className={styles.title}>{t(`items.${projectKey}.title`)}</h3>
        <span className={styles.type}>
          {t(type === 'work' ? 'typeBadgeWork' : 'typeBadgePersonal')}
        </span>
      </header>

      <p className={styles.description}>
        {t(`items.${projectKey}.description`)}
      </p>

      {/* The artifact: a typographic frame carrying the real manifest. */}
      <dl className={styles.manifest}>
        <div className={styles.manifestRow}>
          <dt className={styles.manifestKey}>{t('roleLabel')}</dt>
          <dd className={styles.manifestValue}>
            {t(`items.${projectKey}.role`)}
          </dd>
        </div>
        <div className={styles.manifestRow}>
          <dt className={styles.manifestKey}>{t('stackLabel')}</dt>
          <dd className={styles.manifestValue}>{techStack.join('  ·  ')}</dd>
        </div>
      </dl>

      <ul className={styles.highlights}>
        {highlightKeys.map((hKey) => (
          <li key={hKey} className={styles.highlight}>
            {t(`items.${projectKey}.highlights.${hKey}`)}
          </li>
        ))}
      </ul>

      {links && (links.github || links.live) && (
        <p className={styles.links}>
          {links.github && (
            <a
              href={links.github}
              className={styles.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('linkGithub')}
              <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          )}
          {links.live && (
            <a
              href={links.live}
              className={styles.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('linkLive')}
              <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          )}
        </p>
      )}
    </article>
  );
}
