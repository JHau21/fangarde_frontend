import CommonBarSmall from "components/bars/common_bar_small";
import SmallButton from "components/small_button/small_button";

import color_palette from "common/types/colors";

type Props = {
	key: number;
	ticket_type: TicketType;
	ticket_tier: TicketTier;
	quantity: number;
	onClick: Function;
	default_color?: string;
	hover_color?: string;
	active_color?: string;
};

const SelectedTicketCard = ({ key, ticket_type, ticket_tier, quantity, onClick, default_color }: Props) => {
	const { ticket_name } = ticket_type;
	const { name } = ticket_tier;

	return (
		<div
			key={key}
			className={"my-2 flex w-full flex-row items-center justify-between rounded p-2 font-custom text-regular font-normal"}
			style={{ color: color_palette.black, border: `2px solid ${default_color ?? color_palette.medium_blue}` }}
		>
			<div className={"flex flex-row items-center"}>
				<p className={"m-0 text-regular font-medium"}>{quantity}</p>
				<CommonBarSmall color={default_color ?? color_palette.medium_blue} />
				<div className={"flex flex-row items-center"}>
					<span className={"mr-[5px] max-w-[100px] truncate font-bold md:max-w-[190px]"}>{ticket_name}</span> /
					<span className={"ml-[5px] max-w-[100px] truncate text-fangarde-gray md:max-w-[190px]"}>{name}</span>
				</div>
			</div>
			<SmallButton
				className={"h-8 w-[100px] rounded-md bg-transparent font-custom text-regular"}
				default_color={color_palette.red}
				hover_color={color_palette.light_red}
				active_color={color_palette.medium_red}
				onClick={onClick}
			>
				Remove
			</SmallButton>
		</div>
	);
};

export default SelectedTicketCard;
