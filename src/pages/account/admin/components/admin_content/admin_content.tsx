import Account from "./components/account/account";
import Organization from "./components/organization/organization";
import CreateEvent from "./components/create_event/create_event";
import UpcomingEventsRoot from "./components/upcoming_events/upcoming_events_root/upcoming_events_root";
import PastEventsRoot from "./components/past_events/past_event_root/past_event_root";
import { AccountingItem, MenuItem } from "../../../../../common";
import PointOfSale from "./components/point_of_sale";

interface AdminParams {
	menuItem: MenuItem | AccountingItem;
}

const AdminContent = ({ menuItem }: AdminParams) => {
	const renderPage = (menuItem: MenuItem | AccountingItem) => {
		switch (menuItem) {
			case MenuItem.account:
				return (
					<div>
						<Account />
					</div>
				);
			case MenuItem.organization:
				return (
					<div>
						<Organization />
					</div>
				);
			case MenuItem.pastEvents:
				return (
					<div>
						<PastEventsRoot />
					</div>
				);
			case MenuItem.upcomingEvents:
				return (
					<div>
						<UpcomingEventsRoot />
					</div>
				);
			case MenuItem.createEvent:
				return (
					<div>
						<CreateEvent />
					</div>
				);
			case MenuItem.point_of_sale:
				return (
					<div>
						<PointOfSale />
					</div>
				);
			default:
				return <div></div>;
		}
	};

	return renderPage(menuItem);
};

export default AdminContent;
