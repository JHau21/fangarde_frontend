import React from "react";

import color_palette from "common/types/colors";

type Props = {
	header: string;
	header_color?: string;
	text: string;
	height?: string;
	margin_vertical?: string;
	wrap?: boolean;
};

const EventOverviewText: React.FC<Props> = ({ header, header_color, text, margin_vertical = "10px", wrap = false }) => {
	const general_styling: {
		color: string;
		marginTop: string;
		marginBottom: string;
	} = {
		color: color_palette.black,
		marginTop: margin_vertical,
		marginBottom: margin_vertical,
	};

	return (
		<p className={`${wrap === true ? "truncate" : "text-clip"}`} style={general_styling}>
			<span className={"mr-[5px]"} style={{ color: header_color ?? color_palette.medium_blue }}>
				{header}:
			</span>
			{" " + text}
		</p>
	);
};

export default EventOverviewText;
