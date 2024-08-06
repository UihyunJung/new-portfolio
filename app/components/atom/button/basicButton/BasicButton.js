"use client";
import { Button } from "./ButtonStyle";

const BasicButton = (props) => {
	const { role, disabled, children } = props;
	return (
		<Button role={role} disabled={disabled}>
			{children}
		</Button>
	);
};

export default BasicButton;
