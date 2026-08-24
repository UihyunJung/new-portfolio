import { useTranslations } from 'next-intl';
import SectionWrapper from '@components/@atoms/SectionWrapper';
import ProjectCard from '@components/@molecules/ProjectCard';
import { projects } from '@lib/data/projects';
import styles from './ProjectsSection.module.scss';

const anchorId = (key: string) => `project-${key}`;

export default function ProjectsSection() {
  const t = useTranslations('projects');

  return (
    <SectionWrapper id="projects" rhythm="wide">
      <h2 className={styles.heading}>{t('heading')}</h2>

      {/* An overview layer. The blocks below give depth; this gives the
          reader the shape of the whole set in one glance. Plain anchors —
          the reset's scroll-behaviour already honours reduced motion. */}
      <ol className={styles.index}>
        {projects.map((project, i) => (
          <li key={project.key}>
            <a href={`#${anchorId(project.key)}`} className={styles.indexLink}>
              <span className={styles.indexNum} aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className={styles.indexTitle}>
                {t(`items.${project.key}.title`)}
              </span>
              <span className={styles.indexType}>
                {t(
                  project.type === 'work'
                    ? 'typeBadgeWork'
                    : 'typeBadgePersonal',
                )}
              </span>
            </a>
          </li>
        ))}
      </ol>

      {/* Workbench — a sequence of artifact blocks, not a grid of cards. */}
      <div className={styles.sequence}>
        {projects.map((project) => (
          <ProjectCard
            key={project.key}
            id={anchorId(project.key)}
            projectKey={project.key}
            type={project.type}
            techStack={project.techStack}
            highlightKeys={project.highlightKeys}
            links={project.links}
          />
        ))}
      </div>
    </SectionWrapper>
  );
}
