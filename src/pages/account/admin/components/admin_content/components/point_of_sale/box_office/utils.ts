import { api } from "axiosClients/client";

import { error_handler } from "utils/api_error_handles";

import { CardRequest, CashOrFreeRequest } from "./types";

export const capture_payment_intent = async (
	payment_intent_id: string,
	terminal_id: string
): Promise<{ success: boolean; message: string }> => {
	try {
		await api.post("/capture_payment_intent", { payment_intent_id, terminal_id });

		return {
			success: true,
			message: "Successfully created payment intent!",
		};
	} catch (err) {
		return error_handler(err);
	}
};

export const create_payment_intent = async (
	selected_tickets: Array<SelectedTicket>,
	stripe_conn_id: string
): Promise<{ success: boolean; message: string; pii: string | undefined }> => {
	try {
		const response = await api.post("/create_payment_intent", { order: selected_tickets, stripe_conn_id });

		const { payment_intent_id } = response.data;

		if (payment_intent_id) {
			return {
				success: true,
				message: "Successfully created payment intent!",
				pii: payment_intent_id,
			};
		} else {
			return {
				success: false,
				message: "Something unexpected occurred!",
				pii: undefined,
			};
		}
	} catch (err) {
		return { ...error_handler(err), pii: undefined };
	}
};

export const fetch_events = async (
	org_id: string
): Promise<{
	success: boolean;
	message: string;
	updated_all_events: Array<EventCreate> | undefined;
}> => {
	try {
		const response = await api.post("/fetch_pos_events", { org_id: org_id });

		const { events } = response.data;

		if (events && events.length) {
			const updated_all_events: Array<EventCreate> = events;

			return {
				success: true,
				message: "Successfully fetched some events!",
				updated_all_events: updated_all_events,
			};
		} else {
			return {
				success: false,
				message: "No events found!",
				updated_all_events: undefined,
			};
		}
	} catch (err) {
		return { ...error_handler(err), updated_all_events: undefined };
	}
};

export const filter_selected_tickets = (all_events: Array<EventCreate>, selected_event_idx: number): Array<SelectedTicket> => {
	const default_selected_tickets: Array<SelectedTicket> | undefined = all_events[selected_event_idx].ticket_types?.reduce(
		(selected_tickets: Array<SelectedTicket>, ticket_type: TicketType) => {
			const sold: Array<{ ticket_tier: TicketTier; quantity: number }> = ticket_type.ticket_tiers.map(
				(ticket_tier: TicketTier) => {
					return {
						ticket_tier: ticket_tier,
						quantity: 0,
					};
				}
			);

			selected_tickets.push({
				ticket_type: ticket_type,
				sold: sold,
			});

			return selected_tickets;
		},
		[]
	);

	return default_selected_tickets;
};

export const generate_pdf = (data: Blob) => {
	const url = URL.createObjectURL(data);

	window.open(url);
};

export const process_payment_intent = async (
	terminal_id: string,
	payment_intent_id: string
): Promise<{ success: boolean; message: string }> => {
	try {
		await api.post("/process_payment_intent", { payment_intent_id, terminal_id });

		return {
			success: true,
			message: "Successfully handed off payment intent!",
		};
	} catch (err) {
		return error_handler(err);
	}
};

export const store_order = async (
	params: CashOrFreeRequest | CardRequest
): Promise<{ success: boolean; message: string; pdf_data: any | undefined }> => {
	try {
		const response = await api({
			url: "/box_office_sale",
			method: "POST",
			responseType: "blob",
			data: params,
		});

		const { data } = response;

		if (data) {
			return {
				success: true,
				message: "Successfully purchased tickets!",
				pdf_data: data,
			};
		} else {
			return {
				success: false,
				message: "Something unexpected occurred!",
				pdf_data: undefined,
			};
		}
	} catch (err) {
		return { ...error_handler(err), pdf_data: undefined };
	}
};
