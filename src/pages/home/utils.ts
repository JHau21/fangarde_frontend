import { api } from "axiosClients/client";

import { error_handler } from "utils/api_error_handles";

import { FilterObject } from "./types";

import DefaultImage from "common/images/default_concert_stage_image3.png";

export const fetch_user_account_data = async (): Promise<{ success: boolean; user: User | undefined; message: string }> => {
	try {
		const response = await api.post("/fetch_account");

		const { status } = response;
		const { user } = response.data;

		if (status === 201 && user) {
			return { success: true, user: user, message: "Successfully fetched user!" };
		} else {
			return { success: false, user: undefined, message: "Something unexpected occurred!" };
		}
	} catch (err) {
		return { user: undefined, ...error_handler(err) };
	}
};

export const fetch_events_init = async (): Promise<{
	success: boolean;
	message: string;
	orgs: Array<Organization>;
	events: Array<EventCreate>;
	tix: Array<TicketType>;
}> => {
	try {
		const response = await api.get("/events_fetch_init");

		const { status } = response;
		const { orgs, tix } = response.data;
		let { events } = response.data;

		if (status === 200 && orgs && tix && events) {
			events = events.map((event: any) => {
				const { banner, search_image } = event;

				return {
					...event,
					banner: banner ?? DefaultImage,
					search_image: search_image ?? DefaultImage,
				};
			});

			return { success: true, message: "Successfully fetched events!", events: events, orgs: orgs, tix: tix };
		} else {
			return { success: false, message: "Something unexpected occurred!", events: [], orgs: [], tix: [] };
		}
	} catch (err) {
		return { events: [], orgs: [], tix: [], ...error_handler(err) };
	}
};

export const search_events = async (
	filters: FilterObject
): Promise<{
	success: boolean;
	message: string;
	orgs: Array<Organization>;
	events: Array<EventCreate>;
	tix: Array<TicketType>;
}> => {
	try {
		const response = await api.post("/events_search_all", {
			query: filters,
		});

		const { status } = response;
		const { orgs, tix } = response.data;
		let { events } = response.data;

		if (status === 200 && orgs && tix && events) {
			events = events.map((event: any) => {
				const { banner, search_image } = event;

				return {
					...event,
					banner: banner ?? DefaultImage,
					search_image: search_image ?? DefaultImage,
				};
			});

			return { success: true, message: "Successfully fetched events!", events: events, orgs: orgs, tix: tix };
		} else {
			return { success: false, message: "Something unexpected occurred!", events: [], orgs: [], tix: [] };
		}
	} catch (err) {
		return { events: [], orgs: [], tix: [], ...error_handler(err) };
	}
};
