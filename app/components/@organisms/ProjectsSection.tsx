'use client';

import { useTranslations } from 'next-intl';
import { m } from 'motion/react';
import SectionWrapper from '@components/@atoms/SectionWrapper';
import ProjectCard from '@components/@molecules/ProjectCard';
import { projects } from '@lib/data/projects';
import { fadeUp, stagger } from '@lib/animations';
import styles from './ProjectsSection.module.scss';

const projectsStagger = stagger(0.15);

export default function ProjectsSection() {
  const t = useTranslations('projects');

  return (
    <SectionWrapper id="projects">
      <m.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={projectsStagger}
      >
        <m.h2 variants={fadeUp} className={styles.heading}>
          {t('heading')}
        </m.h2>
        <div className={styles.grid}>
          {projects.map((project) => (
            <m.div key={project.key} variants={fadeUp}>
              <ProjectCard
                projectKey={project.key}
                type={project.type}
                techStack={project.techStack}
                highlightKeys={project.highlightKeys}
                links={project.links}
              />
            </m.div>
          ))}
        </div>
      </m.div>
    </SectionWrapper>
  );
}
