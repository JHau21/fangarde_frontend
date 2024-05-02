import React from "react";
import styles from "./create_event_done.module.css";

import ShieldLogo from "../../../../../../../../../common/icons/shield_logo.svg";
import SmallButton from "../../../../../../../../../components/small_button/small_button";
import { useNavigate } from "react-router-dom";

const CreateEventDone = () => {
	const navigate = useNavigate();
	return (
		<div className="common_root">
			<div className={styles.column}>
				<h1 className="common_bold">
					Your event was created succesfully!
				</h1>
				<p></p>
				<img
					className={styles.shieldLogo}
					src={ShieldLogo}
					alt={"Shield Logo with Checkmark"}
				/>
				<div className={styles.buttonRow}>
					{/* In the future this should link to the public event page */}
					<SmallButton
						onClick={() =>
							navigate("/account/upcoming_events")
						}
					>
						View Event
					</SmallButton>
					{/* This should link to the event in the dashboard*/}
					<SmallButton onClick={() => navigate("/account/info")}>
						Dashboard
					</SmallButton>
				</div>
			</div>
		</div>
	);
};

export default CreateEventDone;
