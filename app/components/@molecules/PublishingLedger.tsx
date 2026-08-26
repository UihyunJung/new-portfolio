import { useTranslations } from 'next-intl';
import { ChevronDown } from 'lucide-react';
import { publishingLedger, publishingSummary } from '@lib/data/publishing';
import styles from './PublishingLedger.module.scss';

/** 나머지를 요청하기 전에 보이는 행 수. */
const PREVIEW = 6;

/**
 * 퍼블리싱 항목 뒤에 있는 25건의 고객사 프로젝트.
 *
 * 섹션에서 가장 밀도 높은 물체이자 그 항목이 가진 유일한 증거다.
 * "6년간 수십 건"은 주장이지만 이름이 적힌 고객사 18곳은 그렇지 않다.
 * 상태가 아니라 `<details>`로 펼치므로 나머지 19행도 HTML에 있고,
 * Ctrl+F로 찾히며 인쇄된다.
 */
export default function PublishingLedger() {
  const t = useTranslations('projects');

  const rows = (entries: typeof publishingLedger) =>
    entries.map(({ id, period }) => (
      <li key={id} className={styles.row}>
        <span className={styles.period}>{period}</span>
        <span>
          <span className={styles.client}>{t(`ledger.${id}.client`)}</span>{' '}
          <span className={styles.title}>{t(`ledger.${id}.title`)}</span>
        </span>
      </li>
    ));

  return (
    <div>
      <p className={styles.summary}>
        {t('ledgerSummary', publishingSummary)}
      </p>

      <ol className={styles.list}>{rows(publishingLedger.slice(0, PREVIEW))}</ol>

      <details className={styles.more}>
        {/* flex order로 컨트롤을 그것이 여는 행들 *뒤에* 둔다. 그래야 라벨이
            목록 중간의 이음매가 아니라 끝으로 읽힌다. */}
        <summary className={styles.control}>
          <span className={styles.whenClosed}>
            {t('ledgerExpand', { count: publishingSummary.count })}
          </span>
          <span className={styles.whenOpen}>{t('ledgerCollapse')}</span>
          <ChevronDown size={14} className={styles.chevron} aria-hidden="true" />
        </summary>
        <ol className={styles.list}>{rows(publishingLedger.slice(PREVIEW))}</ol>
      </details>
    </div>
  );
}
