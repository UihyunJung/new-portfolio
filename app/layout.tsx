import type { Metadata } from 'next';
import './assets/styles/globals.scss';
import { ThemeProvider } from '@lib';
import { Suspense } from 'react';
import { Loading } from '@ui';

export const metadata: Metadata = {
  title: '정의현 - 포트폴리오',
  description: '프론트엔드 개발자 정의현의 홈페이지입니다.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Suspense fallback={<Loading />}>
            <div className="wrap flex flex-col min-h-dvh">{children}</div>
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
