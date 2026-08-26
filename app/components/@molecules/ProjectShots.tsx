'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { ProjectShot } from '@lib/data/projects';
import styles from './ProjectShots.module.scss';

interface ProjectShotsProps {
  projectKey: string;
  shots: ProjectShot[];
}

/** 썸네일 표시 폭. 원본 파일은 레티나를 위해 320px다. */
const THUMB_W = 148;

const thumbSrc = (id: string) => `/images/projects/${id}-thumb.jpg`;
const fullSrc = (id: string) => `/images/projects/${id}.jpg`;

/**
 * 스크린샷 썸네일 스트립과 그것이 여는 뷰어.
 *
 * 인라인 슬라이더가 475px를 쓰던 자리를 92px로 줄이면서, 열었을 때 이미지는
 * 슬라이더가 보여주던 것보다 크다. 섹션은 길이를 돌려받고 화면은 자리를 더
 * 얻는다.
 *
 * 썸네일 하나하나가 원본 이미지로 가는 실제 링크라, JS 없이도 그 이미지가
 * 열리고 수정키를 누른 클릭은 새 탭으로 간다. 뷰어는 네이티브 `<dialog>`다 —
 * 포커스 가둠, Esc, 백드롭이 직접 만든 것이 아니라 브라우저 몫이다.
 */
export default function ProjectShots({ projectKey, shots }: ProjectShotsProps) {
  const t = useTranslations('projects');
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState<number | null>(null);

  // 여는 것은 마크업이 아니라 DOM 호출이다. 새 인덱스를 담은 렌더가 이미
  // 커밋된 뒤에 실행되므로, 이전에 보던 화면이 한 프레임도 비치지 않는다.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (index !== null && !dialog.open) dialog.showModal();
  }, [index]);

  const step = (delta: number) =>
    setIndex((current) =>
      current === null
        ? current
        : (current + delta + shots.length) % shots.length,
    );

  const caption = (id: string) => t(`items.${projectKey}.shots.${id}`);
  const current = index === null ? null : shots[index];

  return (
    <>
      <ul className={styles.strip}>
        {shots.map((shot, i) => (
          <li key={shot.id}>
            <a
              href={fullSrc(shot.id)}
              className={styles.thumb}
              onClick={(event) => {
                if (event.metaKey || event.ctrlKey || event.shiftKey) return;
                event.preventDefault();
                setIndex(i);
              }}
            >
              <Image
                src={thumbSrc(shot.id)}
                alt={caption(shot.id)}
                width={THUMB_W}
                height={Math.round((THUMB_W * shot.height) / shot.width)}
                sizes={`${THUMB_W}px`}
              />
            </a>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        className={styles.viewer}
        aria-label={t('viewerLabel')}
        onClose={() => setIndex(null)}
        onKeyDown={(event) => {
          if (event.key === 'ArrowLeft') step(-1);
          if (event.key === 'ArrowRight') step(1);
        }}
        // 클릭이 프레임을 빗나갔을 때만 dialog 자신에게 떨어진다 — 그게 백드롭이다.
        onClick={(event) => {
          if (event.target === dialogRef.current) dialogRef.current?.close();
        }}
      >
        {current && index !== null && (
          <figure className={styles.frame}>
            <Image
              src={fullSrc(current.id)}
              alt={caption(current.id)}
              width={current.width}
              height={current.height}
              className={styles.full}
              sizes="(max-width: 1160px) 94vw, 1100px"
            />
            <figcaption className={styles.bar}>
              <span className={styles.caption}>{caption(current.id)}</span>
              <span className={styles.position}>
                {t('viewerPosition', {
                  index: index + 1,
                  total: shots.length,
                })}
              </span>
              <span className={styles.controls}>
                <button
                  type="button"
                  className={styles.control}
                  onClick={() => step(-1)}
                  aria-label={t('viewerPrev')}
                >
                  <ChevronLeft size={18} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className={styles.control}
                  onClick={() => step(1)}
                  aria-label={t('viewerNext')}
                >
                  <ChevronRight size={18} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className={styles.control}
                  onClick={() => dialogRef.current?.close()}
                  aria-label={t('viewerClose')}
                >
                  <X size={18} aria-hidden="true" />
                </button>
              </span>
            </figcaption>
          </figure>
        )}
      </dialog>
    </>
  );
}
