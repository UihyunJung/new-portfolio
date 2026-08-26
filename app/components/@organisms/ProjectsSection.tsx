import { useTranslations } from 'next-intl';
import { ChevronDown } from 'lucide-react';
import SectionWrapper from '@components/@atoms/SectionWrapper';
import SectionHeading from '@components/@atoms/SectionHeading';
import ProjectCard from '@components/@molecules/ProjectCard';
import { projects } from '@lib/data/projects';
import styles from './ProjectsSection.module.scss';

const anchorId = (key: string) => `project-${key}`;

/**
 * 접힌 행에 보이는 첫 문장.
 *
 * 따로 쓰지 않고 설명문에서 뽑는다. 그래야 미리보기가 본문과 어긋나지 않고,
 * `.` `!` `?`는 한국어 카피와 영문 카피 모두에서 문장을 끝낸다.
 */
const opener = (text: string) => {
  const end = text.search(/[.!?](\s|$)/);
  return end === -1 ? text : text.slice(0, end + 1);
};

/**
 * 여섯 프로젝트를 펼침 목록으로.
 *
 * 이 섹션은 개요 인덱스와 여섯 개의 전체 블록을 함께 갖고 있었다. 같은 여섯
 * 개를 두 번 말하면서 약 5,400px를 썼고, 다른 섹션은 그 4분의 1이다. 이제
 * 인덱스가 곧 인터페이스이고 행이 제자리에서 열린다.
 *
 * React 상태가 아니라 `<details>`인 건 의도적이다. JS가 들지 않고, 모든 패널이
 * 서버 HTML에 있어 find-in-page·인쇄·하이드레이션 실패에서도 내용이 남으며,
 * 키보드와 스크린 리더 동작은 다시 구현할 필요 없이 브라우저 몫이다.
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
              // 첫 항목만 열어 둔다. 그래야 섹션이 링크 목록이 아니라 작업으로
              // 읽힌다. 나머지는 클릭 한 번 거리다.
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
