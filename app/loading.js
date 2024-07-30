import styles from "@/styles/loading.module.scss"; // CSS 모듈 사용

const Loading = () => {
	return (
		<div className={styles.loader}>
			<div className={styles.spinner}></div>
		</div>
	);
};

export default Loading;
