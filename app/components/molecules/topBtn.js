"use client";
import { useEffect, useState } from "react";
import styles from "./topBtn.module.scss";

const TopBtn = () => {
	const [isVisible, setIsVisible] = useState(false);

	const handleScroll = () => {
		if (window.scrollY > 200) {
			setIsVisible(true);
		} else {
			setIsVisible(false);
		}
	};

	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	useEffect(() => {
		window.addEventListener("scroll", handleScroll);
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	return (
		<button className={`${styles.topBtn} ${isVisible ? styles.visible : styles.hidden}`} role="button" onClick={scrollToTop}>
			top
		</button>
	);
};

export default TopBtn;
