import { useState } from "react";

import ErrorMessage from "components/error_message";
import InputBox from "components/input_box";
import SmallButton from "components/small_button/small_button";

import { SignUpStep } from "common";
import common from "common/css/common.module.css";

import PhoneNumberInput from "pages/account/sign_up_flow/components/sign_up_owner/sign_up_owner/sign_up_owner_components/phone_number";
import { use_sign_up } from "state/use_sign_up";

import styles from "./sign_up_owner.module.css";

type Warnings = {
	first_name: boolean;
	last_name: boolean;
	email: boolean;
	confirm_email: boolean;
	phone: boolean;
};

const SignUpOwner = () => {
	const { new_owner, set_new_owner, set_sign_up_step } = use_sign_up((state) => ({
		new_owner: state.new_owner,
		set_new_owner: state.set_new_owner,
		set_sign_up_step: state.set_sign_up_step,
	}));

	const [temp_new_owner, set_temp_new_owner] = useState(new_owner);

	const [warn, set_warn] = useState<Warnings>({
		first_name: false,
		last_name: false,
		email: false,
		confirm_email: false,
		phone: false,
	});

	// placed error handling stuff into a function to readability
	const all_fields_entered = () => {
		return (
			temp_new_owner.first_name.length !== 0 &&
			temp_new_owner.last_name.length !== 0 &&
			temp_new_owner.email.length !== 0 &&
			temp_new_owner.confirm_email === temp_new_owner.email &&
			temp_new_owner.phone.length === 10 &&
			!warn.first_name &&
			!warn.last_name &&
			!warn.email &&
			!warn.phone
		);
	};

	return (
		<div className={"mx-80 my-10 flex flex-col items-center text-left font-custom text-regular font-normal text-fangarde-black"}>
			<h1 className={"my-[10px]"}>Tell us about an owner.</h1>
			<div className={styles.input_row}>
				<div className={"w-[47%]"}>
					<p className={common.common_bold}>First Name:</p>
					<InputBox
						value={temp_new_owner.first_name}
						onChange={(value: string) => {
							set_temp_new_owner({
								...temp_new_owner,
								first_name: value,
							});

							set_warn({
								...warn,
								first_name: value.length < 1 || /^\s*$/.test(value),
							});
						}}
					/>
					{warn.first_name && <ErrorMessage message={"Please enter a valid first name."} />}
				</div>
				<div className={"w-[47%]"}>
					<p className={common.common_bold}>Last Name:</p>
					<InputBox
						value={temp_new_owner.last_name}
						onChange={(value: string) => {
							set_temp_new_owner({
								...temp_new_owner,
								last_name: value,
							});

							set_warn({
								...warn,
								last_name: value.length < 1 || /^\s*$/.test(value),
							});
						}}
					/>
					{warn.last_name && <ErrorMessage message={"Please enter a valid last name."} />}
				</div>
			</div>
			<div className={styles.input_container}>
				<p className={common.common_bold}>Email:</p>
				<InputBox
					value={temp_new_owner.email}
					onChange={(value: string) => {
						set_temp_new_owner({
							...temp_new_owner,
							email: value,
						});

						set_warn({
							...warn,
							email:
								!value.length ||
								/^\s*$/.test(value) ||
								/^[^@.]+$/.test(value) ||
								!/\.(com|net|org|gov|fun|edu)$/.test(value),
							confirm_email: value !== temp_new_owner.confirm_email,
						});
					}}
				/>
				{warn.email && <ErrorMessage message={"Please enter a valid email address e.g. contact@fangarde.com."} />}
			</div>
			<div className={styles.input_container}>
				<p className={common.common_bold}>Confirm Email:</p>
				<InputBox
					onChange={(value: string) => {
						set_temp_new_owner({
							...temp_new_owner,
							confirm_email: value,
						});

						set_warn({
							...warn,
							confirm_email: value.length < 1 || /^\s*$/.test(value) || value !== temp_new_owner.email,
						});
					}}
				/>
				{warn.confirm_email && <ErrorMessage message={"Please make sure that both inputted emails match."} />}
			</div>
			<div className={styles.input_container}>
				<PhoneNumberInput
					header={"Phone Number:"}
					placeholder={"(XXX) XXX-XXXX"}
					phone_number={temp_new_owner.phone}
					onChange={(phone: string) => {
						if (phone.length > 14) {
							phone = phone.slice(0, 14);
						}

						phone = phone.replace(/[^\d]/g, "");

						set_temp_new_owner({
							...temp_new_owner,
							phone: phone,
						});

						set_warn({
							...warn,
							phone: phone.length < 1 || /^\s*$/.test(phone),
						});
					}}
				/>
			</div>
			{warn.phone && <ErrorMessage message={"Please enter a valid phone number (e.g. ((XXX) XXX-XXXX))"} />}
			{!all_fields_entered() && <ErrorMessage message={"Please ensure you've entered and correctly formatted all fields."} />}
			<div className={styles.button_center_container}>
				<SmallButton
					onClick={() => {
						set_new_owner(temp_new_owner);
						set_sign_up_step(SignUpStep.SignUpOrgIdentity);
					}}
				>
					Back
				</SmallButton>
				<SmallButton
					onClick={() => {
						if (all_fields_entered()) {
							set_new_owner(temp_new_owner);
							set_sign_up_step(SignUpStep.SignUpUser);
						}
					}}
				>
					Continue
				</SmallButton>
			</div>
		</div>
	);
};

export default SignUpOwner;
