import color_palette from "common/types/colors";

import { FontStyle } from "./types";

export const font_style: FontStyle = {
	base: {
		fontFamily: "Arial, Helvetica, sans-serif",
		fontWeight: "400",
		fontSize: "16px",
		color: color_palette.black,
		"::placeholder": {
			color: color_palette.disable_gray,
		},
	},
};

export const input_style: string = `
	flex 
	flex-col 
	items-center 
	justify-center 
	w-full 
	p-[3px] 
	h-[35px] 
	rounded-md 
`;
