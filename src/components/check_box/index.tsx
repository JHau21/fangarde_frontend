import { useState } from "react";

import color_palette from "common/types/colors";

type CheckBoxColors = {
	border?: string;
	backgroundColor?: string;
	color?: string;
};

type Props = {
	unchecked_class?: string;
	checked_class?: string;
	checked: boolean;
	id?: any;
	key?: number;
	label: React.ReactNode;
	label_class?: string;
	onClick: Function;
	default_color?: string;
	hover_color?: string;
	active_color?: string;
};

const CheckBox = ({
	unchecked_class,
	checked_class,
	checked,
	id,
	key,
	label,
	label_class,
	onClick,
	default_color,
	hover_color,
	active_color,
}: Props) => {
	const default_style: CheckBoxColors = {
		border: `2px solid ${default_color ?? color_palette.medium_blue}`,
		backgroundColor: "transparent",
	};

	const hover_style: CheckBoxColors = {
		border: `2px solid ${hover_color ?? color_palette.light_blue}`,
		backgroundColor: "transparent",
	};

	const active_style: CheckBoxColors = {
		border: `2px solid ${active_color ?? color_palette.dark_blue}`,
		backgroundColor: active_color ?? color_palette.dark_blue,
	};

	const [color_style, set_color_style] = useState<CheckBoxColors>(default_style);

	const unchecked_style: string =
		unchecked_class ??
		`
            m-0 
            mr-[10px] 
			mt-[3px] 
            p-0 
            appearance-none 
            bg-white 
            w-[16px] 
            h-[16px] 
            hover:cursor-pointer 
        `;

	const checked_style: string =
		checked_class ??
		`
            m-0 
            mr-[10px] 
			mt-[3px] 
            p-0 
            appearance-none 
            w-[16px] 
            h-[16px] 
            hover:cursor-pointer 
        `;

	const label_style: string =
		label_class ??
		`
            m-0 
            p-0 
            text-left 
			font-custom 
			font-normal 
			text-regular 
			text-fangarde-black 
            flex 
            flex-row 
            items-start 
            whitespace-normal 
        `;

	return (
		<label className={label_style} key={key} onClick={() => onClick()}>
			<div
				id={id}
				className={checked ? checked_style : unchecked_style}
				key={key}
				style={checked ? active_style : color_style}
				onMouseEnter={() => set_color_style(hover_style)}
				onMouseLeave={() => set_color_style(default_style)}
			/>
			{label}
		</label>
	);
};

export default CheckBox;
