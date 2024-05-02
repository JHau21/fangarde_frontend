import React from "react";
import styles from "./create_event_error.module.css";

import ShieldLogo from "../../../../../../../../../common/icons/shield_logo.svg";
import SmallButton from "../../../../../../../../../components/small_button/small_button";
import { useNavigate } from "react-router-dom";

interface CreateEventErrorProps {
	onBack: Function;
}

const CreateEventError = ({ onBack }: CreateEventErrorProps) => {
	const navigate = useNavigate();
	return (
		<div className="common_root">
			<div className={styles.column}>
				<h1 className="common_bold">Something went wrong!</h1>
				<p>
					Please try again later or shoot us an email at
					contact@fangarde.com! Our contact page is{" "}
					<a className={styles.contactLink} href={"/contact"}>
						here
					</a>
					!
				</p>
				<img
					className={styles.shieldLogo}
					src={ShieldLogo}
					alt={"Shield Logo with Checkmark"}
				/>
				<div className={styles.buttonRow}>
					<SmallButton onClick={() => onBack()}>
						Back
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

export default CreateEventError;
