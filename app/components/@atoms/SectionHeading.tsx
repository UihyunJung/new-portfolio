import clsx from 'clsx';
import styles from './SectionHeading.module.scss';

interface SectionHeadingProps {
  children: string;
  className?: string;
}

/**
 * S2 · Hanging — the heading floats in negative space. No rule, no eyebrow.
 *
 * The extra span is the clip box: the heading rises out of it as the section
 * enters the viewport. Two elements are unavoidable — one has to hold the
 * `overflow: hidden` while the other moves.
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
