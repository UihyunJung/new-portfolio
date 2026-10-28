import type { Metadata } from 'next';
import { SITE_URL } from '@lib/constants';

// 실제 <html>/<body>는 app/[locale]/layout.tsx가 그린다. 이 파일은 Next가
// 자동 생성하는 루트 `/_not-found` 라우트(로케일 바깥)에 metadataBase를
// 주기 위해서만 있다. 없으면 앱 루트의 opengraph-image.png·icon.svg를
// 해석할 기준 URL이 없어 빌드마다 localhost로 대체한다는 경고가 난다.
// 자식을 그대로 통과시키는 루트 레이아웃은 next-intl이 안내하는 구성이다.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
