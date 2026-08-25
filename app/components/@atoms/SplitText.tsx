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
 * Characters are always grouped into words, even in `char` mode. Each unit
 * is its own inline-block, and the browser will happily break a line
 * between any two of them: at display size that turns "Uihyun Jung" into
 * "Uihyu / n Jung". The word wrapper holds each word together, so the only
 * break point left is the space — where it belongs.
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
  // The cue is counted across the whole line, not restarted per word, so
  // the rise reads as one sweep rather than as two.
  const words = children.split(' ');
  const groups = words.map((word, w) => ({
    word,
    units: by === 'word' ? [word] : Array.from(word),
    start:
      by === 'word'
        ? w
        : words
            .slice(0, w)
            .reduce((count, earlier) => count + Array.from(earlier).length, 0),
  }));

  return (
    <span className={clsx(styles.split, className)}>
      <span className={styles.reader}>{children}</span>
      <span aria-hidden="true">
        {groups.map(({ word, units, start }, w) => (
          <Fragment key={`${word}-${w}`}>
            <span className={styles.word}>
              {units.map((unit, u) => (
                <span key={`${unit}-${u}`} className={styles.mask}>
                  <span
                    className={styles.unit}
                    style={{ animationDelay: `${delay + (start + u) * step}ms` }}
                  >
                    {unit}
                  </span>
                </span>
              ))}
            </span>
            {w < groups.length - 1 ? ' ' : null}
          </Fragment>
        ))}
      </span>
    </span>
  );
}
