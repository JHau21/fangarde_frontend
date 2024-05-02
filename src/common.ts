export enum AccessType {
	Public = "Public",
	Private = "Private",
	None = "None",
}

export enum AccountingItem {
	banking = "banking",
	books = "books",
}

export enum AccountingStatementInterval {
	weekly = "weekly",
	monthly = "monthly",
	yearly = "yearly",
}

export enum AdminRoles {
	Root = "Root Admin",
	General = "General Admin",
	Regular = "Regular",
}

export enum AdmissionType {
	GuestList = "Guest List",
	Tickets = "Tickets",
	None = "None",
}

export enum ButtonTypes {
	Button = "button",
	Submit = "submit",
	Reset = "reset",
}

export enum CreateEventFlow {
	GeneralInfo = "general_info",
	TicketInfo = "ticket_info",
	AdditionalInfo = "additional_info",
	Done = "Done",
	Error = "Error",
}

export enum CustomEmailImage {
	OrgBanner = "org_banner",
	EventSearchImage = "event_search_image",
	EventBannerImage = "event_banner_image",
	None = "none",
}

export enum DonationType {
	Flat = "flat",
	Percentage = "percentage",
	None = "none",
}

export enum Genre {
	None = "None",
	Sports = "Sports",
	Theatre = "Theater",
	Comedy = "Comedy",
	Arts = "Arts",
	Concerts = "Concerts",
	Festivals = "Festivals",
	Symphony = "Symphony",
	Conferences = "Conferences",
	Music = "Music",
}

export enum IndoorsOutdoors {
	Outdoors = "Outdoors",
	Indoors = "Indoors",
	None = "none",
}

export enum MenuItem {
	account = "account",
	organization = "organization",
	accounting = "accounting",
	createEvent = "create_event",
	pastEvents = "past_events",
	upcomingEvents = "upcoming_events",
	point_of_sale = "point_of_sale",
	eventTemplates = "event_creation_templates",
	metrics = "metrics",
	support = "support",
}

export enum RefundTypes {
	Event = "event",
	Trans = "transaction",
}

export enum SeatHoldsReleaseType {
	timed = "timed",
	ticket = "ticket",
	none = "none",
}

export enum SignUpStep {
	SignUpInfo = "sign_up_info",
	SignUpUser = "sign_up_user",
	SignUpAdmins = "sign_up_admin",
	SignUpOrg = "sign_up_organization",
	SignUpDone = "sign_up_done",
	SignUpInit = "sign_up_init",
	SignUpDisclaimer = "sign_up_disclaimer",
	SignUpOrgLocation = "sign_up_org_location",
	SignUpOrgIdentity = "sign_up_org_identity",
	SignUpOwner = "sign_up_owner",
	SignUpRepIdentity = "sign_up_rep_identity",
	Error = "sign_up_error",
}

export enum SignUpType {
	EventGoer = "event-goer",
	EventCreator = "event-creator",
	None = "none",
}

export enum TicketPageOptions {
	POS = "pos",
	BuyTickets = "buy_tickets",
	Neither = "neither",
}

export enum TransactionType {
	Free = "free",
	Card = "card",
	Cash = "cash",
}
