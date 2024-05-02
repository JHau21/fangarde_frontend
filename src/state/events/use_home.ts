import { create } from "zustand";

export interface UseHomeState {
	searched_events: Array<EventCreate>;
	searched_organizations: Array<Organization>;
	searched_tickets: Array<TicketType>;

	set_all_events_data: (
		searched_events: Array<EventCreate>,
		searched_organizations: Array<Organization>,
		searched_tickets: Array<TicketType>
	) => void;
	set_events: (searched_events: Array<EventCreate>) => void;
	set_organizations: (searched_organizations: Array<Organization>) => void;
	set_tickets: (searched_tickets: Array<TicketType>) => void;
}

export const use_home = create<UseHomeState>((set) => ({
	searched_events: [],
	searched_organizations: [],
	searched_tickets: [],

	set_all_events_data: (
		searched_events: Array<EventCreate>,
		searched_organizations: Array<Organization>,
		searched_tickets: Array<TicketType>
	) => set({ searched_events, searched_organizations, searched_tickets }),
	set_events: (searched_events: Array<EventCreate>) => set({ searched_events }),
	set_organizations: (searched_organizations: Array<Organization>) => set({ searched_organizations }),
	set_tickets: (searched_tickets: Array<TicketType>) => set({ searched_tickets }),
}));
