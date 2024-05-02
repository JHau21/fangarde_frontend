import { StateCreator, create } from "zustand";
import { PersistOptions, createJSONStorage, persist } from "zustand/middleware";

export interface UseTicketOrderState {
	ticket_options: undefined | Array<TicketType>;
	selected_event: undefined | EventCreate;
	selected_organization: undefined | Organization;
	selected_tickets: undefined | Array<SelectedTicket>;
	promo_discount: undefined | number;
	donation: undefined | Donation;

	set_ticket_options: (ticket_options: undefined | Array<TicketType>) => void;
	set_selected_event: (selected_event: undefined | EventCreate) => void;
	set_selected_organization: (selected_organization: undefined | Organization) => void;
	set_selected_tickets: (selected_tickets: undefined | Array<SelectedTicket>) => void;
	set_promo_discount: (promo_discount: undefined | number) => void;
	reset: () => void;
	set_donation: (donation: undefined | Donation) => void;
}

type UseEventsStatePersist = (
	config: StateCreator<UseTicketOrderState>,
	options: PersistOptions<UseTicketOrderState>
) => StateCreator<UseTicketOrderState>;

export const use_ticket_order = create<UseTicketOrderState>(
	(persist as UseEventsStatePersist)(
	(set) => ({
		ticket_options: undefined,
		selected_event: undefined,
		selected_organization: undefined,
		selected_tickets: undefined,
		promo_discount: undefined,
		donation: undefined,

		set_ticket_options: (ticket_options: undefined | Array<TicketType>) => set({ ticket_options }),
		set_selected_event: (selected_event?: EventCreate) => set({ selected_event }),
		set_selected_organization: (selected_organization: undefined | Organization) => set({ selected_organization }),
		set_selected_tickets: (selected_tickets: undefined | Array<SelectedTicket>) => set({ selected_tickets }),
		set_promo_discount: (promo_discount: undefined | number) => set({ promo_discount }),
		reset: () =>
			set({
				ticket_options: undefined,
				selected_event: undefined,
				selected_organization: undefined,
				selected_tickets: undefined,
				promo_discount: undefined,
				donation: undefined,
			}),
		set_donation: (donation: undefined | Donation) => set({ donation }),
	}),
		{
			name: "events",
			storage: createJSONStorage(() => sessionStorage),
		}
	)
);
