import { useNavigate } from "react-router-dom";

import SmallButton from "components/small_button/small_button";
import { use_accounting } from "state/admin/accounting";
import { useUser } from "state/useUser";
import { remove_current_jwt } from "utils/user";

import styles from "pages/account/admin/components/admin_menu/admin_menu.module.css";

import { AdminItemProps, MenuNameItem } from "./types";

const AdminMenu = () => {
	const { user, reset_user } = useUser((state) => ({
		reset_user: state.reset,
		user: state.user,
	}));
	const reset_accounting = use_accounting((state) => state.reset);

	const navigate = useNavigate();
	const path_name = window.location.pathname;

	function logout() {
		reset_user();
		remove_current_jwt();
		reset_accounting();
		navigate("/account/login");
		window.location.reload();
		window.scrollTo(0, 0);
	}

	function UserRoleAdminItems() {
		if (!user.role) return null;

		const admin_items: Array<MenuNameItem> = [
			{ name: "Organization", url: "/account/organization" },
			{ name: "Finance", url: "/account/finance" },
			{ name: "Events", url: "/account/events_hub" },
			{ name: "Create Event", url: "/account/create_event" },
			{ name: "Past Events", url: "/account/past_events" },
			{ name: "Upcoming Events", url: "/account/upcoming_events" },
			{ name: "Point of Sale", url: "/account/point_of_sale" },
			{ name: "Promotions", url: "/account/promotions_hub" },
			{ name: "Analytics", url: "/account/analytics_hub" },
			{ name: "Administration", url: "/account/administration_hub" },
		];

		const items: Array<JSX.Element> = admin_items.map((item) => {
			const item_name: string = item.name.replaceAll(" ", "_").toLowerCase();

			return (
				<AdminItem
					active={path_name.includes(item_name)}
					key={item.name}
					name={item.name}
					onClick={() => navigate(item.url)}
				/>
			);
		});

		return <>{items}</>;
	}

	return (
		<div className={"flex w-[294px] flex-col items-center rounded-md border-2 border-medium-blue p-[15px]"}>
			<AdminItem active={path_name.includes("info")} name="Account" onClick={() => navigate("/account/info")} />
			<UserRoleAdminItems />
			<AdminItem active={false} name="Help" onClick={() => navigate("/contact")} />
			<div className={styles.button}>
				<SmallButton onClick={logout}>Logout</SmallButton>
			</div>
		</div>
	);
};

const default_style: string =
	"text-black text-regular text-center font-bold decoration-none hover:cursor-pointer hover:bg-fangarde-light-gray hover:rounded-md hover:text-black h-[30px] w-full pt-[4px] mb-[40px]";
const active_style: string =
	"text-white text-regular font-bold decoration-none text-center bg-medium-blue rounded h-[30px] w-full pt-[4px] mb-[40px]";

const AdminItem = ({ name, onClick, active }: AdminItemProps) => {
	return (
		<div className={active ? active_style : default_style} onClick={onClick}>
			<p className={styles.name}>{name}</p>
		</div>
	);
};

export default AdminMenu;
