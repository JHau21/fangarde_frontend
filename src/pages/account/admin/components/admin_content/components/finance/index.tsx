import { Outlet } from "react-router-dom";

import HorizontalMenu from "components/horizontal_menu";

import { common_admin_root } from "common/styles/admin";

const FinancialHub = () => {
	const elements: Array<MenuElement> = [
		{ title: "Books", route: "/account/finance/books" },
		{ title: "Banking", route: "/account/finance/banking" },
	];

	return (
		<div className={common_admin_root}>
			<HorizontalMenu elements={elements} />
			<Outlet />
		</div>
	);
};

export default FinancialHub;
