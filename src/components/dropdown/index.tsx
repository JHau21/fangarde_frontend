import { useState } from "react";

import color_palette from "common/types/colors";

type DropdownBoxColors = {
	border?: string;
};

type Props = {
	className?: string;
	disabled?: boolean;
	options: any[];
	placeholder?: string;
	value?: string | number;
	default_color?: string;
	hover_color?: string;
	focus_color?: string;
	default_option?: JSX.Element;
	renderOption: (option: any, index: number) => JSX.Element;
	onChange: (event: any) => void;
	autocomplete?: string;
};

const Dropdown = ({
	className,
	default_option,
	disabled,
	options,
	placeholder,
	value,
	default_color,
	hover_color,
	focus_color,
	onChange,
	renderOption,
	autocomplete,
}: Props) => {
	const disabled_style: DropdownBoxColors = {
		border: `2px solid ${color_palette.disable_gray}`,
	};

	const default_style: DropdownBoxColors = {
		border: `2px solid ${default_color ?? color_palette.medium_blue}`,
	};

	const hover_style: DropdownBoxColors = {
		border: `2px solid ${hover_color ?? color_palette.dark_blue}`,
	};

	const focus_style: DropdownBoxColors = {
		border: `2px solid ${focus_color ?? color_palette.dark_blue}`,
	};

	const [color_style, set_color_style] = useState<DropdownBoxColors>(default_style);

	const dd_style: string =
		className ??
		`
			font-custom 
			font-normal 
			text-regular 
			h-[35px] 
			w-full 
			p-[2px] 
			pl-[5px] 
			rounded-md 
			outline-0 
			hover:cursor-pointer 
		`;

	return (
		<select
			className={dd_style}
			style={disabled ? disabled_style : color_style}
			value={value}
			placeholder={placeholder}
			onChange={(event) => onChange(event.target.value)}
			onMouseEnter={() => set_color_style(hover_style)}
			onMouseLeave={() => set_color_style(default_style)}
			onFocus={() => set_color_style(focus_style)}
			onBlur={() => set_color_style(default_style)}
			disabled={disabled}
			autoComplete={autocomplete}
		>
			{default_option && default_option}
			{options.map((option: any, idx: number) => {
				return renderOption(option, idx);
			})}
		</select>
	);
};

export default Dropdown;
