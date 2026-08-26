import type { Metadata } from 'next';
import Script from 'next/script';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import localFont from 'next/font/local';
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import ThemeProvider from '@/components/@layout/ThemeProvider';
import MotionProvider from '@/components/@layout/MotionProvider';
import Header from '@/components/@layout/Header';
import Footer from '@/components/@layout/Footer';
import ScrollToTop from '@/components/@atoms/ScrollToTop';
import { SITE_URL, GTM_ID } from '@lib/constants';
import '@/assets/styles/globals.scss';

const wantedSans = localFont({
  src: '../fonts/WantedSansVariable.woff2',
  variable: '--font-wanted-sans',
  display: 'swap',
  weight: '100 900',
});

// 2+1 조합. 라틴 디스플레이는 Space Grotesk가, 한글은 같은 스택의
// Wanted Sans가 받아 한영이 섞인 제목도 하나의 목소리로 유지된다.
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
  weight: ['500', '600', '700'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
  weight: ['400', '500'],
});

// 애널리틱스는 프로덕션 배포에만 붙는다. Vercel이 VERCEL_ENV를
// 'production' | 'preview' | 'development'로 설정하고 로컬에는 없으므로
// `npm run dev`, `npm run start`, 모든 프리뷰 배포가 GA 속성에서 빠진다.
// 서버에서 읽으므로(레이아웃은 서버 컴포넌트) NEXT_PUBLIC_ 접두사가 필요 없다.
const analyticsEnabled = process.env.VERCEL_ENV === 'production';

const META = {
  ko: {
    title: '정의현 | Frontend Developer',
    description:
      '프론트엔드 개발자 정의현의 포트폴리오. React, Next.js, TypeScript 전문.',
    ogLocale: 'ko_KR',
  },
  en: {
    title: 'Uihyun Jung | Frontend Developer',
    description:
      'Frontend developer portfolio of Uihyun Jung. Specializing in React, Next.js, and TypeScript.',
    ogLocale: 'en_US',
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const m = META[locale as keyof typeof META] ?? META.ko;

  return {
    metadataBase: new URL(SITE_URL),
    title: m.title,
    description: m.description,
    authors: [{ name: '정의현 (Uihyun Jung)' }],
    alternates: {
      canonical: '/',
    },
    openGraph: {
      title: m.title,
      description: m.description,
      type: 'website',
      locale: m.ogLocale,
      alternateLocale: locale === 'ko' ? 'en_US' : 'ko_KR',
      url: '/',
    },
    twitter: {
      card: 'summary_large_image',
      title: m.title,
      description: m.description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      // _reset.scss의 전역 `scroll-behavior: smooth`에 대해 Next의 라우트 전환
      // 처리를 켠다. 앵커 이동은 부드럽게 유지되고, 라우트 변경(언어 전환
      // 포함)은 즉시 이동한다.
      data-scroll-behavior="smooth"
      className={`${wantedSans.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {analyticsEnabled && (
          <Script id="gtm" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
          </Script>
        )}
      </head>
      <body>
        {analyticsEnabled && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}
        <a href="#main-content" className="skip-to-content">
          Skip to content
        </a>
        <ThemeProvider>
          <NextIntlClientProvider messages={messages}>
            <MotionProvider>
              <Header />
              <main id="main-content">
                {children}
                <ScrollToTop />
              </main>
              <Footer />
            </MotionProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: '정의현',
              alternateName: 'Uihyun Jung',
              jobTitle: 'Frontend Developer',
              url: SITE_URL,
              sameAs: [
                'https://github.com/UihyunJung',
                'https://www.linkedin.com/in/uihyunjung',
              ],
            }),
          }}
        />
      </body>
    </html>
  );
}
