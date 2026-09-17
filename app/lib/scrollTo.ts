/**
 * prefers-reduced-motion을 존중하는 앵커 스크롤.
 *
 * CSS의 `scroll-behavior: smooth`는 reduced-motion 사용자에게 무효화되지만,
 * JS에 `behavior: 'smooth'`를 박아 두면 그 무효화를 조용히 되돌린다.
 */
function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

export function scrollToSection(id: string): void {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({
    behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    block: 'start',
  });
  // 스크롤만 옮기고 포커스를 헤더에 남기면 키보드 사용자는 다음 Tab에서
  // 다시 맨 위부터 건너와야 한다. 섹션은 tabindex=-1이라 포커스를 받을 수
  // 있고, preventScroll이 부드러운 스크롤을 끊지 않게 한다.
  el.focus({ preventScroll: true });
}

export function scrollToTop(): void {
  window.scrollTo({
    top: 0,
    behavior: prefersReducedMotion() ? 'auto' : 'smooth',
  });
}
