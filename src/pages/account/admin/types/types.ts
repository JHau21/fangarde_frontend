import ObjectId from "bson-objectid";
import { AccessType, AdmissionType, Genre, IndoorsOutdoors, SeatHoldsReleaseType } from "../../../../common";

function getRoundedDate(minutes: number, d = new Date()) {
	let ms = 1000 * 60 * minutes; // convert minutes to ms
	let roundedDate = new Date(Math.ceil(d.getTime() / ms) * ms);

	return roundedDate;
}

export const getTomorrow: () => Date = () => {
	let tomorrow = new Date();
	tomorrow.setDate(tomorrow.getDate() + 1);
	let roundTomorrow = getRoundedDate(15, tomorrow);
	return roundTomorrow;
};

export const getToday: () => Date = () => {
	let today = new Date();
	today.setDate(today.getDate());
	return today;
};

export const EmptyTicketTypeStub: TicketTypeStub = {
	ticket_name: "",
	number_sold: 0,
	number_of_tickets: 0,
};

export const EmptyFoodOptions: FoodOptions = {
	food_name: "",
	food_ingredients: "",
	food_description: "",
};

export const EmptyAddress: Address = {
	street: "",
	city: "",
	state: "Colorado",
	zip: "",
};

export enum Location_Type {
	Online = "online",
	Physical = "physical",
	TBA = "tba",
}

export const EmptyLocation = {
	name: "",
	type: Location_Type.Physical,
	address: EmptyAddress,
	meeting_url: "",
	additional_location_info: "",
};

export const EmptyEventCreate: EventCreate = {
	name: "",
	organization_id: "",
	location: EmptyLocation,
	transactions: [],
	event_start_time: getTomorrow(),
	event_end_time: new Date(getTomorrow().getTime() + 30 * 60000),
	indoors_outdoors: IndoorsOutdoors.Indoors,
	age_restriction: false,
	serving_food: undefined,
	admission_type: AdmissionType.Tickets,
	access_type: AccessType.Public,
	genre: Genre.None,
	ticket_types: [],
};

export const EmptyTicketEventCreate: TicketEventCreate = {
	name: "",
	organization_id: "",
	location: EmptyLocation,
	ticket_types: [],
	transaction_ids: [],
	event_start_time: getTomorrow(),
	event_end_time: new Date(getTomorrow().getTime() + 30 * 60000),
	indoors_outdoors: IndoorsOutdoors.Indoors,
	age_restriction: false,
	serving_food: undefined,
	admission_type: AdmissionType.Tickets,
	access_type: AccessType.Public,
	genre: Genre.None,
};

export interface Error {
	exists: boolean;
	msg: string;
}
export interface GeneralEventErrors {
	name: string;
	location_name: string;
	genre: string;
	street: string;
	state: string;
	zip: string;
	city: string;
	meeting_url: string;
}
export const EmptyGeneralEventErrors: GeneralEventErrors = {
	name: "",
	location_name: "",
	genre: "",
	street: "",
	state: "",
	zip: "",
	city: "",
	meeting_url: "",
};
export interface TicketType {
	_id?: ObjectId;
	ticket_name: string;
	price: number;
	number_of_tickets: number;
	ticket_tier: string;
	release_time: Date;
	stop_sale_time: Date;
	resellable: boolean;
	transferrable: boolean;
	merchandise?: Merchandise[] | boolean;
	seat_holds?: SeatHolds | undefined;
	custom_ticket_message?: CustomTicketMessage;
}
export interface CustomTicketMessage {
	title: string;
	content: string;
}
export const EmptyCustomTicketMessage = {
	title: "",
	content: "",
};
export const CreateEmptyTicketType = (): TicketType => {
	const release_time = getToday();
	const stop_sale_time = getTomorrow();
	return {
		ticket_name: "",
		price: 0,
		number_of_tickets: 0,
		ticket_tier: "",
		release_time: release_time,
		stop_sale_time: stop_sale_time,
		resellable: false,
		transferrable: false,
		merchandise: undefined,
		seat_holds: undefined,
	};
};
export interface fieldTitle {
	field_title: string;
}
export const emptyFieldName: fieldTitle = {
	field_title: "",
};

export interface SeatHolds {
	num_seat_holds: number;
	seat_holds_release_type: SeatHoldsReleaseType;
	seat_hold_release_ticket_type_id?: ObjectId | undefined;
	seat_hold_release_time?: Date;
}
export const EmptySeatHolds: SeatHolds = {
	num_seat_holds: 0,
	seat_holds_release_type: SeatHoldsReleaseType.none,
};
export interface Merchandise {
	name: string;
	item: string;
	sales_tax_included: boolean | undefined;
	consumer_fields: fieldTitle[];
}

export const EmptyMerchandise: Merchandise = {
	name: "",
	item: "",
	sales_tax_included: false,
	consumer_fields: [emptyFieldName],
};

export const DummyMerchandise: Merchandise = {
	name: "dummy_data",
	item: "dummy_data",
	sales_tax_included: false,
	consumer_fields: [
		{
			field_title: "dummy_data",
		},
	],
};

export interface User {
	first_name: string;
	last_name: string;
	phone_number?: string;
	password: string;
	email: string;
	role: string;
	organization_id: string;
	profile_picture?: any;
}

export interface Filters {
	name: string;
	location: string;
	genre: Genre;
	start_time: Date | undefined;
	end_time: Date | undefined;
}

export const empty_filters: Filters = {
	name: "",
	location: "",
	genre: Genre.None,
	start_time: undefined,
	end_time: undefined,
};

// export interface Image {
//     type: string,
//     data: ArrayBuffer
// }
export const EmptyEvent: EventModel = {
	name: "",
	location: "",
	address: EmptyAddress,
	description: "",
	ticket_types: [],
	transaction_ids: [],
	event_start_time: new Date(),
	event_end_time: new Date(),
	indoors_outdoors: IndoorsOutdoors.None,
	age_restriction: "",
	serving_food: undefined,
	admission_type: AdmissionType.None,
	access_type: AccessType.None,
	genre: Genre.None,
	search_image: undefined,
	banner: undefined,

	_id: "",
	organization_id: "",
	pictures: [],
	videos: [],
	date: new Date(),
	venue_name: "",
	donation_message: "",
	donation_options: [],
	donation_type: "",
	donations: false,
	image: "",
	extra_info: "",
	min_price: 0,
};
export interface EventContext {
	selected_event: FullEvent;
	set_selected_event: Function;
}
export interface UpdateEventRequest {
	event: Event;
}

export interface SpreadsheetMapType {
	[key: string]: string;
}

export const SpreadsheetMap: SpreadsheetMapType = {
	"Transaction ID": "_id",
	"First Name": "first_name",
	"Last Name": "last_name",
	"Email Address": "email",
	Purchased: "ticket_name",
	Quantity: "quantity",
	Cost: "cost",
};

export const EmptySpreadsheetOptions: SpreadsheetOptions = {
	"Transaction ID": true,
	"First Name": true,
	"Last Name": true,
	"Email Address": true,
	Purchased: true,
	Quantity: true,
	Cost: true,
};
