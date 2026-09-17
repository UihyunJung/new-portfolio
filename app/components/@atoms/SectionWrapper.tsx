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
      // 인덱스에서 이동해 올 때 포커스를 받는 자리. scrollTo.ts가 쓴다.
      tabIndex={-1}
      className={clsx(styles.section, surface && styles.surface, className)}
    >
      <div className={styles.shell}>{children}</div>
    </section>
  );
}
