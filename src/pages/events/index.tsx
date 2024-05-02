import React, { useState, useEffect } from "react";
import { Outlet, useParams, useLocation } from "react-router-dom";

import ErrorCode404 from "components/error_displays/404_not_found";
import Loader from "partials/loader/loader";

import { use_ticket_order } from "state/events/use_ticket_order";
import { use_home } from "state/events/use_home";

import { fetch_event, route_handler } from "./utils";

import color_palette from "common/types/colors";

import { EventComponentProps } from "./types";

const Events: React.FC<EventComponentProps> = ({ loading, set_loading }) => {
	let { id } = useParams();
	const location = useLocation();

	const state = use_ticket_order();
	const { searched_events, searched_organizations, searched_tickets } = use_home();
	const { set_selected_event, set_selected_organization, set_ticket_options } = state;

	const [page_error, set_page_error] = useState<string | undefined>(undefined);

	const handle_routing_and_state = async () => {
		set_loading(true);

		if (page_error) set_page_error(undefined);

		const url: string = location.pathname;

		if (id && url === `/event/${id}`) {
			const { event, tix, org } = await set_event(id);

			if (!event || !org || !tix) {
				set_page_error(
					`Oops! It looks like this link in not longer active or the event doesn't exist for event ID '${id}'!`
				);
			}
		} else {
			const { new_page_error } = await route_handler(state, url);

			set_page_error(new_page_error);
		}

		set_loading(false);
	};

	const set_event = async (id: string) => {
		const event: EventCreate = searched_events.filter((event) => event._id === id)[0];

		if (event) {
			const org: Organization = searched_organizations.filter((organization) => organization._id === event.organization_id)[0];
			const tix: Array<TicketType> = searched_tickets.filter((ticket) => ticket.event_id === event._id);

			set_ticket_options(tix);
			set_selected_event(event);
			set_selected_organization(org);

			return { event, tix, org };
		} else {
			const { success, message, event, org, tix } = await fetch_event(id);

			set_selected_event(event);
			set_ticket_options(tix);
			set_selected_organization(org);

			if (!success) console.error(message);

			return { event, tix, org };
		}
	};

	useEffect(() => {
		handle_routing_and_state();
	}, []);

	if (!page_error) {
		return (
			<div className={"font-custom text-regular font-medium text-fangarde-black"} style={{ color: color_palette.black }}>
				{loading && (
					<Loader className={"absolute left-0 top-0 z-10 flex h-full w-full items-center justify-center bg-white"} />
				)}
				<Outlet />
			</div>
		);
	} else if (!loading && page_error) return <ErrorCode404 message={page_error} />;
	else return null;
};

export default Events;
