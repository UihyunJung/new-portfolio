'use client';

import { useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';
import { scrollToSection } from '@lib/scrollTo';
import SplitText from '@components/@atoms/SplitText';
import StatValue from '@components/@atoms/StatValue';
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

export default function HeroSection() {
  const t = useTranslations('hero');
  const fieldRef = usePointerField<HTMLElement>();
  const ctaRef = useMagnetic<HTMLButtonElement>();

  return (
    <section id="hero" className={styles.hero} ref={fieldRef}>
      {/* 분위기 층. 액센트 빛이 가로지르는 규칙선 밭 — 페이지에서 커서를
          따라가는 것이 있는 유일한 곳이다. */}
      <div className={styles.field} aria-hidden="true">
        <span className={styles.grid} />
        <span className={styles.spot} />
        <span className={styles.sweep} />
      </div>

      <div className={styles.shell}>
        <div className={styles.lede}>
          {/* 소제목이 아니라 인사말 — 문장 대소문자, 본문 서체, 자간 없음.
              데이터시트를 건네기 전에 페이지가 먼저 인사해야 한다. */}
          <p className={styles.greeting}>{t('greeting')}</p>

          <h1 className={styles.name}>
            <SplitText delay={NAME_CUE} step={NAME_STEP}>
              {t('name')}
            </SplitText>
          </h1>

          {/* 글자가 아니라 단어 단위로 나눈다. mono 디스플레이 크기에서 이 줄은
              휴대폰 화면 하나 폭이라, 글자 마스크로 두면 브라우저가 단어
              중간에서 줄을 바꾼다. */}
          <p className={styles.role}>
            <SplitText by="word" delay={ROLE_CUE} step={ROLE_STEP}>
              {t('title')}
            </SplitText>
            <span className={styles.roleRule} aria-hidden="true" />
          </p>

          <p className={styles.description}>{t('description')}</p>

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

        {/* 아티팩트 슬롯. 타이포그래피 프레임 — 위 규칙선, 라벨, 아래 규칙선.
            윈도우 크롬을 다시 그리지 않는다. 패널이 먼저 안착한 뒤 행을 차례로
            돌린다. */}
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
        SCROLL
      </span>

      {/* 흐르는 스택. 아래 스킬 시트의 장식적 반복이라, 두 번 읽히지 않도록
          읽기 순서에서 숨긴다. */}
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
    </section>
  );
}
