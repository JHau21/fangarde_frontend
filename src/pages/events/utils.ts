import { api } from "../../axiosClients/client";

import { error_handler } from "utils/api_error_handles";
import { cart_empty } from "utils/common_methods";

import { UseTicketOrderState } from "state/events/use_ticket_order";

import DefaultImage from "common/images/default_concert_stage_image3.png";

export const fetch_event = async (
	id: string
): Promise<{
	success: boolean;
	message: string;
	event: EventCreate | undefined;
	org: Organization | undefined;
	tix: Array<TicketType> | undefined;
}> => {
	try {
		const response = await api.post(`/fetch_single_event`, {
			event_id: id,
		});

		let { org, tix, event } = response.data;

		if (event && org && tix) {
			const { banner, search_image } = event;

			event.banner = banner ?? DefaultImage;
			event.search_image = search_image ?? DefaultImage;

			return { success: true, message: "Successfully fetched event.", event: event, org: org, tix: tix };
		} else {
			return { success: false, message: "Something unexpected happened!", event: undefined, org: undefined, tix: undefined };
		}
	} catch (err) {
		return { ...error_handler(err), event: undefined, org: undefined, tix: undefined };
	}
};

export const route_handler = (state: UseTicketOrderState, url: string): { new_page_error: string | undefined } => {
	switch (url) {
		case "/event/buy_tickets": {
			if (!state.selected_event || !state.selected_organization || !state.ticket_options || !state.ticket_options.length) {
				return {
					new_page_error: "Oops! Either you haven't selected an event or the event you selected has invalid data!",
				};
			}

			return {
				new_page_error: undefined,
			};
		}
		case "/event/billing_info": {
			if (
				!state.selected_event ||
				!state.selected_organization ||
				!state.ticket_options ||
				!state.ticket_options.length ||
				!state.selected_tickets ||
				cart_empty(state.selected_tickets)
			) {
				return {
					new_page_error: "Oops! The event and/or tickets you selected has/have invalid data!",
				};
			}

			return {
				new_page_error: undefined,
			};
		}
		case "/event/confirmation": {
			if (true) {
				return {
					new_page_error: "Oops! The billing information you inputted has invalid data!",
				};
			}

			return {
				new_page_error: undefined,
			};
		}
		default: {
			return {
				new_page_error: undefined,
			};
		}
	}
};
