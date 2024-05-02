import { useState } from "react";
import { useNavigate } from "react-router-dom";

import CheckBox from "components/check_box";
import SmallButton from "components/small_button/small_button";

import { SignUpStep } from "common";
import color_palette from "common/types/colors";
import { use_sign_up } from "state/use_sign_up";

import styles from "./sign_up_disclaimer.module.css";
import common from "common/css/common.module.css";
import ErrorMessage from "components/error_message";

// author: Jack Hau

type Props = {
	newOrganization: OrganizationSignUp;
	setNewOrganization: Function;
};

const SignUpDisclaimer = () => {
	const { new_organization, set_new_organization, set_sign_up_step } = use_sign_up((state) => ({
		new_organization: state.new_organization,
		set_new_organization: state.set_new_organization,
		set_sign_up_step: state.set_sign_up_step,
	}));

	const [warn_ip, set_warn_ip] = useState<boolean>(false);
	const [acc_tc, set_acc_tc] = useState<boolean>(false);
	const [ip_consent, set_ip_consent] = useState<boolean>(false);
	let navigate = useNavigate();

	// placed error handling stuff into a function to readability
	const all_fields_entered = () => {
		return ip_consent && acc_tc;
	};

	const set_tos_value = async () => {
		let tos_acceptance: {
			date: number;
			ip: string;
			user_agent: string | undefined;
		} = {
			date: Date.now(),
			ip: "",
			user_agent: undefined,
		};

		// good enough for now but eventually need to organize how we call our endpoints
		fetch(`https://geolocation-db.com/json/${process.env.REACT_APP_DB_LOCATION}`)
			.then((res) => res.json())
			.then((res) => (tos_acceptance.ip = res.IPv4))
			.catch((err) => console.log(err));

		set_new_organization({
			...new_organization,
			tos_acceptance: {
				...tos_acceptance,
			},
		});

		set_sign_up_step(SignUpStep.SignUpOrgLocation);
	};

	return (
		<div className={"mx-80 my-10 flex flex-col items-center text-left font-custom text-regular font-normal text-fangarde-black"}>
			<h1 className={"my-[10px] text-lg-header"}>For your financial security.</h1>
			<h2 className={"my-[10px] text-md-header"}>READ THIS BEFORE CONTINUING</h2>
			<div className={styles.text_section}>
				<p className="my-[10px]">
					You have told us that you will be hosting paid events. As such, the following information is relevant.
				</p>
				<p className="my-[10px]">
					To handle multiparty payments and your financial information, we’ve partnered with Stripe. As such, we DO NOT
					store any of your financial, personal, or sensitive information. Instead, we securely collect and pass your
					information to Stripe for verification.
				</p>
				<p className="my-[10px]">
					Given our partnership, we are required to collect some personal and sensitive information from you, as an
					individual, to verify your identity, as well additionally listed information about your organization. You are
					also required to accept Stripe’s Service Agreement, linked below. Please note that the following information may
					not necessarily be required from you but is certainly required for some organization and is, as such, listed
					below.{" "}
				</p>
				<p className="my-[10px]">The information we MIGHT need from you:</p>
				<ul className="my-[10px] ml-6 list-disc">
					<li className={"my-1"}>ID (state issued driver’s license)</li>
					<li className={"my-1"}>SSN</li>
					<li className={"my-1"}>Date of birth</li>
					<li className={"my-1"}>Home address</li>
				</ul>
				<p className="my-[10px]">The information we MIGHT need about your organization:</p>
				<ul className="my-[10px] ml-6 list-disc">
					<li className={"my-1"}>The type of your organization (e.g. company, non-profit, government org, etc...)</li>
					<li className={"my-1"}>
						The structure of your organization (e.g. sole proprietorship, multi-member LLC, etc...)
					</li>
					<li className={"my-1"}>EIN/FEIN</li>
					<li className={"my-1"}>Headquarters address</li>
					<li className={"my-1"}>Website URL</li>
				</ul>
				<p className="my-[10px]">
					For more information about Stripe, go to{" "}
					<span
						className={`${styles.tos_text} ${common.common_bold}`}
						style={{ color: color_palette.dark_blue }}
						onClick={() => window.open("https://stripe.com/")}
					>
						stripe.com
					</span>
					. If you have any questions about this,{" "}
					<span
						className={`${styles.tos_text} ${common.common_bold}`}
						style={{ color: color_palette.dark_blue }}
						onClick={() => navigate("/contact")}
					>
						reach out to us.
					</span>
				</p>
			</div>
			<div className={styles.radio_section_option}>
				<CheckBox
					checked={ip_consent}
					label={
						<p className="common_bold">
							I consent to the collection of my public IP address to verify my acceptance of Stripe's{" "}
							<span
								className={styles.tos_text}
								style={{ color: color_palette.dark_blue }}
								onClick={() => window.open("https://stripe.com/legal/connect-account")}
							>
								Service Agreement.
							</span>
						</p>
					}
					onClick={() => {
						set_ip_consent(!ip_consent);
						set_warn_ip(false);

						if (acc_tc) {
							set_acc_tc(false);
						}
					}}
				/>
			</div>
			<div className={styles.radio_section_option}>
				<CheckBox
					checked={acc_tc}
					label={
						<p className="common_bold">
							I accept Stripe’s{" "}
							<span
								className={styles.tos_text}
								style={{ color: color_palette.dark_blue }}
								onClick={() => window.open("https://stripe.com/legal/connect-account")}
							>
								Service Agreement.
							</span>
						</p>
					}
					onClick={() => {
						if (!ip_consent) {
							set_warn_ip(true);
						}

						ip_consent && set_acc_tc(!acc_tc);
					}}
				/>
				{warn_ip && (
					<ErrorMessage
						message={"You can only accept Stripe's Service Agreement if you consent to your IP address being collected."}
					/>
				)}
			</div>
			{!all_fields_entered() && <ErrorMessage message={"Please ensure you've entered and correctly formatted all fields."} />}
			<div className={styles.button_center_container}>
				<SmallButton onClick={() => set_sign_up_step(SignUpStep.SignUpOrg)}>Back</SmallButton>
				<SmallButton onClick={() => all_fields_entered() && set_tos_value()}>Continue</SmallButton>
			</div>
		</div>
	);
};

export default SignUpDisclaimer;
