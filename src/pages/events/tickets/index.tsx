import { useState } from "react";
import { useNavigate } from "react-router-dom";

import SelectedTicketCard from "components/ticket_cards/selected";
import SmallButton from "components/small_button/small_button";
import TicketFilter from "./filter";
import TicketTypeBox from "components/ticket_type_box";

import { use_ticket_order, UseTicketOrderState } from "state/events/use_ticket_order";

import { filter_tickets } from "./utils";
import { on_edit_tickets, cart_empty } from "utils/common_methods";

import color_palette from "common/types/colors";

import { Filters } from "./types";

import { ticket_box_styles } from "./styles";

const Tickets = () => {
	const { ticket_options, previously_selected_tickets, selected_event, set_checkout_tickets } = use_ticket_order(
		(state: UseTicketOrderState) => ({
			ticket_options: state.ticket_options,
			previously_selected_tickets: state.selected_tickets,
			selected_event: state.selected_event,
			set_checkout_tickets: state.set_selected_tickets,
		})
	);

	const navigate = useNavigate();

	const [tickets, set_tickets] = useState<Array<TicketType>>(ticket_options ? new Array(...ticket_options) : []);
	const [selected_tickets, set_selected_tickets] = useState<Array<SelectedTicket>>(
		previously_selected_tickets ? new Array(...previously_selected_tickets) : []
	);

	const { primary_color, secondary_color } = selected_event?.color_scheme ?? {
		primary_color: undefined,
		secondary_color: undefined,
	};

	const go_back = () => {
		if (selected_event) {
			navigate(`/event/${selected_event._id}`);
		}
	};

	const go_forward = async () => {
		if (!cart_empty(selected_tickets)) {
			set_checkout_tickets(selected_tickets);

			navigate("/event/billing_info");
		}
	};

	return (
		<div className="mx-auto w-11/12 md:my-8 md:w-1/2" style={{ color: color_palette.black }}>
			<h1 className={"m-0 mb-[10px] text-lg-header"}> Select Your Tickets </h1>
			{ticket_options && (
				<TicketFilter
					primary_color={primary_color}
					secondary_color={secondary_color}
					onChange={async (filters: Filters) => set_tickets(await filter_tickets(filters, ticket_options))}
					onReset={() => set_tickets(ticket_options)}
				/>
			)}
			<div className={ticket_box_styles}>
				<h2 className={"m-0 mb-[10px] text-md-header"}>Available Tickets</h2>
				{tickets.length ? (
					tickets?.map((ticket_type: TicketType, idx: number) => {
						const type_index: number = idx;

						if (ticket_type.volume > 0) {
							return (
								<TicketTypeBox
									key={idx}
									ticket_type={ticket_type}
									onClick={(idx: number) => {
										const updated_ticket_sets = on_edit_tickets(
											type_index,
											idx,
											new Array(...tickets),
											new Array(...selected_tickets),
											"add"
										);

										set_tickets(updated_ticket_sets.ticket_options);
										set_selected_tickets(updated_ticket_sets.selected_tickets);
									}}
									default_color={primary_color}
									hover_color={secondary_color}
									active_color={primary_color}
								/>
							);
						}
						return null;
					})
				) : (
					<p className={"m-0 my-[10px] text-regular font-bold"}>
						There are no tickets available for this event matching your filters. Try refining them!
					</p>
				)}
			</div>
			<div className={ticket_box_styles}>
				<h2 className={"m-0 mb-[10px] text-md-header"}>Cart</h2>
				<div className={ticket_box_styles}>
					{!cart_empty(selected_tickets) ? (
						selected_tickets?.map((selected_ticket: SelectedTicket, idx: number) => {
							const { ticket_type, sold } = selected_ticket;
							const type_index: number = idx;

							return sold.map(
								({ ticket_tier, quantity }: { ticket_tier: TicketTier; quantity: number }, idx: number) =>
									quantity > 0 && (
										<SelectedTicketCard
											key={idx}
											ticket_type={ticket_type}
											ticket_tier={ticket_tier}
											quantity={quantity}
											onClick={() => {
												const updated_ticket_sets = on_edit_tickets(
													type_index,
													idx,
													new Array(...tickets),
													new Array(...selected_tickets),
													"remove"
												);

												set_tickets(updated_ticket_sets.ticket_options);
												set_selected_tickets(updated_ticket_sets.selected_tickets);
											}}
											default_color={primary_color}
										/>
									)
							);
						})
					) : (
						<p className={"m-0 my-[10px] text-regular font-bold"}>
							Your cart is empty. Select some tickets above before continuing!
						</p>
					)}
				</div>
			</div>
			<div className="mx-auto flex flex-row justify-between md:w-[500px]">
				<SmallButton
					default_color={primary_color}
					hover_color={secondary_color}
					active_color={primary_color}
					onClick={go_back}
				>
					Back
				</SmallButton>
				<SmallButton
					default_color={primary_color}
					hover_color={secondary_color}
					active_color={primary_color}
					disabled={cart_empty(selected_tickets)}
					onClick={go_forward}
				>
					Buy Tickets
				</SmallButton>
			</div>
		</div>
	);
};

export default Tickets;
