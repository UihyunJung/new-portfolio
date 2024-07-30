// 각종 UI 초기 세팅을 위한 컴포넌트
"use client";
import { useEffect } from "react";

export default function UIsetting() {
	useEffect(() => {
		// '--window-inner-height' css 변수값 설정
		const setInnerHeight = () => {
			document.documentElement.style.setProperty("--window-inner-height", `${window.innerHeight}px`);
		};

		const ui = {
			init: () => {
				setInnerHeight();
			},
			resize: () => {
				setInnerHeight();
			},
		};

		ui.init();
		window.addEventListener("resize", ui.resize);
	}, []);
}
