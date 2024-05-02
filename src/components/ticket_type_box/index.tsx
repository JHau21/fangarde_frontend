import { useState } from "react";

import CommonBarSmall from "components/bars/common_bar_small";
import UnselectedTicketCard from "../ticket_cards/unselected";

import { get_price_range } from "./utils";
import color_palette from "common/types/colors";

type Props = {
	key: number;
	ticket_type: TicketType;
	onClick: Function;
	default_color?: string;
	hover_color?: string;
	active_color?: string;
};

const TicketTypeBox = ({ key, ticket_type, onClick, default_color, hover_color, active_color }: Props) => {
	const { ticket_name, ticket_tiers, number_of_tickets } = ticket_type;

	const [open, set_open] = useState<boolean>(true);

	return (
		<div className={"my-[10px] w-full font-custom text-regular font-medium text-fangarde-black"} key={key}>
			<div
				className={"flex w-full flex-row items-center justify-between pb-[5px] hover:cursor-pointer"}
				style={{ borderBottom: `2px solid ${default_color ?? color_palette.medium_blue}` }}
				onClick={() => set_open(!open)}
			>
				<div className={"flex flex-row items-center text-sm-header font-bold"}>
					<span className={"mr-[5px] text-fangarde-gray"}>{ticket_name}</span>
					<CommonBarSmall color={color_palette.black} height={"18px"} />
					<span className={"mx-[5px] font-bold text-fangarde-black"}>
						Price Range: <span className={"font-medium"}>${get_price_range(ticket_tiers)}</span>
					</span>
					<CommonBarSmall color={color_palette.black} height={"18px"} />
					<span className={"ml-[5px] font-bold text-fangarde-black"}>
						Tickets Remaining: <span className={"font-medium"}>{number_of_tickets}</span>
					</span>
				</div>
				<div
					className={"mr-[10px] h-[12px] w-[20px] bg-fangarde-black"}
					style={{
						clipPath: "polygon(50% 0%, 100% 100%, 78% 100%, 50% 40%, 22% 100%, 0% 100%)",
						rotate: open ? "180deg" : "0deg",
					}}
				/>
			</div>
			{open &&
				ticket_tiers.map((ticket_tier: TicketTier, idx: number) => {
					const { name, price } = ticket_tier;

					return (
						<UnselectedTicketCard
							key={idx}
							ticket_name={ticket_name}
							tier_name={name}
							price={price}
							onClick={() => onClick(idx)}
							default_color={default_color}
							hover_color={hover_color}
							active_color={active_color}
						/>
					);
				})}
		</div>
	);
};

export default TicketTypeBox;
