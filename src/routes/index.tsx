import { Routes, Route } from "react-router-dom";

import About from "pages/about/about";
import AccountRoutes from "routes/account";
import Contact from "pages/contact/contact";
import EventRoutes from "routes/events";
import Home from "pages/home";
import NotFound from "components/error_displays/404_not_found";

const Router = () => {
	return (
		<div className={"mt-[120px] md:mt-[80px]"}>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/account/*" element={<AccountRoutes />} />
				<Route path="/about" element={<About />} />
				<Route path="/contact" element={<Contact />} />
				<Route path="/event/*" element={<EventRoutes />} />
				<Route path="*" element={<NotFound />} />
			</Routes>
		</div>
	);
};

export default Router;
