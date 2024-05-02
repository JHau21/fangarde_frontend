export type Donation = {
	type: string;
	amount: number;
};

export type OrderPayload = {
	order: Array<SelectedTicket>;
	organization: Organization;
	stripe_token?: any;
	event: EventCreate;
	user: {
		user_id?: any;
		first_name: String;
		last_name: String;
		email: string;
	};
	promo_code?: String;
	donation?: Donation;
	paid_tickets?: boolean;
	opted_in: boolean;
};
