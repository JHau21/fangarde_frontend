import { useState } from "react";

import color_palette from "common/types/colors";

type Props = {
	className?: string;
	disabled?: boolean;
	default_color?: string;
	hover_color?: string;
	active_color?: string;
	selected?: boolean;
	selected_style?: string;
	label: string;
	onClick: Function;
};

const TextButton = ({
	className,
	disabled = false,
	default_color,
	hover_color,
	active_color,
	selected,
	selected_style,
	label,
	onClick,
}: Props) => {
	const disabled_style: string = color_palette.disable_gray;

	const default_style: string = default_color ?? color_palette.medium_blue;

	const hover_style: string = hover_color ?? color_palette.dark_blue;

	const active_style: string = active_color ?? color_palette.dark_blue;

	const [color_style, set_color_style] = useState<string>(default_style);

	const unselected_style: string =
		className ??
		`
			m-0 
			h-[35px] 
			w-full 
			font-custom 
			text-regular 
			font-medium 
			hover:cursor-pointer
		`;

	return (
		<p
			className={selected ? selected_style : unselected_style}
			style={{ color: disabled ? disabled_style : color_style }}
			onClick={() => !disabled && onClick()}
			onMouseEnter={() => set_color_style(hover_style)}
			onMouseLeave={() => set_color_style(default_style)}
			onMouseDown={() => set_color_style(active_style)}
			onMouseUp={() => set_color_style(default_style)}
		>
			{label}
		</p>
	);
};

export default TextButton;
