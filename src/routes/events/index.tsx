import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Billing from "pages/events/billing";
import ErrorCode404 from "components/error_displays/404_not_found";
import EventOverview from "pages/events/event_overview";
import Events from "pages/events";
import Confirmation from "pages/events/confirmation";
import Tickets from "pages/events/tickets";

const EventRoutes = () => {
	const [loading, set_loading] = useState<boolean>(false);

	return (
		<Routes>
			<Route path="/" element={<Events loading={loading} set_loading={set_loading} />}>
				<Route
					path="/"
					element={
						<ErrorCode404
							message={
								"Oops! It looks like you're trying to purchase tickets for an event but forgot to place the event ID into your URL!"
							}
						/>
					}
				/>
				<Route path=":id" element={<EventOverview />} />
				<Route path="billing_info" element={<Billing loading={loading} set_loading={set_loading} />} />
				<Route path="buy_tickets" element={<Tickets />} />
				<Route path="confirmation" element={<Confirmation />} />
				<Route path="/*" element={<ErrorCode404 />} />
			</Route>
		</Routes>
	);
};

export default EventRoutes;
