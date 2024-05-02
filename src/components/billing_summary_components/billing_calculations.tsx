import { CalculationsInput, CalculationsOutput } from "./types";

import { TransactionType } from "common";

export const calculate_billing = ({
	selected_tickets,
	donation_amount,
	donation_type,
	promo_discount,
	transaction_type,
}: CalculationsInput): CalculationsOutput => {
	let donation_total: number = donation_amount;
	let ticket_total_w_fees: number = 0;
	let order_total_wo_fees: number = 0;
	let order_total_w_promo: number = 0;
	let order_total_w_fees: number = 0;
	let paid_ticket_quantity: number = 0;
	let service_fee: number = 0;
	let processing_fee: number = 0;

	const ticket_items: Array<JSX.Element> = selected_tickets.map((selected_ticket: SelectedTicket) => {
		const { ticket_type } = selected_ticket;
		const { ticket_name } = ticket_type;

		return (
			<div className={"flex w-full flex-col items-start"}>
				<span className={"my-[10px] ml-[15px] text-regular font-bold"}>{ticket_name}</span>
				<div className={"flex w-full flex-col items-start"}>
					{selected_ticket.sold.map(
						(
							{
								ticket_tier,
								quantity,
							}: {
								ticket_tier: TicketTier;
								quantity: number;
							},
							idx: number
						) => {
							const price: number = ticket_tier.price * 100;
							let ticket_total: number = Math.round(price * quantity);

							order_total_wo_fees += ticket_total;

							if (price > 0) {
								paid_ticket_quantity += quantity;
							}

							if (quantity > 0) {
								return (
									<div key={idx} className={"mb-[10px] flex w-full flex-row items-center justify-between"}>
										<div className={"flex flex-row items-center"}>
											<span className={"ml-[30px] max-w-[130px] truncate"}>{ticket_tier.name}:</span>
											<span className={"ml-[5px] max-w-[130px] truncate text-fangarde-gray"}>
												${Math.round(price / 100)} x {quantity}
											</span>
										</div>
										<span>${Math.round(ticket_total / 100)}</span>
									</div>
								);
							}

							return null;
						}
					)}
				</div>
			</div>
		);
	});

	order_total_w_promo = Math.round(order_total_wo_fees);

	if (promo_discount && promo_discount > 0) {
		order_total_w_promo -= Math.round(order_total_w_promo * promo_discount);
	}

	if (donation_type === "percentage") {
		donation_total = Math.round(order_total_wo_fees * (donation_amount / 100));
	} else if (donation_type === "flat") {
		donation_total = Math.round(donation_total * 100);
	}

	if (!transaction_type) {
		if (order_total_wo_fees > 0) {
			ticket_total_w_fees = Math.round(order_total_w_promo);

			service_fee = Math.round(order_total_w_promo * 0.01 + paid_ticket_quantity * 100);
			processing_fee = Math.round((service_fee + order_total_w_promo + donation_total) * 0.0299 + 30);

			ticket_total_w_fees += Math.round(service_fee + processing_fee);
		} else if (order_total_wo_fees === 0 && donation_total > 0) {
			ticket_total_w_fees = Math.round(order_total_w_promo);

			processing_fee = Math.round(donation_total * 0.0299 + 30);

			ticket_total_w_fees += processing_fee;
		} else {
			ticket_total_w_fees = Math.round(order_total_w_promo);
		}

		order_total_w_fees = Math.round(ticket_total_w_fees + donation_total);
	} else if (transaction_type === TransactionType.Card) {
		if (order_total_wo_fees > 0) {
			ticket_total_w_fees = Math.round(order_total_w_promo);

			service_fee = Math.round(order_total_w_promo * 0.01 + paid_ticket_quantity * 100);
			processing_fee = Math.round(order_total_w_promo * 0.0299 + 30);
		}

		order_total_w_fees = Math.round(ticket_total_w_fees);
	} else {
		order_total_w_fees = Math.round(order_total_wo_fees);
	}

	return {
		ticket_items,
		service_fee: service_fee / 100,
		processing_fee: processing_fee / 100,
		order_total_w_fees: order_total_w_fees / 100,
		donation_total: donation_total / 100,
	};
};
