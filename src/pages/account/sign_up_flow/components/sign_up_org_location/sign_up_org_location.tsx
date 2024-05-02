import { useState } from "react";

import Dropdown from "components/dropdown";
import InputBox from "components/input_box";
import SmallButton from "components/small_button/small_button";

import { SignUpStep } from "common";
import color_palette from "common/types/colors";
import states from "pages/account/sign_up_flow/components/sign_up_org_location/states";
import { use_sign_up } from "state/use_sign_up";

import common from "common/css/common.module.css";
import styles from "./sign_up_org_location.module.css";
import ErrorMessage from "components/error_message";

const SignUpOrgLocation = () => {
	const { new_organization, set_new_organization, set_sign_up_step } = use_sign_up((state) => ({
		new_organization: state.new_organization,
		set_new_organization: state.set_new_organization,
		set_sign_up_step: state.set_sign_up_step,
	}));

	type OrgAddress = {
		city: string;
		country: string;
		line1: string;
		line2: string | undefined;
		postal_code: string;
		state: string;
	};

	type Warnings = {
		line1: boolean;
		city: boolean;
		postal_code: boolean;
	};

	const [org_address, set_org_address] = useState<OrgAddress>({
		city: "",
		country: "US", // initialize to the only available country option
		line1: "",
		line2: undefined,
		postal_code: "",
		state: "Alabama", // initialize to the default state
	});
	const [warn, set_warn] = useState<Warnings>({
		line1: false,
		city: false,
		postal_code: false,
	});

	const set_address_value = () => {
		set_new_organization({
			...new_organization,
			company: {
				...new_organization.company,
				address: {
					...org_address,
				},
			},
		} as typeof new_organization);

		set_sign_up_step(SignUpStep.SignUpOrgIdentity);
	};

	// placed error handling stuff into a function to readability
	const all_fields_entered = () => {
		return (
			!warn.line1 &&
			!warn.city &&
			!warn.postal_code &&
			org_address.line1.length > 0 &&
			org_address.country.length > 0 &&
			org_address.state.length > 0 &&
			org_address.city.length > 0 &&
			org_address.postal_code.length > 0
		);
	};

	return (
		<div className={"mx-80 my-10 flex flex-col items-center text-left font-custom text-regular font-normal text-fangarde-black"}>
			<h1 className={"my-[10px] text-lg-header"}>Where is your organization based?</h1>
			<div className={styles.input_container}>
				<p className={common.common_bold}>Address Line 1:</p>
				<InputBox
					value={org_address.line1}
					onChange={(value: string) => {
						set_org_address({
							...org_address,
							line1: value,
						});

						set_warn({
							...warn,
							line1: value.length < 1 || /^\s*$/.test(value),
						});
					}}
				/>
				{warn.line1 && (
					<p className={`${styles.error_message} ${common.common_bold}`} style={{ color: color_palette.red }}>
						Please enter a valid address.
					</p>
				)}
			</div>
			<div className={styles.input_container}>
				<p className={common.common_bold}>Address Line 2:</p>
				<InputBox
					value={org_address.line2}
					onChange={(value: string) => {
						set_org_address({
							...org_address,
							line2: value,
						});
					}}
				/>
			</div>
			<div className={styles.input_row}>
				<div className={styles.input_container}>
					<p className={common.common_bold}>Country:</p>
					<div className={styles.input_size_wrapper}>
						<Dropdown
							options={[{ value: "US", label: "United States" }]}
							value={org_address.country}
							onChange={(value: string) => {
								set_org_address({
									...org_address,
									country: value,
								});
							}}
							renderOption={(option: any, index: number) => {
								const { value, label } = option;
								return (
									<option value={value} key={index}>
										{label}
									</option>
								);
							}}
						/>
					</div>
				</div>
				<div className={styles.input_container}>
					<p className={common.common_bold}>State:</p>
					<div className={styles.input_size_wrapper}>
						<Dropdown
							options={states}
							value={org_address.state}
							onChange={(value: string) => {
								set_org_address({
									...org_address,
									state: value,
								});
							}}
							renderOption={(option: any, index: number) => {
								const { abbreviation, name } = option;
								return (
									<option value={abbreviation} key={index}>
										{name}
									</option>
								);
							}}
						/>
					</div>
				</div>
			</div>
			<div className={styles.input_row}>
				<div className={styles.input_container}>
					<p className={common.common_bold}>City:</p>
					<div className={styles.input_size_wrapper}>
						<InputBox
							value={org_address.city}
							onChange={(value: string) => {
								set_org_address({
									...org_address,
									city: value,
								});

								set_warn({
									...warn,
									city: value.length < 1 || /^\s*$/.test(value),
								});
							}}
						/>
					</div>
					{warn.city && (
						<p className={`${styles.error_message} ${common.common_bold}`} style={{ color: color_palette.red }}>
							Please enter a valid city.
						</p>
					)}
				</div>
				<div className={styles.input_container}>
					<p className={common.common_bold}>Postal Code:</p>
					<div className={styles.input_size_wrapper}>
						<InputBox
							value={org_address.postal_code}
							onChange={(value: string) => {
								let formatted_postal_code: string = value;
								// 17 is the max account number length
								if (formatted_postal_code.length > 5) {
									formatted_postal_code = formatted_postal_code.slice(0, 5);
								}

								set_org_address({
									...org_address,
									postal_code: formatted_postal_code,
								});

								set_warn({
									...warn,
									postal_code: formatted_postal_code.length < 1 || /^\s*$/.test(formatted_postal_code),
								});
							}}
							maxLength={5}
						/>
					</div>
					{warn.postal_code && (
						<p className={`${styles.error_message} ${common.common_bold}`} style={{ color: color_palette.red }}>
							Please enter a valid postal code.
						</p>
					)}
				</div>
			</div>
			{!all_fields_entered() && <ErrorMessage message={"Please ensure you've entered and correctly formatted all fields."} />}
			<div className={styles.button_center_container}>
				<SmallButton onClick={() => set_sign_up_step(SignUpStep.SignUpDisclaimer)}>Back</SmallButton>
				<SmallButton
					onClick={() =>
						// lots of disgusting error checking
						all_fields_entered() && set_address_value()
					}
				>
					Continue
				</SmallButton>
			</div>
		</div>
	);
};

export default SignUpOrgLocation;
