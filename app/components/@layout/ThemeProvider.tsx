'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';

// `disableTransitionOnChange` is deliberately OFF. It injects
// `*,*::before,*::after{transition:none!important}` and forces a restyle
// before swapping the attribute, so every pending change is committed at its
// final value with no transition to run — including the theme toggle's own
// thumb slide and icon spin. The one control guaranteed to change the theme
// was the one control whose motion it always killed.
//
// What it guards against is a palette smear this site cannot produce: the
// only colour transitions here are nine `--dur-micro` (120ms) text-colour
// rules on links. Adding a long transition on a large surface would bring
// the smear back — fix that surface rather than re-enabling this flag.
export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NextThemesProvider
      attribute="data-theme"
      defaultTheme="system"
      enableSystem
    >
      {children}
    </NextThemesProvider>
  );
}
