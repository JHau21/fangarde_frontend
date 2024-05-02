import React from "react";
import styles from "./sign_up_error.module.css";

import ShieldLogo from "../../../../../common/icons/shield_logo.svg";
import SmallButton from "../../../../../components/small_button/small_button";
import { useNavigate } from "react-router-dom";

const SignUpError = () => {
	const navigate = useNavigate();
	return (
		<div className="common_root">
			<div className={styles.column}>
				<h1 className="common_bold">Something went wrong!</h1>
				<p>
					Please try again later or shoot us an email at
					contact@fangarde.com! Our contact page is below!
				</p>
				<img
					className={styles.shieldLogo}
					src={ShieldLogo}
					alt={"Shield Logo with Checkmark"}
				/>
				<div className={styles.buttonRow}>
					<SmallButton onClick={() => navigate("/contact")}>
						Contact
					</SmallButton>
				</div>
			</div>
		</div>
	);
};

export default SignUpError;
