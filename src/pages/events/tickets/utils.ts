import { Filters } from "./types";

export const filter_tickets = ({ search, high_price, low_price }: Filters, ticket_options: Array<TicketType>) => {
	let filtered_tickets: Array<TicketType> = new Array(...ticket_options);

	filtered_tickets = filtered_tickets.filter(({ ticket_name }: TicketType) =>
		ticket_name.toLowerCase().includes(search.toLowerCase())
	);

	if (high_price !== -1 || low_price !== -1) {
		filtered_tickets = filtered_tickets
			.map((ticket: TicketType) => {
				const temp_ticket_tiers: Array<TicketTier> = ticket.ticket_tiers.filter((ticket_tier: TicketTier) => {
					const { price } = ticket_tier;

					if (
						(high_price !== -1 && low_price !== -1 && price <= high_price && price >= low_price) ||
						(high_price !== -1 && price <= high_price && low_price === -1) ||
						(low_price !== -1 && price >= low_price && high_price === -1)
					) {
						return ticket_tier;
					}

					return false;
				});

				return {
					...ticket,
					ticket_tiers: temp_ticket_tiers,
				};
			})
			.filter((ticket: TicketType) => ticket.ticket_tiers.length);
	}

	return filtered_tickets;
};
