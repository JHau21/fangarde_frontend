export const get_price_range = (ticket_tiers: Array<TicketTier>): string => {
	let high_price: number = 0;
	let low_price: number = 99999999;

	for (const tier of ticket_tiers) {
		const { price } = tier;

		if (price > high_price) high_price = price;
		if (price < low_price) low_price = price;
	}

	if (high_price === low_price) {
		return low_price.toString();
	} else {
		return low_price.toString() + " - " + high_price.toString();
	}
};
