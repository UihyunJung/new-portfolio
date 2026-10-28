import { notFound } from 'next/navigation';

// 로케일 안의 알 수 없는 경로(`/nope` → 미들웨어가 `/ko/nope`로 재작성)를
// 받아 notFound()를 던진다. 그러면 가장 가까운 경계인 `[locale]/not-found.tsx`가
// 헤더·푸터가 있는 로케일 레이아웃 안에서 번역된 404를 그린다. 이 캐치올이
// 없으면 Next가 라우트 불일치를 루트 `app/not-found.tsx`로 보내 민짜 404가 된다.
// next-intl이 안내하는 구성이다.
export default function CatchAllPage() {
  notFound();
}
