"use client";
import styles from "./header.module.scss";
import Link from "next/link";
import { useEffect } from "react";
import { SetInnerHeight } from "@/app/utils/SetInnerHeight";

export default function Header() {
	useEffect(() => {
		SetInnerHeight();
		window.addEventListener("resize", SetInnerHeight);
	}, []);

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
