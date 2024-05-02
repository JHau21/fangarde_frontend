import { useState } from "react";

import color_palette from "common/types/colors";

type InputBoxColors = {
	border?: string;
};

type Props = {
	className?: string;
	style?: Object;
	ref?: any;
	type?: string;
	max?: number | string;
	maxLength?: number;
	min?: number | string;
	value?: number | string;
	pattern?: string;
	placeholder?: string;
	readOnly?: boolean;
	onChange: Function;
	onPaste?: Function;
	disabled?: boolean;
	default_color?: string;
	hover_color?: string;
	focus_color?: string;
	autocomplete?: string;
	name?: string;
};

const InputBox = ({
	className,
	style,
	ref,
	type = "text",
	max,
	maxLength,
	min,
	value,
	pattern,
	placeholder,
	readOnly,
	onChange,
	onPaste,
	disabled,
	default_color,
	hover_color,
	focus_color,
	autocomplete,
	name,
}: Props) => {
	const disabled_style: InputBoxColors = {
		border: `2px solid ${color_palette.disable_gray}`,
	};

	const default_style: InputBoxColors = {
		border: `2px solid ${default_color ?? color_palette.medium_blue}`,
	};

	const hover_style: InputBoxColors = {
		border: `2px solid ${hover_color ?? color_palette.dark_blue}`,
	};

	const focus_style: InputBoxColors = {
		border: `2px solid ${focus_color ?? color_palette.dark_blue}`,
	};

	const [color_style, set_color_style] = useState<InputBoxColors>(default_style);

	const input_style: string =
		className ??
		`
			m-0 
			h-[35px] 
			w-full 
			text-left 
			font-custom 
			font-normal 
			text-regular 
			text-fangarde-black 
			p-[2px] 
			pl-[5px] 
			rounded-md 
			focus:outline-0 
		`;

	const inline_style: any | InputBoxColors = style
		? {
				...color_style,
				...style,
		  }
		: color_style;

	return (
		<input
			className={readOnly ? `${input_style} cursor-not-allowed bg-fangarde-white text-fangarde-disable-gray` : input_style}
			style={disabled ? disabled_style : inline_style}
			ref={ref}
			type={type}
			max={max}
			min={min}
			pattern={pattern}
			placeholder={placeholder}
			value={value}
			maxLength={maxLength}
			onChange={(event) => onChange(event.target.value)}
			onPaste={onPaste ? (event) => onPaste(event) : undefined}
			disabled={disabled ?? false}
			readOnly={readOnly ?? false}
			onMouseEnter={() => set_color_style(hover_style)}
			onMouseLeave={() => set_color_style(default_style)}
			onFocus={() => set_color_style(focus_style)}
			onBlur={() => set_color_style(default_style)}
			autoComplete={autocomplete}
			name={name}
		/>
	);
};

export default InputBox;
