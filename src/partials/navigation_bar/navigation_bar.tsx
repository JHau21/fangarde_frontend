import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import CommonBarSmall from "components/bars/common_bar_small";

import { use_ticket_order } from "state/events/use_ticket_order";

import { get_current_jwt } from "utils/user";

import color_palette from "common/types/colors";

import WhiteFangardeLogo from "common/logos/white_fangarde_logo.svg";

export default function Navbar() {
	const [current_url, set_current_url] = useState<string>("");

	let location = useLocation();
	const navigate = useNavigate();

	const { selected_event } = use_ticket_order();

	const href = window.location.href;
	const is_logged_in = !!get_current_jwt();

	const nav_bar_items = [
		{ url: "/", name: "Events", show: true },
		{ url: "/contact", name: "Contact", show: true },
		{ url: "/about", name: "About", show: true },
		{ url: "/account", name: "Account", show: is_logged_in },
		{ url: "/account", name: "Sign In", show: !is_logged_in },
	];

	const default_style: string =
		"text-black text-regular text-center font-bold decoration-none hover:cursor-pointer hover:bg-fangarde-light-gray hover:rounded-md hover:text-black h-[30px] w-[80px] pt-[4px]";
	const active_style: string =
		"text-white text-regular font-bold decoration-none text-center bg-medium-blue rounded h-[30px] w-[80px] pt-[4px]";

	useEffect(() => {
		nav_bar_items.forEach((item) => {
			if (location.pathname.includes(item.url)) {
				set_current_url(item.url);
			}
		});
		// eslint-disable-next-line
	}, [location]);

	function NavBar() {
		const items = nav_bar_items.map((item) => {
			if (!item.show) return null;

			return (
				<Link
					className={current_url === item.url ? active_style : default_style}
					key={item.url}
					to={item.url}
					onClick={() => set_current_url(item.url)}
				>
					{item.name}
				</Link>
			);
		});

		return (
			<div className="flex w-full flex-col items-center justify-center md:flex-row md:justify-between">
				<img
					className={
						"h-[57px] rounded-lg bg-gradient-to-t from-dark-blue to-light-blue px-[10px] py-[10px] hover:cursor-pointer"
					}
					src={WhiteFangardeLogo}
					alt="Fangarde Logo"
					onClick={() => navigate("/")}
				/>
				{window.innerWidth > 768 && (
					<CommonBarSmall className={"mx-10 h-[3px] w-[70px] rotate-90 border-0"} color={color_palette.medium_blue} />
				)}
				<div className="flex w-full items-center justify-around md:relative">{items}</div>
			</div>
		);
	}

	if (selected_event?.color_scheme && href.includes("/event")) {
		return null;
	}

	return (
		<nav className="md:pb-o fixed left-0 top-0 z-50 flex w-full flex-row items-center justify-between bg-gradient-to-b from-fangarde-light-gray to-white px-[10%] pb-[15px] pt-[10px] text-base font-semibold">
			<NavBar />
		</nav>
	);
}
