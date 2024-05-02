import { create } from "zustand";

export interface UseEventsState {
	pos_available_events: Array<EventCreate>;

	set_pos_available_events: (pos_available_events: Array<EventCreate>) => void;
}

export const use_events = create<UseEventsState>((set) => ({
	pos_available_events: [],

	set_pos_available_events: (pos_available_events: Array<EventCreate>) => set({ pos_available_events }),
}));
