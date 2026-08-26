import { useTranslations } from 'next-intl';
import { ChevronDown } from 'lucide-react';
import { publishingLedger, publishingSummary } from '@lib/data/publishing';
import styles from './PublishingLedger.module.scss';

/** Rows shown before the reader asks for the rest. */
const PREVIEW = 6;

/**
 * The 25 client projects behind the publishing entry.
 *
 * This is the section's densest object and the only evidence that entry has —
 * "dozens of projects over six years" is a claim, a named list of eighteen
 * clients is not. It expands with `<details>` rather than state so the other
 * nineteen rows are in the HTML, findable by Ctrl+F, and printable.
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
        {/* Flex order puts the control *after* the rows it reveals, so the
            label reads as the end of the list rather than a seam in it. */}
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
