import color_palette from "common/types/colors";

type Props = {
	className?: string;
	disabled?: boolean;
	maxLength?: number;
	placeholder?: string;
	readOnly?: boolean;
	rows?: number;
	value?: string;
	onChange: Function;
};

const TextAreaInputBox = ({ className, disabled, maxLength = 100, placeholder, readOnly, rows = 4, value, onChange }: Props) => {
	const text_area_style: string =
		className ??
		`
			text-left 
			font-custom 
			font-normal 
			text-regular 
			text-fangarde-black
			m-0 
			p-[2px] 
			pl-[5px] 
			border-2 
			border-medium-blue 
			rounded-md 
			text-left 
			w-full 
			h-full 
			outline-0 
			hover:border-dark-blue 
			focus:border-dark-blue 
		`;

	return (
		<textarea
			disabled={disabled ?? false}
			className={text_area_style}
			style={disabled ? { border: `2px solid ${color_palette.disable_gray}` } : undefined}
			readOnly={readOnly ?? false}
			rows={rows}
			maxLength={maxLength}
			value={value}
			placeholder={placeholder}
			onChange={(event) => {
				const value: string = event.target.value;

				onChange(value);
			}}
		/>
	);
};

export default TextAreaInputBox;
