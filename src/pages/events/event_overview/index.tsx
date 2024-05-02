import { useNavigate } from "react-router-dom";

import EventInfo from "./event_info";
import SmallButton from "components/small_button/small_button";

import { use_ticket_order } from "../../../state/events/use_ticket_order";

import DefaultImage from "../../../common/images/default_concert_stage_image3.png";

const EventOverview = () => {
	const navigate = useNavigate();

	const { selected_event, ticket_options, reset, set_selected_tickets } = use_ticket_order();

	const { primary_color, secondary_color } = selected_event?.color_scheme ?? {
		primary_color: undefined,
		secondary_color: undefined,
	};

	const go_back = () => {
		reset();

		navigate("/");
	};

	const go_forward = async () => {
		const default_selected_tickets: Array<SelectedTicket> | undefined = ticket_options?.reduce(
			(selected_tickets: Array<SelectedTicket>, ticket_type: TicketType) => {
				const sold: Array<{ ticket_tier: TicketTier; quantity: number }> = ticket_type.ticket_tiers.map(
					(ticket_tier: TicketTier) => {
						return {
							ticket_tier: ticket_tier,
							quantity: 0,
						};
					}
				);

				selected_tickets.push({
					ticket_type: ticket_type,
					sold: sold,
				});

				return selected_tickets;
			},
			[]
		);

		set_selected_tickets(default_selected_tickets);

		navigate("/event/buy_tickets");
	};

	return (
		<div className="mx-auto mt-8 flex w-full flex-col justify-center px-2 md:mb-8">
			<div className="mx-auto mb-8 flex h-full flex-col items-start md:flex-row">
				<div className="flex items-center justify-center self-center overflow-hidden rounded-lg bg-[#808080] md:h-[270px] md:w-[350px]">
					<img
						className="mx-auto rounded-lg md:mx-0 md:w-[350px]"
						src={selected_event?.banner || DefaultImage}
						alt={"Event Pic"}
					/>
				</div>
				<EventInfo primary_color={primary_color} selected_event={selected_event} />
			</div>
			<div className="mx-auto flex w-full flex-row items-center justify-between md:w-[500px]">
				<SmallButton
					default_color={primary_color}
					hover_color={secondary_color}
					active_color={primary_color}
					onClick={go_back}
				>
					Exit
				</SmallButton>
				<SmallButton
					default_color={primary_color}
					hover_color={secondary_color}
					active_color={primary_color}
					disabled={!ticket_options || !ticket_options.length}
					onClick={go_forward}
				>
					{!ticket_options?.length ? "SOLD OUT" : "Buy Tickets"}
				</SmallButton>
			</div>
		</div>
	);
};

export default EventOverview;
