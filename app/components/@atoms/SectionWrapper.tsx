import clsx from 'clsx';
import styles from './SectionWrapper.module.scss';

interface SectionWrapperProps {
  id: string;
  children: React.ReactNode;
  /** 색조 한 단계 위. 밀도 높은 표 형태 밴드에 쓴다. */
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
