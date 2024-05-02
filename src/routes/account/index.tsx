import { Navigate, Route, Routes } from "react-router-dom";

import { MenuItem } from "common";
import Admin from "pages/account/admin/admin";
import AdminContent from "pages/account/admin/components/admin_content/admin_content";
import AdministrationHub from "pages/account/admin/components/admin_content/components/administration";
import AnalyticsHub from "pages/account/admin/components/admin_content/components/analytics";
import Banking from "pages/account/admin/components/admin_content/components/finance/banking_page/banking";
import Books from "pages/account/admin/components/admin_content/components/finance/books_page/books";
import BoxOffice from "pages/account/admin/components/admin_content/components/point_of_sale/box_office";
import CreateEvent from "pages/account/admin/components/admin_content/components/create_event/create_event";
import EventDetails from "pages/account/admin/components/admin_content/components/upcoming_events/event_details/event_details";
import EventsHub from "pages/account/admin/components/admin_content/components/events";
import FinancialHub from "pages/account/admin/components/admin_content/components/finance";
import Login from "pages/account/login/login";
import PastEvents from "pages/account/admin/components/admin_content/components/past_events/past_events";
import PastEventDetails from "pages/account/admin/components/admin_content/components/past_events/past_event_details/past_event_details";
import PointOfSale from "pages/account/admin/components/admin_content/components/point_of_sale";
import PromotionsHub from "pages/account/admin/components/admin_content/components/promotions";
import SignUpInit from "pages/account/sign_up_flow/sign_up_flow";
import CardReaders from "pages/account/admin/components/admin_content/components/point_of_sale/terminals";
import UpcomingEvents from "pages/account/admin/components/admin_content/components/upcoming_events/upcoming_events";
import NotFound from "components/error_displays/404_not_found";

const AccountRoutes = () => {
	return (
		<Routes>
			<Route path="create_event" element={<CreateEvent />} />
			<Route path="login" element={<Login />} />
			<Route path="sign_up" element={<SignUpInit />} />
			<Route path="*" element={<NotFound />} />
			<Route path="/" element={<Admin />}>
				<Route index element={<Navigate to="/account/info" />} />
				<Route path="info" element={<AdminContent menuItem={MenuItem.account} />} />
				<Route path="organization" element={<AdminContent menuItem={MenuItem.organization} />} />
				<Route path="finance" element={<FinancialHub />}>
					<Route index element={<Navigate to="/account/finance/books" />} />
					<Route path="books" element={<Books />} />
					<Route path="banking" element={<Banking />} />
				</Route>
				<Route path="/events_hub" element={<EventsHub />} />
				<Route path="past_events" element={<AdminContent menuItem={MenuItem.pastEvents} />}>
					<Route path="" element={<PastEvents />} />
					<Route path="*" element={<PastEventDetails />} />
				</Route>
				<Route path="upcoming_events" element={<AdminContent menuItem={MenuItem.upcomingEvents} />}>
					<Route path="" element={<UpcomingEvents />} />
					<Route path="*" element={<EventDetails />} />
				</Route>
				<Route path="point_of_sale" element={<PointOfSale />}>
					<Route index element={<Navigate to="/account/point_of_sale/box_office" />} />
					<Route path="box_office" element={<BoxOffice />} />
					<Route path="card_readers" element={<CardReaders />} />
				</Route>
				<Route path="point_of_sale" element={<AdminContent menuItem={MenuItem.point_of_sale} />} />
				<Route path="/promotions_hub" element={<PromotionsHub />} />
				<Route path="/analytics_hub" element={<AnalyticsHub />} />
				<Route path="/administration_hub" element={<AdministrationHub />} />
				<Route path="event_details" element={<EventDetails />} />
			</Route>
		</Routes>
	);
};

export default AccountRoutes;
