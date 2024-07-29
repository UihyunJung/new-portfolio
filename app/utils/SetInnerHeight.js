// '--window-inner-height' css 변수값 설정
export const SetInnerHeight = () => {
	document.documentElement.style.setProperty("--window-inner-height", `${window.innerHeight}px`);
};
