import {
	EmptyEventCreate,
	TicketType,
	EmptyTicketEventCreate,
	CreateEmptyTicketType,
} from "../../../../types/types";

export interface CreateEventRequest {
	event: TicketEventCreate;
	ticket_types: TicketType[];
}
export const EmptyCreateEventRequest: CreateEventRequest = {
	event: EmptyTicketEventCreate,
	ticket_types: [CreateEmptyTicketType()],
};
export interface CreateGuestListEventRequest {
	event: EventCreate;
}
export const EmptyCreateGuestListEventRequest: CreateGuestListEventRequest = {
	event: EmptyEventCreate,
};
