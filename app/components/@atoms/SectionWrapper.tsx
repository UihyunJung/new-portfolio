import clsx from 'clsx';
import styles from './SectionWrapper.module.scss';

interface SectionWrapperProps {
  id: string;
  children: React.ReactNode;
  className?: string;
}

export default function SectionWrapper({
  id,
  children,
  className,
}: SectionWrapperProps) {
  return (
    <section id={id} className={clsx(styles.section, className)}>
      <div className={styles.container}>{children}</div>
    </section>
  );
}
