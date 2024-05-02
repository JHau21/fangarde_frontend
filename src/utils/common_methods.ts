export const format_address = (address: { street: string; zip: string; state: string; city: string }) => {
	const { street, zip, state, city } = address;

	return street + " in " + city + ", " + state + " " + zip;
};

export const format_confirmation_date = (js_date: Date) => {
	const date: string = js_date.getDate().toString();
	const year: string = js_date.getFullYear().toString();
	const month: string = js_date.toLocaleDateString("en-US", { month: "short" });

	switch (date[date.length - 1]) {
		case "1": {
			return `${month} ${date}st, ${year}`;
		}
		case "2": {
			return `${month} ${date}nd, ${year}`;
		}
		case "3": {
			return `${month} ${date}rd, ${year}`;
		}
		default: {
			return `${month} ${date}th, ${year}`;
		}
	}
};

export const format_day_time = (js_date: Date) => {
	return (
		js_date.toLocaleDateString("en-US", { weekday: "short" }) +
		" @ " +
		js_date.toLocaleTimeString("en-US", {
			hour: "numeric",
			minute: "numeric",
			hour12: true,
		})
	);
};

export const on_edit_tickets = (
	type_index: number,
	tier_index: number,
	ticket_options: Array<TicketType>,
	selected_tickets: Array<SelectedTicket>,
	action: string
): { ticket_options: Array<TicketType>; selected_tickets: Array<SelectedTicket> } => {
	if (ticket_options[type_index].number_of_tickets > 0 && action === "add") {
		ticket_options[type_index] = {
			...ticket_options[type_index],
			number_of_tickets: ticket_options[type_index].number_of_tickets - 1,
		};

		selected_tickets[type_index].sold[tier_index] = {
			...selected_tickets[type_index].sold[tier_index],
			quantity: selected_tickets[type_index].sold[tier_index].quantity + 1,
		};

		return {
			ticket_options,
			selected_tickets,
		};
	} else if (selected_tickets[type_index].sold[tier_index].quantity > 0 && action === "remove") {
		selected_tickets[type_index].sold[tier_index] = {
			...selected_tickets[type_index].sold[tier_index],
			quantity: selected_tickets[type_index].sold[tier_index].quantity - 1,
		};

		ticket_options[type_index] = {
			...ticket_options[type_index],
			number_of_tickets: ticket_options[type_index].number_of_tickets + 1,
		};

		return {
			ticket_options,
			selected_tickets,
		};
	} else {
		return {
			ticket_options,
			selected_tickets,
		};
	}
};

export const cart_empty = (selected_tickets: Array<SelectedTicket>): boolean => {
	return (
		selected_tickets.reduce((total: number, selected_ticket: SelectedTicket) => {
			const { sold } = selected_ticket;

			return (
				total +
				sold.reduce(
					(type_total: number, { quantity }: { ticket_tier: TicketTier; quantity: number }) => type_total + quantity,
					0
				)
			);
		}, 0) === 0
	);
};

export const paid_event = (selected_tickets: Array<SelectedTicket>): boolean => {
	return (
		selected_tickets.reduce(
			(total: number, selected_ticket: SelectedTicket) =>
				total +
				selected_ticket.sold.reduce(
					(
						total: number,
						{
							ticket_tier,
							quantity,
						}: {
							ticket_tier: TicketTier;
							quantity: number;
						}
					) => total + quantity * ticket_tier.price,
					0
				),
			0
		) !== 0
	);
};
