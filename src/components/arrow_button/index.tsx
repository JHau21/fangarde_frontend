import { useState } from "react";

import color_palette from "common/types/colors";

type Props = {
	children: React.ReactNode;
	onClick: Function;
	style?: Object;
	default_color?: string;
	hover_color?: string;
	active_color?: string;
};

const ArrowButton = ({ children, onClick, style = {}, default_color, hover_color, active_color }: Props) => {
	const default_style: ButtonColors = {
		color: default_color ?? color_palette.medium_blue,
		...style,
	};

	const hover_style: ButtonColors = {
		color: hover_color ?? color_palette.light_blue,
		...style,
	};

	const active_style: ButtonColors = {
		color: active_color ?? color_palette.dark_blue,
		...style,
	};

	const [color_style, set_color_style] = useState<ButtonColors>(default_style);

	return (
		<div
			onClick={() => onClick()}
			className={"flex h-[30px] flex-row items-center font-custom text-sm-header font-medium hover:cursor-pointer"}
			style={color_style}
			onMouseEnter={() => set_color_style(hover_style)}
			onMouseLeave={() => set_color_style(default_style)}
			onMouseDown={() => set_color_style(active_style)}
			onMouseUp={() => set_color_style(default_style)}
		>
			<div
				className={"mr-[10px] h-[15px] w-[25px] rotate-[270deg]"}
				style={{
					clipPath: "polygon(50% 0%, 100% 100%, 78% 100%, 50% 40%, 22% 100%, 0% 100%)",
					backgroundColor: color_style.color,
				}}
			/>
			{children}
		</div>
	);
};

export default ArrowButton;
