// Publishing ledger — the 25 client projects behind the "대규모 웹 퍼블리싱"
// entry. Periods are data and never translated; client and title live in
// `messages/*.json` under `projects.ledger.<id>` because both differ per
// locale. Newest first — the list renders in this order.

export interface LedgerEntry {
  /** Message key under `projects.ledger`. */
  id: string;
  /** Already formatted for display; not localised. */
  period: string;
}

export const publishingLedger: LedgerEntry[] = [
  { id: 'nh-recording', period: '2023.06–09' },
  { id: 'kiwoom-clover', period: '2023.03–05' },
  { id: 'hana-site', period: '2022.08–2023.02' },
  { id: 'volvo-app', period: '2022.06' },
  { id: 'mettit', period: '2022.01–05' },
  { id: 'downing-shop', period: '2021.10–2022.01' },
  { id: 'samsung-edp', period: '2021.08–2022.01' },
  { id: 'gline', period: '2021.09–11' },
  { id: 'keyin', period: '2021.06–08' },
  { id: 'lgu-inbound', period: '2021.03–05' },
  { id: 'hanwha-lcp', period: '2020.11–2021.02' },
  { id: 'tworld-improve', period: '2020.08–10' },
  { id: 'mitsubishi', period: '2020.05–07' },
  { id: 'lgu-point', period: '2020.02–04' },
  { id: 'cu-cms', period: '2020.01–02' },
  { id: 'lgu-prepaid', period: '2019.10–12' },
  { id: 'skt-chatbot', period: '2019.08–09' },
  { id: 'lgu-drone', period: '2019.06–08' },
  { id: 'purunet', period: '2019.04–06' },
  { id: 'tworld-renewal', period: '2018.12–2019.04' },
  { id: 'suprema', period: '2018.09–11' },
  { id: 'onestore', period: '2018.06–08' },
  { id: 'lgu-roaming', period: '2018.04–05' },
  { id: 'teachinghub', period: '2018.02–03' },
  { id: 'keit', period: '2017.12–2018.01' },
];

/** Counts shown beside the ledger heading. Derived once, not at render.*/
export const publishingSummary = {
  count: publishingLedger.length,
  clients: 18,
  from: '2017.12',
  to: '2023.09',
} as const;
