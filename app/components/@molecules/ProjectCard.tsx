import { useTranslations } from 'next-intl';
import { ArrowUpRight, Lock } from 'lucide-react';
import ProjectShots from './ProjectShots';
import PublishingLedger from './PublishingLedger';
import type { Project } from '@lib/data/projects';
import styles from './ProjectCard.module.scss';

type ProjectCardProps = Pick<
  Project,
  | 'type'
  | 'techStack'
  | 'highlightKeys'
  | 'shots'
  | 'confidential'
  | 'ledger'
  | 'links'
> & { projectKey: string };

/**
 * The body of one project, revealed by its row in ProjectsSection.
 *
 * Everything here is a key over a value: a narrow rail of fields on the left,
 * and on the right a lede followed by labelled groups. The key is 11px mono at
 * `--color-muted`; the value is body-face ink. Family, size, weight and
 * lightness all differ, because two things a pixel apart in size are not a
 * hierarchy — the first pass proved that.
 *
 * The last group is the project's evidence, and its content depends on what
 * the project actually has: screens, a client ledger, or a stated reason there
 * are none.
 */
export default function ProjectCard({
  projectKey,
  type,
  techStack,
  highlightKeys,
  shots,
  confidential,
  ledger,
  links,
}: ProjectCardProps) {
  const t = useTranslations('projects');
  const hasLinks = Boolean(links?.github || links?.live);

  return (
    <div className={styles.panel}>
      <dl className={styles.rail}>
        <div className={styles.field}>
          <dt className={styles.key}>{t('typeLabel')}</dt>
          <dd className={styles.value}>
            {t(type === 'work' ? 'typeBadgeWork' : 'typeBadgePersonal')}
          </dd>
        </div>
        <div className={styles.field}>
          <dt className={styles.key}>{t('roleLabel')}</dt>
          <dd className={styles.value}>{t(`items.${projectKey}.role`)}</dd>
        </div>
        {hasLinks && (
          <div className={styles.field}>
            <dt className={styles.key}>{t('linkLabel')}</dt>
            <dd className={styles.value}>
              {links?.github && (
                <a
                  href={links.github}
                  className={styles.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t('linkGithub')}
                  <ArrowUpRight size={13} aria-hidden="true" />
                </a>
              )}
              {links?.live && (
                <a
                  href={links.live}
                  className={styles.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t('linkLive')}
                  <ArrowUpRight size={13} aria-hidden="true" />
                </a>
              )}
            </dd>
          </div>
        )}
      </dl>

      <div className={styles.body}>
        {/* The one unlabelled block, and a size and a shade above the rest —
            that is what makes it read as the lede. */}
        <p className={styles.description}>
          {t(`items.${projectKey}.description`)}
        </p>

        <section className={styles.group}>
          <h4 className={styles.groupKey}>{t('highlightsLabel')}</h4>
          <ul className={styles.highlights}>
            {highlightKeys.map((hKey) => (
              <li key={hKey} className={styles.highlight}>
                {t(`items.${projectKey}.highlights.${hKey}`)}
              </li>
            ))}
          </ul>
        </section>

        {shots && shots.length > 0 && (
          <section className={styles.group}>
            <h4 className={styles.groupKey}>
              {t('shotsLabel')} · {shots.length}
              <span className={styles.hint}>{t('shotsHint')}</span>
            </h4>
            <ProjectShots projectKey={projectKey} shots={shots} />
          </section>
        )}

        {ledger && (
          <section className={styles.group}>
            <h4 className={styles.groupKey}>{t('ledgerLabel')}</h4>
            <PublishingLedger />
          </section>
        )}

        {confidential && (
          <section className={styles.group}>
            <h4 className={styles.groupKey}>{t('accessLabel')}</h4>
            <p className={styles.sealed}>
              <Lock size={14} aria-hidden="true" />
              {t('confidential')}
            </p>
          </section>
        )}

        <section className={styles.group}>
          <h4 className={styles.groupKey}>
            {t('stackLabel')} · {techStack.length}
          </h4>
          <ul className={styles.chips}>
            {techStack.map((tech) => (
              <li key={tech} className={styles.chip}>
                {tech}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
