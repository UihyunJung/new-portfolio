'use client';

import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';
import clsx from 'clsx';
import { scrollToSection } from '@lib/scrollTo';
import SplitText from '@components/@atoms/SplitText';
import StatValue from '@components/@atoms/StatValue';
import HeroCanvas from '@components/@atoms/HeroCanvas';
import useMagnetic from '@hooks/useMagnetic';
import usePointerField from '@hooks/usePointerField';
import { SKILL_NAMES } from '@lib/data/skills';
import styles from './HeroSection.module.scss';

// 여기 값은 전부 프로젝트의 데이터 파일에서 온다 — skills.ts, projects.ts,
// experience.ts. 지어낸 값은 없다.
const SPEC = [
  { key: 'EXPERIENCE', i18nKey: 'years' },
  { key: 'CORE', value: 'React · Next.js · TypeScript' },
  { key: 'STATE', value: 'Jotai · TanStack Query' },
  { key: 'TESTING', value: 'Playwright · Vitest' },
  { key: 'I18N', value: 'next-intl · 11 locales' },
] as const;

// 진입은 처음부터 끝까지 CSS이고, 의도적이다. JS 진입은 숨김 상태를 서버
// HTML에 기록하므로 설명문과 CTA 두 개, 스펙 패널 전체가 하이드레이션 전까지
// 안 보이고, 하이드레이션이 실패하면 영구히 안 보인다. 블록 단위 큐는
// HeroSection.module.scss의 키프레임 옆에 있고, 여기서 타이밍을 넘겨야 하는
// 건 쪼개진 두 줄뿐이다.
const NAME_CUE = 180;
const NAME_STEP = 70;
const ROLE_CUE = 470;
const ROLE_STEP = 90;

// 이름과 설명 뒤에 오는 두 장면. 문구는 메시지 파일에, 순서와 스타일은 여기에.
const CHAPTERS = [
  { key: 'approach', className: 'chapterThree' },
  { key: 'scale', className: 'chapterFour' },
] as const;

// 마크업은 세 겹이다 — 핀 컨테이너(.pin) > 스테이지(.stage) > 콘텐츠.
// 스크롤 타임라인을 지원하는 브라우저에서 .pin이 300svh로 늘어나고 .stage가
// 그 안에 sticky로 고정되어, 스크롤이 두 챕터와 스펙 행을 차례로 넘긴다.
// 미지원·reduced-motion에서는 두 래퍼가 그냥 블록이라 지금 보이는 히어로
// 그대로다. 티커는 .pin 바깥에 둔다 — 안에 두면 300svh 밖으로 밀려나
// 히어로의 overflow: clip에 잘린다.
export default function HeroSection() {
  const t = useTranslations('hero');
  // 커서 스포트라이트의 기준은 섹션이 아니라 스테이지다. 핀 도중 섹션의
  // top은 스크롤만큼 올라가지만 스테이지의 rect는 고정이라, 여기 걸어야
  // --pointer-y가 커서 밑에 남는다.
  const fieldRef = usePointerField<HTMLDivElement>();
  const ctaRef = useMagnetic<HTMLButtonElement>();
  // 캔버스 리본의 진행률은 핀 컨테이너가 스크롤포트를 지나는 정도에서 온다.
  const pinRef = useRef<HTMLDivElement>(null);

  return (
    <section id="hero" className={styles.hero}>
      <div className={styles.pin} ref={pinRef}>
        <div className={styles.stage} ref={fieldRef}>
          {/* 분위기 층. 액센트 빛이 가로지르는 규칙선 밭 — 페이지에서 커서를
              따라가는 것이 있는 유일한 곳이다. */}
          <div className={styles.field} aria-hidden="true">
            <span className={styles.grid} />
            <span className={styles.spot} />
            <span className={styles.sweep} />
            <HeroCanvas subjectRef={pinRef} className={styles.canvas} />
          </div>

          <div className={styles.shell}>
            {/* 두 챕터는 같은 자리에 겹친다(핀 모드에서만). 첫 챕터가 인사와
                이름, 둘째가 설명과 CTA. 스크린 리더는 둘 다 DOM 순서대로
                읽는다 — 숨김은 시각 층에서만 일어난다. */}
            <div className={styles.lede}>
              <div className={clsx(styles.chapter, styles.chapterOne)}>
                {/* 소제목이 아니라 인사말 — 문장 대소문자, 본문 서체, 자간
                    없음. 데이터시트를 건네기 전에 페이지가 먼저 인사해야
                    한다. */}
                <p className={styles.greeting}>{t('greeting')}</p>

                <h1 className={styles.name}>
                  <SplitText delay={NAME_CUE} step={NAME_STEP}>
                    {t('name')}
                  </SplitText>
                </h1>

                {/* 글자가 아니라 단어 단위로 나눈다. mono 디스플레이 크기에서
                    이 줄은 휴대폰 화면 하나 폭이라, 글자 마스크로 두면
                    브라우저가 단어 중간에서 줄을 바꾼다. */}
                <p className={styles.role}>
                  <SplitText by="word" delay={ROLE_CUE} step={ROLE_STEP}>
                    {t('title')}
                  </SplitText>
                  <span className={styles.roleRule} aria-hidden="true" />
                </p>
              </div>

              <div className={clsx(styles.chapter, styles.chapterTwo)}>
                <h2 className={styles.chapterTitle}>
                  {t('chapters.intro.title')}
                </h2>
                <p className={styles.description}>{t('description')}</p>
              </div>

              {/* 셋째·넷째 장면. 제목은 이름보다 두 단계 작은 디스플레이 —
                  같은 자리에서 이름을 잇는 문장이지 새 섹션이 아니다. */}
              {CHAPTERS.map((chapter) => (
                <div
                  key={chapter.key}
                  className={clsx(styles.chapter, styles[chapter.className])}
                >
                  <h2 className={styles.chapterTitle}>
                    {t(`chapters.${chapter.key}.title`)}
                  </h2>
                  <p className={styles.description}>
                    {t(`chapters.${chapter.key}.body`)}
                  </p>
                </div>
              ))}

              {/* CTA는 장면에 속하지 않는다. 어느 장면에서든 한 자리에 있어야
                  누를 수 있고, 탭 순서도 하나뿐이다. */}
              <div className={styles.actions}>
                <button
                  type="button"
                  ref={ctaRef}
                  className={styles.primary}
                  onClick={() => scrollToSection('projects')}
                >
                  {t('ctaProjects')}
                  <ArrowRight size={15} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className={styles.secondary}
                  onClick={() => scrollToSection('contact')}
                >
                  {t('ctaContact')}
                </button>
              </div>
            </div>

            {/* 아티팩트 슬롯. 타이포그래피 프레임 — 위 규칙선, 라벨, 아래
                규칙선. 윈도우 크롬을 다시 그리지 않는다. 패널이 먼저 안착한
                뒤 행을 차례로 돌린다. */}
            <dl className={styles.spec}>
              <div className={styles.specHead}>
                <span className={styles.specTitle}>{t('specTitle')}</span>
              </div>
              {SPEC.map((row) => (
                <div key={row.key} className={styles.specRow}>
                  <dt className={styles.specKey}>{row.key}</dt>
                  <dd className={styles.specValue}>
                    {'i18nKey' in row ? (
                      <StatValue>{t(`spec.${row.i18nKey}`)}</StatValue>
                    ) : (
                      row.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <span className={styles.cue} aria-hidden="true">
            <span className={styles.cueRail} />
            <span className={styles.cueText}>SCROLL</span>
          </span>

          {/* 흐르는 스택. 아래 스킬 시트의 장식적 반복이라, 두 번 읽히지 않도록
              읽기 순서에서 숨긴다. 스테이지의 마지막 행이다 — 핀 동안 뷰포트
              바닥에 붙어 있다가 스테이지와 함께 올라가야 히어로와 다음 섹션
              사이에 빈 띠가 남지 않는다. */}
          <div className={styles.ticker} aria-hidden="true">
            <div className={styles.tickerTrack}>
              {[0, 1].map((copy) => (
                <p key={copy} className={styles.tickerRun}>
                  {SKILL_NAMES.map((name) => (
                    <span key={name} className={styles.tickerItem}>
                      {name}
                    </span>
                  ))}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
