import Link from 'next/link';
import { fontClassName } from '@/fonts/fonts';
import styles from '@components/@atoms/ErrorPage.module.scss';
import '@/assets/styles/globals.scss';

// 로케일 바깥의 404. `[locale]/layout.tsx`가 알 수 없는 로케일 세그먼트에
// notFound()를 던지면 그 레이아웃 자체가 그려지지 않으므로, 이 파일이 직접
// <html>/<body>를 갖는다. 미들웨어 matcher가 점(.)이 든 경로를 건너뛰어
// `/la.html` 같은 요청이 여기로 온다. 메시지 프로바이더가 없어 두 언어를
// 나란히 적는다. @i18n/navigation의 Link는 intl 프로바이더가 있어야 하는
// 클라이언트 컴포넌트라 여기서는 쓸 수 없다(프로바이더가 없다는 500이 난다).
// 이 파일만 next/link를 쓰는 이유다.
export default function RootNotFound() {
  return (
    <html lang="ko" className={fontClassName}>
      <body>
        <main className={styles.container}>
          <h1 className={styles.title404}>404</h1>
          <p className={styles.description}>
            페이지를 찾을 수 없습니다. <span lang="en">Page not found.</span>
          </p>
          <Link href="/" className={styles.link}>
            홈으로 돌아가기 · Back to home
          </Link>
        </main>
      </body>
    </html>
  );
}
