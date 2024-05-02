import { ObjectID } from "mongodb";

import { CustomEmailImage, TransactionType, Genre, AccountingStatementInterval } from "common";
import { CustomTicketMessage } from "pages/account/admin/types/types";
import { type } from "os";

declare global {
	interface Admin extends User {
		role: AdminRoles;
	}

	type Address = {
		street: string;
		city: string;
		state: string;
		zip: string;
	};

	interface AdminSignUp extends UserSignUp {
		role: AdminRoles;
	}

	type BankAccount = {
		id: string;
		bank_name: string;
		account_type: string;
		last4: string;
		default_for_currency: boolean;
	};

	type BillingInformation = {
		card_number: string;
		expiration_date: string;
		security_code: string;
		billing_address: string;
		country: string;
		city: string;
		state: string;
		zip_code: string;
	};

	type ButtonColors = {
		border?: string;
		backgroundColor?: string;
		color?: string;
		width?: string;
	};

	type CustomTicketMessageSchema = {
		title?: string;
		content?: string;
	};

	type Donation = {
		type: string;
		amount: number;
	};

	type EventLocation = {
		type: string;
		name: string;
		address: Address;
		meeting_url: string;
		additional_location_info?: string;
	};

	type MenuElement = { title: string; route: string };

	type EventCreate = {
		_id?: any;
		organization_id: string;
		name: string;
		subtitle?: string;
		location: EventLocation;
		description?: string;
		extra_info?: string;
		ticket_types: Array<TicketType>;
		volume?: Number;
		draft?: boolean;
		past?: boolean;
		upcoming?: boolean;
		transactions?: Array<Transaction>;
		event_start_time: Date;
		event_end_time: Date;
		indoors_outdoors: IndoorsOutdoors;
		age_restriction?: string | boolean;
		serving_food?: FoodOptions | boolean;
		admission_type: AdmissionType;
		access_type: AccessType;
		genre: Genre;
		search_image?: string;
		banner?: string;
		donations?: undefined | boolean;
		donation_type?: undefined | DonationType;
		donation_message?: undefined | string;
		donation_options?: Array<number>;
		sub_events?: undefined | boolean;
		color_scheme?: {
			primary_color?: string;
			secondary_color?: string;
		};
	};

	type EventModel = {
		_id: string;
		organization_id: string;
		name: string;
		subtitle?: string;
		location: string;
		address: {
			street: string;
			zip: string;
			state: string;
			city: string;
		};
		pictures: string[];
		videos: string[];
		ticket_types: ObjectID[];
		transaction_ids: string[];
		event_start_time: Date;
		event_end_time: Date;
		indoors_outdoors: "Indoors" | "Outdoors" | "none";
		search_image?: string;
		banner?: string;
		age_restriction: string;
		serving_food?: Food;
		admission_type: "Guest List" | "Tickets" | "None";
		access_type: "Public" | "Private" | "None";
		genre: "Music" | "Sports" | "Theatre" | "Comedy" | "Arts" | "Private Events" | "None";
		date: Date;
		venue_name: string;
		description: string;
		donation_message: string;
		donation_options: Array<number>;
		donation_type: string;
		donations: boolean;
		image: any;
		extra_info: string;
		min_price: number;
		color_scheme?: {
			primary_color: string;
			secondary_color: string;
		};
	};

	type Events = {
		_id: string;
		name: string;
		location: string;
		address: Address;
		transaction_ids: Array<any>;
		event_start_time: Date;
		event_end_time: Date;
		indoors_outdoors: IndoorsOutdoors;
		age_restriction: string | undefined;
		serving_food: Array<FoodOption> | boolean;
		admission_type: AdmissionTypes;
		access_type: AccessTypes;
		genre: Genre;
		search_image?: string;
		banner?: string;
		donations: boolean;
		donation_type?: string;
		donation_message?: string;
		donation_options?: Array<number>;
		color_scheme?: {
			primary_color?: string;
			secondary_color?: string;
		};
	};

	type SelectedEvent = EventCreate & {
		transactions: Array<Transaction>;
	};

	type EventLocation = {
		type: string;
		name: string;
		address: Address;
		meeting_url: string;
		additional_location_info?: string;
	};

	type Food = {
		_id: string;
		food_options: {
			_id: string;
			food_name: string;
			food_ingredients: string[];
			food_description: string;
		};
	};

	type FoodOption = {
		name: string;
		ingredients: Array<string>;
		food_description: string;
		allergy_warning: string | undefined;
	};

	interface FoodOptions {
		food_name: string;
		food_ingredients: string;
		food_description: string;
		allergy_warning?: string;
	}

	interface FullEvent extends Event {
		access_type: AccessType;
		age_restriction: string | undefined;
		_id: ObjectId;
		admission_type: AdmissionType;
		banner: string;
		description: string;
		donation_options: any[]; // Replace with actual type if known
		donations: boolean;
		event_end_time: Date;
		event_start_time: Date;
		genre: Genre;
		indoors_outdoors: IndoorsOutdoors;
		location: EventLocation;
		name: string;
		organization_id: ObjectId;
		search_image: string;
		serving_food: FoodOptions; // Replace with actual type if known
		ticket_types: TicketType[];
		transaction_ids: any;
		transactions: Array<Transaction>;
	}

	type Merchandise = {
		name: string;
		item: string;
		sales_tax_included: boolean;
		consumer_fields: Array<{
			field_title: string;
		}>;
	};

	type OrderItem = {
		ticket_type_id: string;
		ticket_ids: string[];
		ticket_name: string;
		quantity: number;
	};

	type Organization = {
		_id: any;
		stripe_conn_id?: string;
		name: string;
		// email: string;
		// phone_number: string;
		description: string;
		locations: Array<string>;
		admins: Array<string>;
		num_attendee_per_event: number;
		num_locations: number;
		number_events_annual: number;
		pictures: Array<string>;
		type: string;
		website: string;
		stripe_conn_id: string;
		financial_settings?: {
			interval: string;
			email_address: string;
		};
		custom_email_message?: {
			thank_you_message?: string;
			additional_details_message?: string;
			image_option?: CustomEmailImage;
		};
		request_marketing_communications: {
			requested: boolean;
			custom_message: string;
		};
		mailing_list: Array<string>;
		location_id: string;
		terminals: Array<Terminal>;
	};

	type PayoutObject = {
		payout_destination: string;
		debit_negative_balances: boolean;
		schedule: {
			weekly_anchor?: string;
			monthly_anchor?: number;
			delay_days?: number;
			interval: string;
		};
		state_descriptor: string;
	};

	type AccountingStatement = {
		interval: AccountingStatementInterval | undefined;
		email_address: string | undefined;
	};

	interface OrganizationSignUp {
		_id?: ObjectId;
		name: string;
		description: string;
		genre: string;
		locations: any[];
		number_events_annual: number;
		multiple_locations?: Boolean | string;
		num_locations: number;
		num_attendee_per_event: number;
		pictures?: any;
		admins?: ObjectId[];
		mcc?: string;
		url?: string;
		business_type?: string;
		company?: {
			address: {
				city: string;
				country: string;
				line1: string;
				line2: string | undefined;
				postal_code: string;
				state: string;
			};
			name: string;
			phone: string;
			structure: string;
			tax_id_provided: boolean;
			tax_id: string;
		};
		country?: string;
		default_currency?: string;
		email?: string;
		settings?: {
			payments: {
				statement_descriptor: string;
			};
			payouts: {
				schedule: {
					delay_days: number;
					interval: string;
				};
				statement_descriptor: string | undefined;
			};
		};
		tos_acceptance?: {
			date: number; // this needs to be the number of seconds representing the date
			ip: string;
			user_agent: string | undefined; // this is the browser that was used and the related info.
		};
		type?: string;
		paid_events: boolean;
		banner?: string;
	}

	interface OrganizationSignUpError {
		name: string;
		description: string;
		genre: string;
		num_locations: string;
		num_attendee_per_event: string;
		multiple_locations: string;
		number_events_annual: string;
	}

	type Owner = {
		first_name: string;
		last_name: string;
		email: string;
		confirm_email: string;
		phone: string;
	};

	type PromoCode = {
		_id?: ObjectId;
		name: string;
		discount: number;
		code: string;
		event_id: ObjectId;
	};

	type RepresentativeIdentity = {
		address: {
			city: string;
			country: string;
			line1: string;
			line2: string;
			postal_code: string;
			state: string;
		};
		ssn_last_4: string;
		id_number: string;
	};

	type SeatHolds = {
		num_seat_holds: number;
		seat_holds_release_type: string;
		seat_hold_release_time?: Date;
		seat_hold_release_ticket_type_id?: string;
	};

	type SelectedTicket = {
		ticket_type: TicketType;
		sold: Array<{
			ticket_tier: TicketTier;
			quantity: number;
		}>;
	};

	type SpreadsheetOptions = {
		[key: string]: any;
		"Transaction ID": boolean;
		"First Name": boolean;
		"Last Name": boolean;
		"Email Address": boolean;
		Purchased: boolean;
		Quantity: boolean;
		Cost: boolean;
	};

	type StripeFile = {
		file: {
			data: any;
			name: string;
			type: string;
		};
	};

	type SubTicketType = {
		ticket_id: any;
		ticket_name: string;
		number_sold: number;
		total_number: number;
	};

	type Terminal = {
		name: string;
		terminal_id: string;
		registration_code: string;
	};

	type Ticket = {
		_id: any | undefined;
		transaction_id: any;
		event_id: any;
		user_id: any;
		ticket_type: string;
	};

	interface TicketEventCreate extends EventCreate {
		name: string;
		location: EventLocation;
		description?: string;
		ticket_types: ObjectID[];
		transaction_ids: [];
		event_start_time: Date;
		event_end_time: Date;
		indoors_outdoors: IndoorsOutdoors;
		age_restriction?: string | boolean;
		serving_food?: FoodOptions | boolean;
		admission_type: AdmissionType;
		access_type: AccessType;
		genre: Genre;
		search_image?: string;
		banner?: string;
	}

	type TicketsForCheckout = {
		ticket: TicketType;
		quantity: number;
	};

	interface TicketTier {
		_id: any;
		name: string;
		price: number;
	}

	type TicketTypeStub = {
		ticket_name: string;
		number_sold?: number;
		number_of_tickets: number;
	};

	type TicketType = {
		_id: string;
		event_id: string;
		ticket_name: string;
		price: number;
		volume: number;
		number_of_tickets: number;
		ticket_tiers: Array<TicketTier>;
		release_time: Date;
		stop_sale_time: Date;
		resellable: boolean;
		transferrable: boolean;
		seat_holds?: SeatHolds;
		merchandise?: Merchandise;
		timed_entry_options?: Array<Date>;
		custom_ticket_message?: CustomTicketMessage;
	};

	type Transaction = {
		_id?: any;
		charge_id?: string;
		organization_id: any;
		order: Array<{
			ticket_name: string;
			ticket_type_id: any;
			ticket_ids: Array<any>;
			quantity: number;
		}>;
		last_four_card_digits: string;
		time: Date;
		transaction_type: TransactionType;
		transaction_fee: number;
		sale_location: string;
		consumer_cost: number;
		actual_cost: number;
		unrounded_customer_profit: number;
		rounded_customer_profit: number;
		first_name: string;
		last_name: string;
		email: string;
		donation_id: any;
		opted_into_mailing_list: boolean;
		refunded: boolean;
	};

	interface UploadRepresentative extends RepresentativeIdentity {
		dob: {
			day: number;
			month: number;
			year: number;
		};
	}

	type User = {
		_id?: ObjectID;
		first_name: string;
		last_name: string;
		email: string;
		confirm_email: string;
		phone_number: string; // for right now we'll make this optional
	};

	type UserError = {
		first_name: boolean;
		last_name: boolean;
		email: boolean;
		confirm_email: boolean;
		phone_number: boolean;
	};

	interface UserSignUp extends User {
		password: string;
		confirm_password: string;
	}

	interface UserSignUpError extends UserError {
		password: boolean;
		confirm_password: boolean;
	}

	type User = {
		first_name: string;
		last_name: string;
		email: string;
		confirm_email: string;
		phone_number: string; // for right now we'll make this optional
	};

	type UserError = {
		first_name: boolean;
		last_name: boolean;
		email: boolean;
		confirm_email: boolean;
		phone_number: boolean;
	};

	interface UserSignUp extends User {
		password: string;
		confirm_password: string;
	}

	interface UserSignUpError extends UserError {
		password: boolean;
		confirm_password: boolean;
	}

	type Warning = {
		first_name: boolean;
		last_name: boolean;
		card_number: boolean;
		expiration_date: boolean;
		security_code: boolean;
	};
}
