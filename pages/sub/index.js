import Image from "next/image";

export default function SubPage() {
	return (
		<div>
			<Image src="https://picsum.photos/200/300" width={200} height={300} alt="aaa" />
		</div>
	);
}