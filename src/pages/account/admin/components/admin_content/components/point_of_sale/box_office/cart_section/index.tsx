import SelectedTicketCard from "components/ticket_cards/selected";
import TicketTypeBox from "components/ticket_type_box";

import { cart_empty, on_edit_tickets } from "utils/common_methods";

type Props = {
	tickets: Array<TicketType>;
	selected_tickets: Array<SelectedTicket>;
	set_tickets: Function;
	set_selected_tickets: Function;
};

const CartSection = ({ tickets, selected_tickets, set_tickets, set_selected_tickets }: Props) => {
	return (
		<div className="my-[20px] w-full">
			<h2 className={"tetx-md-header my-[10px]"}>Order</h2>
			<div className={"my-[20px] flex flex-col items-start overflow-y-scroll"}>
				<h3 className={"m-0 text-sm-header"}>Available Tickets:</h3>
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
			<div className={"my-[20px] flex max-h-[500px] flex-col items-start overflow-y-scroll"}>
				<h3 className={"m-0 text-sm-header"}>Cart:</h3>
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
	);
};

export default CartSection;
