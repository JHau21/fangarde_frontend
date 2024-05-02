import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import { api } from "axiosClients/client";
import AdminHeader from "pages/account/admin/components/admin_header/admin_header";
import AdminMenu from "pages/account/admin/components/admin_menu/admin_menu";
import { useUser } from "state/useUser";
import { use_accounting } from "state/admin/accounting";
import { get_current_jwt } from "utils/user";

import styles from "./admin.module.css";

const Admin = () => {
	const user_organization = useUser((state) => state.userOrganization);
	const bank_accounts = use_accounting((state) => state.bank_accounts);

	const [paid_events_warning, set_paid_events_warning] = useState<string>("");
	let location = useLocation();

	const token = get_current_jwt();

	useEffect(() => {
		if (user_organization?.stripe_conn_id) {
			api.post("/retrieve_stripe_bank_accounts", {
				acc_id: user_organization.stripe_conn_id,
			})
				.then((res: any) => {
					if (res.error) {
						console.log(res.error);
					} else {
						if (res.data.payload.bank_accounts.length === 0) {
							set_paid_events_warning(
								"You don't currently have a bank account set up to recieve payments! Please set one up in the accounting page before creating any paid events."
							);
						} else {
							if (paid_events_warning !== "") {
								set_paid_events_warning("");
							}
						}
					}
				})
				.catch((err: any) => {
					console.log(err);
				});
		} else if (Object.keys(user_organization).length !== 0) {
			set_paid_events_warning(
				"You are not currently registered to create paid events. If you'd like to register for paid events, please contact us!"
			);
		}
	}, [bank_accounts]);

	if (!token) {
		return <Navigate to="/account/login" state={{ from: location }} replace />;
	}

	return (
		<div>
			<AdminHeader image={user_organization ? (user_organization?.banner ? user_organization.banner : "") : ""} />
			{paid_events_warning !== "" && (
				<div className={styles.paid_events_warning}>
					<h3 className={styles.header_and_text}>Warning:</h3>
					<p className={styles.header_and_text}>{paid_events_warning}</p>
				</div>
			)}
			<div className={"mt-[70px] flex w-full flex-row items-start px-[70px]"}>
				<div className={"mr-[80px]"}>
					<AdminMenu />
				</div>
				<div className={"w-full"}>
					<Outlet />
				</div>
			</div>
		</div>
	);
};

export default Admin;
