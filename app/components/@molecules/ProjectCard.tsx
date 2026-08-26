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
 * ProjectsSection의 행이 펼치는 프로젝트 본문.
 *
 * 전부 항목명 위에 내용이 오는 구조다. 왼쪽은 좁은 필드 레일, 오른쪽은 리드
 * 문장과 라벨이 붙은 그룹들. 항목명은 11px mono에 --color-muted, 내용은 본문
 * 서체에 먹색이다. 서체·크기·굵기·명도가 모두 다른 이유는, 크기가 1px 차이
 * 나는 두 가지는 계층이 아니기 때문이다.
 *
 * 마지막 그룹은 그 프로젝트의 증거이고, 실제로 가진 것에 따라 내용이 달라진다 —
 * 화면, 고객사 원장, 또는 보여줄 수 없다는 사유.
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
        {/* 라벨이 없는 유일한 블록이고 나머지보다 한 단계 크고 진하다.
            그래서 리드로 읽힌다. */}
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
