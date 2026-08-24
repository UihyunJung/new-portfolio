import clsx from 'clsx';
import styles from './SectionWrapper.module.scss';

type Rhythm = 'tight' | 'normal' | 'wide';

interface SectionWrapperProps {
  id: string;
  children: React.ReactNode;
  /** Sections deliberately do not share vertical padding. */
  rhythm?: Rhythm;
  className?: string;
}

export default function SectionWrapper({
  id,
  children,
  rhythm = 'normal',
  className,
}: SectionWrapperProps) {
  return (
    <section
      id={id}
      data-rhythm={rhythm}
      className={clsx(styles.section, className)}
    >
      <div className={styles.shell}>{children}</div>
    </section>
  );
}
