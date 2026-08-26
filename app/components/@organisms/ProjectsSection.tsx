import { useTranslations } from 'next-intl';
import { ChevronDown } from 'lucide-react';
import SectionWrapper from '@components/@atoms/SectionWrapper';
import SectionHeading from '@components/@atoms/SectionHeading';
import ProjectCard from '@components/@molecules/ProjectCard';
import { projects } from '@lib/data/projects';
import styles from './ProjectsSection.module.scss';

const anchorId = (key: string) => `project-${key}`;

/**
 * The opening sentence, shown on the closed row.
 *
 * Derived rather than authored so it cannot drift from the description it
 * previews, and locale-agnostic: `.`, `!` and `?` all end a sentence in both
 * the Korean and the English copy.
 */
const opener = (text: string) => {
  const end = text.search(/[.!?](\s|$)/);
  return end === -1 ? text : text.slice(0, end + 1);
};

/**
 * Six projects as a disclosure list.
 *
 * This section used to carry an overview index AND six full-length blocks —
 * the same six projects, said twice, running about 5,400px on a page whose
 * other sections are a quarter of that. The index is now the interface: each
 * row opens in place.
 *
 * `<details>` rather than React state, deliberately. It costs no JavaScript,
 * every panel is in the server HTML (so find-in-page, print and a failed
 * hydration all still show the work), and the keyboard and screen-reader
 * behaviour is the browser's rather than something to re-implement.
 */
export default function ProjectsSection() {
  const t = useTranslations('projects');

  return (
    <SectionWrapper id="projects">
      <SectionHeading>{t('heading')}</SectionHeading>

      <ol className={styles.list}>
        {projects.map((project, i) => (
          <li key={project.key}>
            <details
              id={anchorId(project.key)}
              className={styles.item}
              // The first is open so the section reads as work rather than as
              // a list of links; the rest are one click away.
              open={i === 0}
            >
              <summary className={styles.row}>
                <span className={styles.num} aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className={styles.main}>
                  <h3 className={styles.title}>
                    {t(`items.${project.key}.title`)}
                  </h3>
                  <span className={styles.opener}>
                    {opener(t(`items.${project.key}.description`))}
                  </span>
                </span>
                <span className={styles.type}>
                  {t(
                    project.type === 'work'
                      ? 'typeBadgeWork'
                      : 'typeBadgePersonal',
                  )}
                </span>
                <ChevronDown
                  size={16}
                  className={styles.chevron}
                  aria-hidden="true"
                />
              </summary>

              <ProjectCard
                projectKey={project.key}
                type={project.type}
                techStack={project.techStack}
                highlightKeys={project.highlightKeys}
                shots={project.shots}
                confidential={project.confidential}
                ledger={project.ledger}
                links={project.links}
              />
            </details>
          </li>
        ))}
      </ol>
    </SectionWrapper>
  );
}
