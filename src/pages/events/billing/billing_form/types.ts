export type BillingData = {
	currency: string;
	name: string;
	address_line1: string;
	address_city: string;
	address_state: string;
	address_zip: string;
	address_country: string;
};

export type PaidHookForm = BillingInformation & UserInformation;

export type UserInformation = {
	first_name: string;
	last_name: string;
	email: string;
	confirm_email: string;
};
