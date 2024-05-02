import TextButton from "components/text_button";

import color_palette from "common/types/colors";

type Props = {
	name: string;
	terminal_id: string;
	on_delete: Function;
	on_edit: Function;
};

const TerminalCard = ({ name, terminal_id, on_delete, on_edit }: Props) => {
	const button_style: string = "m-0 h-[30px] text-center font-custom text-regular font-bold hover:cursor-pointer";

	return (
		<div
			className={"my-4 flex h-[80px] w-full flex-row items-center justify-between rounded-md border-2 border-medium-blue p-4"}
		>
			<div className={"flex h-[60px] flex-col items-start"}>
				<h3 className={"m-0 text-sm-header font-bold text-fangarde-black"}>{name}</h3>
				<h3 className={"m-0 text-regular text-fangarde-black"}>
					ID:<span className={"ml-[5px] text-fangarde-gray"}>{terminal_id}</span>
				</h3>
			</div>
			<div className={"flex h-[60px] w-[20%] flex-col items-end justify-evenly font-bold"}>
				<TextButton
					className={button_style}
					label={"Edit"}
					onClick={() => {
						on_edit();
					}}
				/>
				<TextButton
					className={button_style}
					label={"Remove"}
					default_color={color_palette.medium_red}
					hover_color={color_palette.light_red}
					active_color={color_palette.red}
					onClick={() => on_delete(terminal_id)}
				/>
			</div>
		</div>
	);
};

export default TerminalCard;
