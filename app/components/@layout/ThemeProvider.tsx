'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';

// `disableTransitionOnChange`는 일부러 꺼 뒀다. 이 옵션은
// `*,*::before,*::after{transition:none!important}`를 주입하고 속성을 바꾸기
// 전에 강제로 리스타일을 돌린다. 그러면 대기 중이던 변화가 전부 최종값으로
// 확정돼 실행할 전이가 남지 않는다 — 테마 토글 자신의 썸 이동과 아이콘 회전을
// 포함해서. 테마를 바꾸는 것이 존재 이유인 컨트롤이 곧 이 옵션이 모션을 항상
// 죽이던 컨트롤이었다.
//
// 이 옵션이 막아 주는 팔레트 번짐은 이 사이트에서 일어날 수 없다. 색상 전이는
// 링크 텍스트에 걸린 `--dur-micro`(120ms) 아홉 개가 전부다. 넓은 면에 긴 색상
// 전이를 추가하면 번짐이 돌아오는데, 그때는 이 플래그를 되살리지 말고 그 면을
// 고칠 것.
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
