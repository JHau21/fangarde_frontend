import React from "react";

export interface ToggleBarParams {
	set_active_btn: Function;
	active_btn: number;
}

export const ToggleBar = ({ set_active_btn, active_btn }: ToggleBarParams): React.ReactElement => {
	const default_style: string =
		"text-fangarde-black font-bold text-regular font-custom text-center hover:text-light-blue hover:cursor-pointer active:text-dark-blue";
	const selected_style: string =
		"text-medium-blue font-bold text-regular font-custom text-center underline decoration-medium-blue decoration-solid decoration-2 underline-offset-8";

	return (
		<div className={"my-[15px] flex w-full flex-row items-center justify-between"}>
			<button className={active_btn === 1 ? selected_style : default_style} onClick={() => set_active_btn(1)}>
				General
			</button>
			<button className={active_btn === 2 ? selected_style : default_style} onClick={() => set_active_btn(2)}>
				Tickets
			</button>
			<button className={active_btn === 3 ? selected_style : default_style} onClick={() => set_active_btn(3)}>
				Events
			</button>
			<button className={active_btn === 4 ? selected_style : default_style} onClick={() => set_active_btn(4)}>
				Accessibility
			</button>
			<button className={active_btn === 5 ? selected_style : default_style} onClick={() => set_active_btn(5)}>
				Administrator
			</button>
			<button className={active_btn === 6 ? selected_style : default_style} onClick={() => set_active_btn(6)}>
				Policy
			</button>
		</div>
	);
};
