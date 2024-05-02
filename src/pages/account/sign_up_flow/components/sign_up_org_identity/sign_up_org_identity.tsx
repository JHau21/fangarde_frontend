import { useState } from "react";

import Dropdown from "components/dropdown";
import EINInput from "pages/account/sign_up_flow/components/sign_up_org_identity/org_identity_components/ein_input";
import ErrorMessage from "components/error_message";
import SmallButton from "components/small_button/small_button";
import WebURLInput from "pages/account/sign_up_flow/components/sign_up_org_identity/org_identity_components/web_url_input";

import { SignUpStep } from "common";
import color_palette from "common/types/colors";
import {
	org_types_and_structures,
	org_types_map,
	event_type_mcc_map,
	rep_required,
} from "pages/account/sign_up_flow/components/sign_up_org_identity/identity_types_values";
import { use_sign_up } from "state/use_sign_up";

import common from "common/css/common.module.css";
import styles from "pages/account/sign_up_flow/components/sign_up_org_identity/sign_up_org_identity.module.css";

type OrgIdentity = {
	web_url: string;
	org_ein: string;
	org_type: string;
	company_structure: string | undefined;
	org_mcc: string;
};

type Warnings = {
	web_url: boolean;
	org_ein: boolean;
	org_type: boolean;
	company_structure: boolean;
	org_mcc: boolean;
};

const SignUpOrgIdentity = () => {
	const { new_organization, set_new_organization, set_sign_up_step } = use_sign_up((state) => ({
		new_organization: state.new_organization,
		set_new_organization: state.set_new_organization,
		set_sign_up_step: state.set_sign_up_step,
	}));

	const [org_identity, set_org_identity] = useState<OrgIdentity>({
		web_url: "",
		org_ein: "",
		org_type: "",
		company_structure: "",
		org_mcc: "",
	});
	const [warn, set_warn] = useState<Warnings>({
		web_url: false,
		org_ein: false,
		org_type: false,
		company_structure: false,
		org_mcc: false,
	});

	const all_fields_entered = () => {
		return (
			!warn.org_type &&
			!warn.company_structure &&
			!warn.org_mcc &&
			!warn.org_ein &&
			!warn.web_url &&
			org_identity.org_type.length !== 0 &&
			org_identity.org_mcc.length !== 0 &&
			org_identity.org_ein.length === 9 &&
			org_identity.web_url.length !== 0
		);
	};

	const set_identity_value = () => {
		set_new_organization({
			...new_organization,
			mcc: org_identity.org_mcc,
			url: org_identity.web_url,
			business_type: org_identity.org_type,
			company: org_identity.company_structure
				? {
						...new_organization.company,
						structure: org_identity.company_structure,
						tax_id: org_identity.org_ein,
				  }
				: {
						...new_organization.company,
						tax_id: org_identity.org_ein,
				  },
		} as typeof new_organization);

		if (org_identity.org_type === "individual") {
			set_sign_up_step(SignUpStep.SignUpUser);
		} else if (org_identity.company_structure) {
			rep_required.includes(org_identity.company_structure)
				? set_sign_up_step(SignUpStep.SignUpUser)
				: set_sign_up_step(SignUpStep.SignUpOwner);
		}
	};

	return (
		<div className={"mx-80 my-10 flex flex-col items-center text-left font-custom text-regular font-normal text-fangarde-black"}>
			<h1 className={"my-[10px]"}>Organization Identity Information.</h1>
			<div className={styles.input_container}>
				<p className={common.common_bold}>Organization Type:</p>
				<Dropdown
					options={["Select an option..."].concat(Object.keys(org_types_map))}
					value={org_identity.org_type}
					onChange={(value: string) => {
						set_org_identity({
							...org_identity,
							org_type: value,
							company_structure: org_identity.company_structure !== "" ? "" : org_identity.company_structure,
						});

						set_warn({
							...warn,
							org_type: value.length < 1 || /^\s*$/.test(value),
						});
					}}
					renderOption={(option: any, index: number) => {
						if (option === "Select an option...") {
							return (
								<option key={index} value={""} disabled={true}>
									{option}
								</option>
							);
						}

						return (
							<option key={index} value={org_types_map[option]}>
								{option}
							</option>
						);
					}}
				/>
			</div>
			{org_identity.org_type !== "individual" && (
				<div className={styles.input_container}>
					<p className={common.common_bold}>Organization Structure:</p>
					<Dropdown
						options={
							org_types_and_structures[org_identity.org_type]
								? Object.entries(org_types_and_structures[org_identity.org_type])
								: Object.entries({ "Select an option...": "Select an options..." })
						}
						value={org_identity.company_structure}
						onChange={(value: string) => {
							set_org_identity({
								...org_identity,
								company_structure: value,
							});

							set_warn({
								...warn,
								company_structure: value.length < 1 || /^\s*$/.test(value),
							});
						}}
						renderOption={(option: any, index: number) => {
							if (option[0] === "Select an option...") {
								return (
									<option key={index} value={""} disabled={true}>
										{option[0]}
									</option>
								);
							}

							return (
								<option key={index} value={option[1]}>
									{option[0]}
								</option>
							);
						}}
					/>
				</div>
			)}
			<div className={styles.input_container}>
				<p className={common.common_bold}>Which of these best describes your organization?</p>
				<Dropdown
					options={Object.entries(event_type_mcc_map)}
					value={org_identity.org_mcc}
					onChange={(value: string) => {
						set_org_identity({
							...org_identity,
							org_mcc: value,
						});

						set_warn({
							...warn,
							org_mcc: value.length < 1 || /^\s*$/.test(value),
						});
					}}
					renderOption={(option: any, index: number) => {
						if (option[0] === "Select an option...") {
							return (
								<option key={index} value={""} disabled={true}>
									{option[0]}
								</option>
							);
						}

						return (
							<option key={index} value={option[1]}>
								{option[0]}
							</option>
						);
					}}
				/>
			</div>
			<div style={{ position: "relative" }}>
				<WebURLInput
					placeholder={"e.g. https://fangarde.com"}
					header={"Website URL"}
					web_url={org_identity.web_url}
					onChange={(web_url: string) => {
						set_org_identity({
							...org_identity,
							web_url: web_url,
						});

						set_warn({
							...warn,
							web_url:
								web_url.length < 1 ||
								!/^(ftp|http|https):\/\/[^ "]+$/.test(web_url) ||
								!/\.(com|net|org|gov)$/.test(web_url),
						});
					}}
				/>
				{warn.web_url && <ErrorMessage message={"Please enter a valid website URL (e.g. https://fangarde.com)."} />}
			</div>
			<div style={{ position: "relative" }}>
				<EINInput
					placeholder={"e.g. 12-3456789"}
					header={"EIN/FEIN:"}
					ein={org_identity.org_ein}
					onChange={(ein: string) => {
						if (ein.length > 10) {
							ein = ein.slice(0, 10);
						}

						ein = ein.replace(/[^\d]/g, "");

						set_org_identity({
							...org_identity,
							org_ein: ein,
						});

						set_warn({
							...warn,
							org_ein: ein.length !== 9 || /^\s*$/.test(ein),
						});
					}}
				/>
				{warn.org_ein && <ErrorMessage message={"Please enter a valid ein number (e.g. 12-3456789)."} />}
			</div>
			{!all_fields_entered() && <ErrorMessage message={"Please ensure you've entered and correctly formatted all fields."} />}
			<div className={styles.button_center_container}>
				<SmallButton onClick={() => set_sign_up_step(SignUpStep.SignUpOrgLocation)}>Back</SmallButton>
				<SmallButton onClick={() => all_fields_entered() && set_identity_value()}>Continue</SmallButton>
			</div>
		</div>
	);
};

export default SignUpOrgIdentity;
