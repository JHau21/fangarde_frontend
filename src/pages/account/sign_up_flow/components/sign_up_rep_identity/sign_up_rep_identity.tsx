import { useState } from "react";

import Dropdown from "components/dropdown";
import ErrorMessage from "components/error_message";
import InputBox from "components/input_box";
import SmallButton from "components/small_button/small_button";

import { SignUpStep } from "common";
import states from "pages/account/sign_up_flow/components/sign_up_org_location/states";
import DOBInput from "pages/account/sign_up_flow/components/sign_up_rep_identity/user_identity_components/dob_input";
import SSNInput from "pages/account/sign_up_flow/components/sign_up_rep_identity/user_identity_components/ssn_input";
import FileUpload from "pages/account/sign_up_flow/components/sign_up_rep_identity/file_upload_input/file_upload";
import Loader from "partials/loader/loader";
import { use_sign_up } from "state/use_sign_up";

import styles from "./sign_up_rep_identity.module.css";
import common from "common/css/common.module.css";

type Props = {
	onSubmit: Function;
	upload_stripe_org: Function;
};

type Warnings = {
	line1: boolean;
	line2: boolean;
	country: boolean;
	state: boolean;
	city: boolean;
	zip_code: boolean;
	ssn: boolean;
	dob: boolean;
	upload: boolean;
};

// take in the sign up user and sign up rep objs
const SignUpRepIdentity = ({ onSubmit, upload_stripe_org }: Props) => {
	const set_sign_up_step = use_sign_up((state) => state.set_sign_up_step);

	const [warn, set_warn] = useState<Warnings>({
		line1: false,
		line2: false,
		country: false,
		state: false,
		city: false,
		zip_code: false,
		ssn: false,
		dob: false,
		upload: false,
	});
	const [user_identity, set_user_identity] = useState<RepresentativeIdentity>({
		address: {
			city: "",
			country: "US",
			line1: "",
			line2: "",
			postal_code: "",
			state: "Alabama",
		},
		ssn_last_4: "",
		id_number: "",
	});
	const [dob, set_dob] = useState<string>(""); // this is a temporary work around for dealing with the fact that the date of birth will be a single input but has to eventually be split into a object
	const [id_front, set_id_front] = useState<any | undefined>(undefined);
	const [id_back, set_id_back] = useState<any | undefined>(undefined);
	const [error_message, set_error_message] = useState<string>("");
	const [loading, set_loading] = useState<boolean>(false);

	// placed error handling stuff into a function to readability
	const all_fields_entered = () => {
		return (
			!warn.line1 &&
			!warn.line2 &&
			!warn.city &&
			!warn.country &&
			!warn.dob &&
			!warn.ssn &&
			!warn.state &&
			!warn.zip_code &&
			id_back &&
			id_front &&
			dob &&
			user_identity.address.line1.length > 0 &&
			user_identity.address.country.length > 0 &&
			user_identity.address.city.length > 0 &&
			user_identity.address.state.length > 0 &&
			user_identity.address.postal_code.length > 0 &&
			user_identity.id_number.length === 9
		);
	};

	const convert_file_for_upload = async (file: any) => {
		return new Promise((resolve, reject) => {
			const file_reader = new FileReader();

			file_reader.readAsDataURL(file);

			file_reader.onload = () => {
				resolve(file_reader.result);
			};
			file_reader.onerror = (error: any) => {
				reject(error);
			};
		});
	};

	const set_stripe_user = async () => {
		set_warn({
			...warn,
			upload: false,
		});
		set_error_message("");
		set_loading(true);

		const birth_month: number = Number(dob[0] + dob[1]);
		const birth_day: number = Number(dob[2] + dob[3]);
		const birth_year: number = Number(dob[4] + dob[5] + dob[6] + dob[7]);

		const upload_dob: {
			day: number;
			month: number;
			year: number;
		} = {
			day: birth_day,
			month: birth_month,
			year: birth_year,
		};

		const upload_identity: UploadRepresentative = {
			dob: {
				...upload_dob,
			},
			address: {
				...user_identity.address,
			},
			ssn_last_4:
				user_identity.id_number[5] + user_identity.id_number[6] + user_identity.id_number[7] + user_identity.id_number[8],
			id_number: user_identity.id_number,
		};

		const front_data = await convert_file_for_upload(id_front);
		const back_data = await convert_file_for_upload(id_back);

		const front_file: StripeFile = {
			file: {
				data: front_data,
				name: id_front.name,
				type: id_front.type,
			},
		};

		const back_file: StripeFile = {
			file: {
				data: back_data,
				name: id_back.name,
				type: id_back.type,
			},
		};

		const files: { front: StripeFile; back: StripeFile } = {
			front: front_file,
			back: back_file,
		};

		const response = await upload_stripe_org(upload_identity, files)
			.then((res: any) => {
				return res;
			})
			.catch((err: any) => {
				return err;
			});

		if (response.acc_id && response.person_ids.length > 0) {
			onSubmit({
				acc_id: response.acc_id,
				person_ids: response.person_ids,
			});

			set_loading(false);
		} else {
			set_warn({
				...warn,
				upload: true,
			});

			if (response.message) {
				set_error_message(
					response.message + " Please ensure that the uploaded documents are valid and all user information is accurate!"
				);
			} else {
				set_error_message(response.raw.message);
			}
			set_loading(false);
		}
	};

	return (
		<div className={"mx-80 my-10 flex flex-col items-center text-left font-custom text-regular font-normal text-fangarde-black"}>
			{loading ? (
				<div className={styles.loader_wrap}>
					<Loader />
				</div>
			) : (
				<>
					<h1 className={"my-[10px] text-lg-header"}>Please provide some identification about yourself.</h1>
					<div className={styles.input_container}>
						<p className={common.common_bold}>Address Line 1:</p>
						<InputBox
							value={user_identity.address.line1}
							onChange={(value: string) => {
								set_user_identity({
									...user_identity,
									address: {
										...user_identity.address,
										line1: value,
									},
								});

								set_warn({
									...warn,
									line1: value.length < 1 || /^\s*$/.test(value),
								});
							}}
						/>
						{warn.line1 && <ErrorMessage message={"Please enter a valid address."} />}
					</div>
					<div className={styles.input_container}>
						<p className={common.common_bold}>Address Line 2:</p>
						<InputBox
							value={user_identity.address.line2}
							onChange={(value: string) => {
								set_user_identity({
									...user_identity,
									address: {
										...user_identity.address,
										line2: value,
									},
								});

								set_warn({
									...warn,
									line2: /^\s*$/.test(value),
								});
							}}
						/>
					</div>
					<div className={styles.input_row}>
						<div className={"w-[47%]"}>
							<p className={common.common_bold}>Country:</p>
							<Dropdown
								options={[{ value: 0, label: "United States" }]}
								value={user_identity.address.country}
								onChange={(value: string) =>
									set_user_identity({
										...user_identity,
										address: {
											...user_identity.address,
											country: value,
										},
									})
								}
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
						<div className={"w-[47%]"}>
							<p className={common.common_bold}>State:</p>
							<Dropdown
								options={states}
								value={user_identity.address.state}
								onChange={(value: string) =>
									set_user_identity({
										...user_identity,
										address: {
											...user_identity.address,
											state: value,
										},
									})
								}
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
					<div className={"my-[10px] flex w-[600px] flex-row items-center justify-between"}>
						<div className={"w-[47%]"}>
							<p className={common.common_bold}>City:</p>
							<InputBox
								value={user_identity.address.city}
								onChange={(value: string) => {
									set_user_identity({
										...user_identity,
										address: {
											...user_identity.address,
											city: value,
										},
									});

									set_warn({
										...warn,
										city: value.length < 1 || /^\s*$/.test(value),
									});
								}}
							/>
							{warn.city && <ErrorMessage message={"Please enter a valid city."} />}
						</div>
						<div className={"w-[47%]"}>
							<p className={common.common_bold}>Postal Code:</p>
							<InputBox
								value={user_identity.address.postal_code}
								onChange={(value: string) => {
									let formatted_zip_code: string = value;

									if (formatted_zip_code.length > 5) {
										formatted_zip_code = formatted_zip_code.slice(0, 5);
									}

									set_user_identity({
										...user_identity,
										address: {
											...user_identity.address,
											postal_code: formatted_zip_code,
										},
									});

									set_warn({
										...warn,
										zip_code: formatted_zip_code.length < 1 || /^\s*$/.test(formatted_zip_code),
									});
								}}
								maxLength={5}
							/>
							{warn.zip_code && <ErrorMessage message={"Please enter a valid postal code."} />}
						</div>
					</div>
					<SSNInput
						header={"SSN:"}
						placeholder={"XXX-XX-XXXX"}
						ssn={user_identity.id_number}
						onChange={(ssn: string) => {
							if (ssn.length > 10) {
								ssn = ssn.slice(0, 11);
							}

							ssn = ssn.replace(/[^\d]/g, "");

							set_user_identity({
								...user_identity,
								id_number: ssn,
							});

							set_warn({
								...warn,
								ssn: ssn.length < 9 || /^\s*$/.test(ssn),
							});
						}}
					/>
					{warn.ssn && <ErrorMessage message={"Please enter a valid social security number (e.g. 123-45-6789)."} />}
					<DOBInput
						header={"DOB:"}
						placeholder={"MM/DD/YYYY"}
						dob={dob}
						onChange={(dob: string) => {
							if (dob.length > 10) {
								dob = dob.slice(0, 11);
							}

							dob = dob.replace(/[^\d]/g, "");

							set_dob(dob);

							set_warn({
								...warn,
								dob: dob.length < 8 || /^\s*$/.test(dob),
							});
						}}
					/>
					{warn.dob && <ErrorMessage message={"Please enter a valid dob (e.g. 04/14/1912)."} />}
					<div className={"mt-[10px] flex w-[600px] flex-row items-center justify-between"}>
						<div className={styles.input_size_wrapper}>
							<FileUpload
								header={"Front of state-issued ID"}
								label={"Browse files"}
								onUpload={(file: any) => set_id_front(file)}
							/>
						</div>
						<div className={styles.input_size_wrapper}>
							<FileUpload
								header={"Back of state-issued ID"}
								label={"Browse files"}
								onUpload={(file: any) => set_id_back(file)}
							/>
						</div>
					</div>
					{warn.upload && all_fields_entered() && (
						<ErrorMessage message={`There was an error uploading some of your identity information. ${error_message}`} />
					)}
					{!all_fields_entered() && (
						<ErrorMessage message={"Please ensure you've entered and correctly formatted all fields."} />
					)}
					<div className={styles.button_center_container}>
						<SmallButton onClick={() => set_sign_up_step(SignUpStep.SignUpUser)}>Back</SmallButton>
						<SmallButton
							onClick={() => {
								all_fields_entered() && set_stripe_user();
							}}
						>
							Continue
						</SmallButton>
					</div>
				</>
			)}
		</div>
	);
};

export default SignUpRepIdentity;
