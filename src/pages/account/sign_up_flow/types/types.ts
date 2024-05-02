import { AdminRoles } from "common";

export const emptyRepresentative: RepresentativeIdentity = {
	address: {
		city: "",
		country: "",
		line1: "",
		line2: "",
		postal_code: "",
		state: "",
	},
	ssn_last_4: "",
	id_number: "",
};

export const emptyOwner: Owner = {
	first_name: "",
	last_name: "",
	email: "",
	confirm_email: "",
	phone: "",
};

export const emptyUserSignUpError: UserSignUpError = {
	first_name: false,
	last_name: false,
	email: false,
	confirm_email: false,
	phone_number: false,
	password: false,
	confirm_password: false,
};

export const emptyUserSignUp: UserSignUp = {
	first_name: "",
	last_name: "",
	email: "",
	confirm_email: "",
	phone_number: "",
	password: "",
	confirm_password: "",
};

export const emptyRootAdminSignUp: AdminSignUp = {
	first_name: "",
	last_name: "",
	email: "",
	confirm_email: "",
	phone_number: "",
	password: "",
	confirm_password: "",
	role: AdminRoles.Root,
};
export const emptyGeneralAdminSignUp: AdminSignUp = {
	first_name: "",
	last_name: "",
	email: "",
	confirm_email: "",
	phone_number: "",
	password: "",
	confirm_password: "",
	role: AdminRoles.Root,
};
export const emptyOrganizationSignUp: OrganizationSignUp = {
	name: "",
	description: "",
	genre: "",
	locations: [],
	number_events_annual: 0,
	num_locations: 1,
	num_attendee_per_event: 0,
	paid_events: false,
	banner: "",
	multiple_locations: undefined,
};
export const emptyRootAdmin: Admin = {
	first_name: "",
	last_name: "",
	email: "",
	confirm_email: "",
	phone_number: "",
	role: AdminRoles.General,
};
export const emptyGeneralAdmin: Admin = {
	first_name: "",
	last_name: "",
	email: "",
	confirm_email: "",
	phone_number: "",
	role: AdminRoles.General,
};
export const emptyUserError: UserError = {
	first_name: false,
	last_name: false,
	email: false,
	confirm_email: false,
	phone_number: false,
};
