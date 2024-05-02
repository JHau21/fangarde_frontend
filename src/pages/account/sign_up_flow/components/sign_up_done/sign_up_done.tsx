import React from "react";
import styles from "./sign_up_done.module.css";

import ShieldLogo from "../../../../../common/icons/shield_logo.svg";
import SmallButton from "../../../../../components/small_button/small_button";
import { useNavigate } from "react-router-dom";

const SignUpDone = () => {
	const navigate = useNavigate();
	return (
		<div className="common_root">
			<div className={styles.column}>
				<h1 className="common_bold">
					You’re all set! Thanks for signing up.
				</h1>
				<p>
					You can navigate to your dashboard using the button
					below. Need to change anything? Hit the back button
					below!
				</p>
				<img
					className={styles.shieldLogo}
					src={ShieldLogo}
					alt={"Shield Logo with Checkmark"}
				/>
				<div className={styles.buttonRow}>
					<SmallButton onClick={() => navigate("/account/info")}>
						Dashboard
					</SmallButton>
				</div>
			</div>
		</div>
	);
};

export default SignUpDone;
