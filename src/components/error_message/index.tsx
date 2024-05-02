type Props = {
	message: string;
	className?: string;
	style?: Object;
};

const ErrorMessage = ({ className, message, style }: Props) => {
	let message_style: string =
		className ??
		`
			w-full 
			font-custom 
			font-bold 
			text-regular 
			text-fangarde-medium-red 
			whitespace-normal 
        `;

	return (
		<p className={message_style} style={style}>
			{message}
		</p>
	);
};

export default ErrorMessage;
