import React, { useState } from "react";

import color_palette from "common/types/colors";

import { ButtonTypes } from "common";
import Loader from "partials/loader/loader";

type Props = {
	onClick?: Function;
	children: React.ReactNode;
	className?: string;
	style?: object;
	disabled?: boolean;
	selected?: boolean;
	selected_style?: string; // custom styling for a button that's meant to stay in an active state (overwrites default style)
	default_color?: string;
	hover_color?: string;
	active_color?: string;
	type?: ButtonTypes;
	width?: Number;
	loading?: boolean;
};

const SmallButton = ({
	onClick = () => {},
	children,
	className,
	style = {},
	disabled,
	selected,
	selected_style,
	default_color,
	hover_color,
	active_color,
	type,
	width,
	loading,
}: Props) => {
	const custom_width = className ? `` : width ? `${width}px` : "235px";

	const disabled_style: ButtonColors = {
		border: `2px solid ${color_palette.disable_gray}`,
		backgroundColor: "transparent",
		color: color_palette.disable_gray,
		width: custom_width,
		...style,
	};

	const default_style: ButtonColors = {
		border: `2px solid ${default_color ?? color_palette.medium_blue}`,
		color: default_color ?? color_palette.medium_blue,
		width: custom_width,
		...style,
	};

	const hover_style: ButtonColors = {
		border: `2px solid ${hover_color ?? color_palette.dark_blue}`,
		backgroundColor: hover_color ?? color_palette.dark_blue,
		color: color_palette.white,
		width: custom_width,
		...style,
	};

	const active_style: ButtonColors = {
		border: `2px solid ${active_color ?? color_palette.light_blue}`,
		backgroundColor: active_color ?? color_palette.light_blue,
		color: color_palette.white,
		width: custom_width,
		...style,
	};

	const [color_style, set_color_style] = useState<ButtonColors>(default_style);

	let button_style: string =
		className ??
		`
			font-custom 
			text-regular 
			w-[235px] 
			h-8 
			bg-transparent 
			rounded-md 
		`;

	return (
		<button
			onClick={() => onClick()}
			className={selected_style ?? button_style}
			disabled={disabled ?? false}
			style={disabled ? disabled_style : selected ? active_style : color_style}
			onMouseEnter={() => set_color_style(hover_style)}
			onMouseLeave={() => set_color_style(default_style)}
			onMouseDown={() => set_color_style(active_style)}
			onMouseUp={() => set_color_style(default_style)}
			type={type ?? ButtonTypes.Submit}
		>
			{loading ? (
				<div>
					<Loader size={25} />
				</div>
			) : (
				children
			)}
		</button>
	);
};

export default SmallButton;
