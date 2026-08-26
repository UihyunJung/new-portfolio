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

/** Displayed width of a thumbnail; the source file is 320px for retina. */
const THUMB_W = 148;

const thumbSrc = (id: string) => `/images/projects/${id}-thumb.jpg`;
const fullSrc = (id: string) => `/images/projects/${id}.jpg`;

/**
 * A strip of screenshot thumbnails that opens a viewer.
 *
 * The strip costs about 92px where an inline slider cost 475px, and the image
 * is larger when it opens than the slider ever showed it — the section gets
 * its length back and the screens get more room, not less.
 *
 * Each thumbnail is a real link to the full image, so without JavaScript it
 * simply opens that image and a modifier-click still opens a new tab. The
 * viewer is a native `<dialog>`: focus trapping, Escape and the backdrop are
 * the browser's job rather than a hand-rolled one.
 */
export default function ProjectShots({ projectKey, shots }: ProjectShotsProps) {
  const t = useTranslations('projects');
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState<number | null>(null);

  // Opening is a DOM call rather than markup: the render carrying the new
  // index has already committed by the time this runs, so the dialog never
  // paints a frame of the previously-viewed shot.
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
        // A click lands on the dialog itself only when it misses the frame —
        // that is the backdrop.
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
