import React from "react";

type Props = {
	className?: string;
	children?: React.ReactNode;
};

const SuccessMessage = ({ className, children }: Props) => {
	const message_style: string =
		className ??
		`
			w-full 
			font-custom 
			font-bold 
			text-regular 
			text-green-500 
			whitespace-normal 
        `;

	return <p className={message_style}>{children}</p>;
};

export default SuccessMessage;
