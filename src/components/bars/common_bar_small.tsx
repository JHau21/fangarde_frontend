import color_palette from "common/types/colors";

type Props = {
	className?: string;
	color?: string;
	width?: string;
	height?: string;
};

function CommonBarSmall({ className, color, width, height }: Props) {
	const inline_style: object = className
		? {}
		: {
				backgroundColor: color ?? color_palette.medium_blue,
				width: height ?? "30px", // this is intentional
				height: width ?? "2px", // this is intentional
		  };

	const bar_style: string =
		className ??
		`
			rotate-90 
			border-0 
		`;

	return <hr className={bar_style} style={inline_style} />;
}

export default CommonBarSmall;
