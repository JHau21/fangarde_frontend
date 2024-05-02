import { create } from "zustand";
import { devtools } from "zustand/middleware";

export interface UseUserState {
	userJwt: string;
	user: any;
	userOrganization?: any;
	admins: Admin[];
	upcomingEvents: FullEvent[];
	pastEvents: FullEvent[];

	setUserOrganization: (userOrganization: any) => void;
	setUser: (user: any) => void;
	setAdmins: (admins: Admin[]) => void;
	setUpcomingEvents: (upcomingEvents: FullEvent[]) => void;
	setPastEvents: (pastEvents: FullEvent[]) => void;
	setJwt: (userJwt: string) => void;
	reset: () => void;
}

export const intialState = {
	userJwt: "",
	first_name: "",
	last_name: "",
	email: "",
	user: {},
	userOrganization: {},
	admins: [],
	upcomingEvents: [],
	pastEvents: [],
};

export const useUser = create<UseUserState, [["zustand/devtools", never]]>(
	devtools((set) => ({
		...intialState,
		setUser: (user: any) => set({ user }),
		setUserOrganization: (userOrganization: any) => set({ userOrganization }),
		setAdmins: (admins: Admin[]) => set({ admins }),
		setUpcomingEvents: (upcomingEvents: FullEvent[]) => set({ upcomingEvents }),
		setPastEvents: (pastEvents: FullEvent[]) => set({ pastEvents }),
		setJwt: (userJwt: string) => set({ userJwt }),
		reset: () => set(intialState),
	}))
);
