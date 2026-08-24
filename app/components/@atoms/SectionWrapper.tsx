import clsx from 'clsx';
import styles from './SectionWrapper.module.scss';

interface SectionWrapperProps {
  id: string;
  children: React.ReactNode;
  /** One tonal step up, for the page's dense tabular bands. */
  surface?: boolean;
  className?: string;
}

export default function SectionWrapper({
  id,
  children,
  surface = false,
  className,
}: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={clsx(styles.section, surface && styles.surface, className)}
    >
      <div className={styles.shell}>{children}</div>
    </section>
  );
}
