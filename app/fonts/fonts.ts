import localFont from 'next/font/local';
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google';

// 로케일 레이아웃과 루트 not-found가 같은 서체 스택을 쓴다. next/font는
// 모듈 최상위에서 한 번만 호출돼야 해서 여기 모아 두고 양쪽에서 가져다 쓴다.

export const wantedSans = localFont({
  src: './WantedSansVariable.woff2',
  variable: '--font-wanted-sans',
  display: 'swap',
  weight: '100 900',
});

// 2+1 조합. 라틴 디스플레이는 Space Grotesk가, 한글은 같은 스택의
// Wanted Sans가 받아 한영이 섞인 제목도 하나의 목소리로 유지된다.
export const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
  weight: ['500', '600', '700'],
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
  weight: ['400', '500'],
});

export const fontClassName = `${wantedSans.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`;
