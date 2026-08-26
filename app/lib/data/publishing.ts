// 퍼블리싱 원장 — "대규모 웹 퍼블리싱" 항목 뒤의 고객사 프로젝트 25건.
// 기간은 데이터라 번역하지 않고, 고객사와 프로젝트명은 언어마다 달라
// `messages/*.json`의 `projects.ledger.<id>`에 둔다. 최신순이고, 이 순서대로
// 렌더링된다.

export interface LedgerEntry {
  /** `projects.ledger` 아래의 메시지 키. */
  id: string;
  /** 표시용으로 이미 다듬은 문자열. 번역하지 않는다. */
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

/** 원장 제목 옆에 보이는 집계. 렌더링 때가 아니라 한 번만 계산한다. */
export const publishingSummary = {
  count: publishingLedger.length,
  clients: 18,
  from: '2017.12',
  to: '2023.09',
} as const;
