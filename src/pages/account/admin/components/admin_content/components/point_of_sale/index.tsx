import { Outlet } from "react-router-dom";

import HorizontalMenu from "components/horizontal_menu";

import { common_admin_root } from "common/styles/admin";

const PointOfSale = () => {
	const elements: Array<MenuElement> = [
		{ title: "Box Office", route: "/account/point_of_sale/box_office" },
		{ title: "Card Readers", route: "/account/point_of_sale/card_readers" },
	];

	return (
		<div className={common_admin_root}>
			<HorizontalMenu elements={elements} />
			<Outlet />
		</div>
	);
};

export default PointOfSale;
