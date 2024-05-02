import CommonBarSmall from "components/bars/common_bar_small";
import SmallButton from "components/small_button/small_button";

import color_palette from "common/types/colors";

type Props = {
	key: number;
	ticket_name: string;
	tier_name: string;
	price: number;
	onClick: Function;
	default_color?: string;
	hover_color?: string;
	active_color?: string;
};

const UnselectedTicketCard = ({ key, ticket_name, tier_name, price, onClick, default_color, hover_color, active_color }: Props) => {
	return (
		<div
			key={key}
			className={"my-2 flex w-full flex-row items-center justify-between rounded p-2 font-custom text-regular font-normal"}
			style={{ color: color_palette.black, border: `2px solid ${default_color ?? color_palette.medium_blue}` }}
		>
			<div className={"flex flex-row items-center"}>
				<p>{"$" + price}</p>
				<CommonBarSmall color={default_color ?? color_palette.medium_blue} />
				<div className={"flex flex-row items-center"}>
					<span className={"max-w-[100px] truncate md:max-w-[190px]"}>{tier_name}</span>
				</div>
			</div>
			<SmallButton
				default_color={default_color}
				hover_color={hover_color}
				active_color={active_color}
				onClick={onClick}
				className={"h-8 w-[100px] rounded-md bg-transparent font-custom text-regular"}
			>
				Add Ticket
			</SmallButton>
		</div>
	);
};

export default UnselectedTicketCard;
