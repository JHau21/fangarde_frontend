// Please note, I've substituted the correct objectID type for type "any"
// The reason I did this, instead of finding a way to get the correct type
// is because I want this codebase to be as lightweight as possible
// So, for now, type "any" will suffice.

import ObjectId from "bson-objectid";
import { EmptyFoodOptions } from "../../pages/account/admin/types/types";
import {
	AccessType,
	AdmissionType,
	Genre,
	IndoorsOutdoors,
} from "../../common";

export const EmptyAddress: Address = {
	street: "",
	city: "",
	state: "",
	zip: "",
};

export const EmptyFullEvent = {
	name: "",
	location: "",
	address: EmptyAddress,
	transaction_ids: [],
	event_start_time: new Date(),
	event_end_time: new Date(),
	indoors_outdoors: IndoorsOutdoors.None,
	age_restriction: "",
	serving_food: EmptyFoodOptions,
	admission_type: AdmissionType.None,
	access_type: AccessType.None,
	genre: Genre.None,
	_id: new ObjectId(),
	donation_options: [],
	banner: "",
	search_image: "",
	organization_id: new ObjectId(),
	description: "",
	donations: false,
	transactions: [],
	ticket_types: [],
};
