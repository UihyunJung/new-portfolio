import { Fragment } from 'react';
import clsx from 'clsx';
import styles from './SplitText.module.scss';

interface SplitTextProps {
  /** The line to animate. Split on characters unless `by` says otherwise. */
  children: string;
  by?: 'char' | 'word';
  /** ms before the first unit starts. */
  delay?: number;
  /** ms between units. */
  step?: number;
  className?: string;
}

/**
 * A line that rises into place one unit at a time.
 *
 * The whole effect is CSS: every unit carries the same keyframes and differs
 * only by `animation-delay`, so there is no runtime, no layout thrash and
 * nothing to hydrate. The base rule is the resting state — kill the
 * animation and the line is simply *there*.
 *
 * Accessibility: the split spans are decoration. Screen readers get one
 * uninterrupted text node instead, because a per-character span run is
 * announced letter by letter by some readers.
 */
export default function SplitText({
  children,
  by = 'char',
  delay = 0,
  step = 55,
  className,
}: SplitTextProps) {
  const units = by === 'word' ? children.split(' ') : Array.from(children);

  return (
    <span className={clsx(styles.split, className)}>
      <span className={styles.reader}>{children}</span>
      <span aria-hidden="true">
        {units.map((unit, i) => (
          <Fragment key={`${unit}-${i}`}>
            <span className={styles.mask}>
              <span
                className={styles.unit}
                style={{ animationDelay: `${delay + i * step}ms` }}
              >
                {/* An inline-block with a collapsible space has no width. */}
                {unit === ' ' ? ' ' : unit}
              </span>
            </span>
            {by === 'word' && i < units.length - 1 ? ' ' : null}
          </Fragment>
        ))}
      </span>
    </span>
  );
}
