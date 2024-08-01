import styled from "styled-components";

export const Button = styled.button`
	background-color: var(--primary-color);
	color: white;
	padding: 10px 20px;
	border: none;
	border-radius: 5px;
	cursor: pointer;
	font-size: 16px;
	transition: background-color 0.3s ease;

	&:hover {
		background-color: #005bb5;
	}

	&:active {
		background-color: #003f7f;
	}
`;
