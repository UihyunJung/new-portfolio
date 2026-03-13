import { useTranslations } from 'next-intl';
import { Github, ExternalLink, Briefcase, User } from 'lucide-react';
import styles from './ProjectCard.module.scss';

interface ProjectCardProps {
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
  projectKey,
  type,
  techStack,
  highlightKeys,
  links,
}: ProjectCardProps) {
  const t = useTranslations('projects');

  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <span className={styles.typeBadge} data-type={type}>
          {type === 'work' ? <Briefcase size={12} aria-hidden="true" /> : <User size={12} aria-hidden="true" />}
          {t(type === 'work' ? 'typeBadgeWork' : 'typeBadgePersonal')}
        </span>
        {links && (
          <div className={styles.links}>
            {links.github && (
              <a
                href={links.github}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.linkBtn}
                aria-label="GitHub"
              >
                <Github size={16} />
              </a>
            )}
            {links.live && (
              <a
                href={links.live}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.linkBtn}
                aria-label="Live Demo"
              >
                <ExternalLink size={16} />
              </a>
            )}
          </div>
        )}
      </div>

      <h3 className={styles.title}>{t(`items.${projectKey}.title`)}</h3>
      <p className={styles.description}>{t(`items.${projectKey}.description`)}</p>

      <p className={styles.role}>
        <span className={styles.roleLabel}>{t('roleLabel')}</span>
        {t(`items.${projectKey}.role`)}
      </p>

      <ul className={styles.highlights}>
        {highlightKeys.map((hKey) => (
          <li key={hKey} className={styles.highlight}>
            {t(`items.${projectKey}.highlights.${hKey}`)}
          </li>
        ))}
      </ul>

      <div className={styles.tags}>
        {techStack.map((tech) => (
          <span key={tech} className={styles.tag}>
            {tech}
          </span>
        ))}
      </div>
    </article>
  );
}
