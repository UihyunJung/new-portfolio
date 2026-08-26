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
}

export function scrollToTop(): void {
  window.scrollTo({
    top: 0,
    behavior: prefersReducedMotion() ? 'auto' : 'smooth',
  });
}
