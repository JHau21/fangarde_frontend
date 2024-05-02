import { useState } from "react";

import color_palette from "common/types/colors";

type InputBoxColors = {
	border?: string;
};

type Props = {
	className?: string;
	type?: string;
	maxLength?: number;
	value?: string;
	placeholder?: string;
	onChange: Function;
	disabled?: boolean;
	default_color?: string;
	hover_color?: string;
	focus_color?: string;
};

const SearchInputBox = ({
	className,
	type = "text",
	maxLength,
	value,
	placeholder,
	onChange,
	disabled,
	default_color,
	hover_color,
	focus_color,
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
			pl-[45px] 
			border-2 
			rounded-md 
			focus:outline-0 
            bg-search-icon 
            bg-no-repeat 
            bg-[1.5%] 
            bg-[length:23px_23px] 
		`;

	return (
		<input
			className={input_style}
			style={disabled ? disabled_style : color_style}
			type={type}
			placeholder={placeholder}
			value={value}
			maxLength={maxLength}
			onChange={(event) => onChange(event.target.value)}
			disabled={disabled ?? false}
			onMouseEnter={() => set_color_style(hover_style)}
			onMouseLeave={() => set_color_style(default_style)}
			onFocus={() => set_color_style(focus_style)}
			onBlur={() => set_color_style(default_style)}
		/>
	);
};

export default SearchInputBox;
