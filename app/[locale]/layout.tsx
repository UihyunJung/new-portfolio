import type { Metadata } from 'next';
import Script from 'next/script';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import localFont from 'next/font/local';
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
    <html lang={locale} className={wantedSans.variable} suppressHydrationWarning>
      <head>
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
      </head>
      <body>
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
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
                'https://github.com/jung-euihyun',
                'https://linkedin.com/in/jung-euihyun',
              ],
            }),
          }}
        />
      </body>
    </html>
  );
}
