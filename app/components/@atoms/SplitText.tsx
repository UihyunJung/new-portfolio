import { Fragment } from 'react';
import clsx from 'clsx';
import styles from './SplitText.module.scss';

interface SplitTextProps {
  /** 애니메이션할 줄. `by`를 지정하지 않으면 글자 단위로 나눈다. */
  children: string;
  by?: 'char' | 'word';
  /** 첫 단위가 시작하기까지의 ms. */
  delay?: number;
  /** 단위 사이 간격 ms. */
  step?: number;
  className?: string;
}

/**
 * 한 단위씩 제자리로 올라오는 줄.
 *
 * 전부 CSS다. 모든 단위가 같은 키프레임을 쓰고 `animation-delay`만 다르므로
 * 런타임도, 레이아웃 스래싱도, 하이드레이션할 것도 없다. 기본 규칙이 정지
 * 상태라 애니메이션을 꺼도 줄은 그냥 *거기* 있다.
 *
 * `char` 모드에서도 글자는 항상 단어로 묶는다. 단위 하나하나가 inline-block
 * 이라 브라우저가 아무 데서나 줄을 바꾸고, 디스플레이 크기에서는 그게
 * "Uihyun Jung"을 "Uihyu / n Jung"으로 만든다. 단어 래퍼가 단어를 붙들어
 * 두면 남는 분리점은 공백뿐이고, 그게 있어야 할 자리다.
 *
 * 접근성: 쪼개진 span은 장식이다. 스크린 리더에는 끊기지 않은 텍스트 노드를
 * 따로 주는데, 글자마다 span이 붙으면 한 자씩 읽는 리더가 있기 때문이다.
 */
export default function SplitText({
  children,
  by = 'char',
  delay = 0,
  step = 55,
  className,
}: SplitTextProps) {
  // 큐는 단어마다 다시 세지 않고 줄 전체에 걸쳐 센다. 그래야 상승이 두 번이
  // 아니라 한 번의 쓸림으로 읽힌다.
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
                    style={{
                      animationDelay: `${delay + (start + u) * step}ms`,
                    }}
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
