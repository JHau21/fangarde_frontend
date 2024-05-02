import { useEffect, useState } from "react";
import { LoadScript } from "@react-google-maps/api";

import "App.css";
import { api } from "axiosClients/client";
import { useUser } from "state/useUser";
import Footer from "partials/footer/footer";
import Loader from "partials/loader/loader";
import Navbar from "partials/navigation_bar/navigation_bar";
import Routes from "routes/index";
import { get_current_jwt, remove_current_jwt } from "utils/user";
import { use_accounting } from "state/admin/accounting";
import { use_stripe } from "state/use_stripe";

function App() {
	const create_stripe_instance = use_stripe((state) => state.create_stripe_instance);
	const reset = useUser((state) => state.reset);
	const reset_accounting = use_accounting((state) => state.reset);
	const setUserOrganization = useUser((state) => state.setUserOrganization);
	const setUser = useUser((state) => state.setUser);
	const [loading, set_loading] = useState<boolean>(false);

	const fetch_user_account_data = async () => {
		api.post("/fetch_account")
			.then((res) => {
				const data = res.data;

				if (data) {
					set_loading(false);
					if (data.organization) {
						setUserOrganization(data.organization);
					}
					return setUser(data.user);
				} else {
					set_loading(false);
					reset();
					reset_accounting();
					remove_current_jwt();
					window.scrollTo(0, 0);
				}
			})
			.catch((err) => {
				set_loading(false);
				reset();
				reset_accounting();
				remove_current_jwt();
				window.scrollTo(0, 0);
			});
	};

	useEffect(() => {
		window.scrollTo(0, 0);

		const token = get_current_jwt();

		if (token) {
			set_loading(true);
			fetch_user_account_data();
		}

		create_stripe_instance();
	}, []);

	return (
		<div className="flex h-full flex-col justify-between font-custom md:min-h-[700px]">
			<LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_API_KEY}>
				<Navbar />
				{loading ? (
					<Loader className="z-50 flex h-[800px] w-full flex-col items-center justify-center bg-white" />
				) : (
					<Routes />
				)}
			</LoadScript>
			<Footer />
		</div>
	);
}

export default App;
