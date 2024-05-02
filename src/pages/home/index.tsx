import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import EventList from "./event_list";
import Filter from "./filter";
import Loader from "partials/loader/loader";

import { use_home, UseHomeState } from "state/events/use_home";
import { useUser, UseUserState } from "state/useUser";

import { get_current_jwt } from "utils/user";
import { fetch_events_init, fetch_user_account_data, search_events } from "./utils";

import color_palette from "common/types/colors";

import { FilterObject } from "./types";
import { FormValues } from "./filter/types";

const Home = () => {
	const [loading, set_loading] = useState<boolean>(true);

	const { events, set_events_state } = use_home((state: UseHomeState) => ({
		events: state.searched_events,
		set_events_state: state.set_all_events_data,
	}));

	const setUser = useUser((state: UseUserState) => state.setUser);

	const navigate = useNavigate();

	const event_selected = (id: string) => {
		navigate(`/event/${id}`);
	};

	const init_user = async () => {
		const token = await get_current_jwt();

		if (token) {
			const user_fetch = await fetch_user_account_data();

			const { success, user, message } = user_fetch;

			if (success) {
				setUser(user);
			} else {
				console.error(message);
			}
		}
	};

	const init_events = async () => {
		set_loading(true);

		const event_fetch = await fetch_events_init();

		const { success, events, orgs, tix, message } = event_fetch;

		if (success) {
			set_events_state(events, orgs, tix);
		} else {
			set_events_state(events, orgs, tix);

			console.error(message);
		}

		set_loading(false);
	};

	const run_query = async ({ name, location, genre }: FormValues) => {
		set_loading(true);

		let filters: FilterObject = {
			name: name,
			location: location,
			genre: genre === "None" ? "" : genre,
		};

		const search_results = await search_events(filters);

		const { success, events, orgs, tix, message } = search_results;

		if (success) {
			set_events_state(events, orgs, tix);
		} else {
			set_events_state(events, orgs, tix);

			console.error(message);
		}

		set_loading(false);
	};

	useEffect(() => {
		init_user();
		init_events();
	}, []);

	return (
		<div className="w-full space-y-8 px-4 md:px-40" style={{ color: color_palette.black }}>
			<Filter onSubmit={({ name, location, genre }: FormValues) => run_query({ name, location, genre })} />
			<h2 className="w-full text-left font-custom text-md-header font-bold" style={{ color: color_palette.black }}>
				Events
			</h2>
			{loading ? <Loader /> : <EventList events={events} onClick={(id: string) => event_selected(id)} />}
		</div>
	);
};

export default Home;
