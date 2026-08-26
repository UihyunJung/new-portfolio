import clsx from 'clsx';
import styles from './SectionHeading.module.scss';

interface SectionHeadingProps {
  children: string;
  className?: string;
}

/**
 * 제목은 여백 속에 걸린다. 규칙선도, 위에 얹는 소제목도 없다.
 *
 * 여분의 span은 클립 박스다. 섹션이 화면에 들어올 때 제목이 그 안에서
 * 올라온다. 요소가 둘일 수밖에 없다 — 하나는 `overflow: hidden`을 붙들고
 * 다른 하나가 움직여야 한다.
 */
export default function SectionHeading({
  children,
  className,
}: SectionHeadingProps) {
  return (
    <h2 className={clsx(styles.heading, className)}>
      <span className={styles.mask}>
        <span className={styles.line}>{children}</span>
      </span>
    </h2>
  );
}
