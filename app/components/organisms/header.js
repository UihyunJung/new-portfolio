import styles from "./header.module.scss";
import Link from "next/link";

export default function Header() {
	return (
		<header id={styles.header}>
			<Link href="/" title="홈으로">
				<h1>웹퍼블리셔 정의현의 포트폴리오</h1>
			</Link>
			<div>
				<nav>
					<Link href="/">home</Link>
					<Link href="/about">about</Link>
					<Link href="/project">project</Link>
					<Link href="/blog">blog</Link>
				</nav>
				<button>menu</button>
			</div>
		</header>
	);
}
