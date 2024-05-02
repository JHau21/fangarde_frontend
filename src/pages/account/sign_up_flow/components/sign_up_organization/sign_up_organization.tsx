import { useState } from "react";

import Dropdown from "components/dropdown";
import ErrorMessage from "components/error_message";
import InputBox from "components/input_box";
import RadioButton from "components/radio_button";
import SmallButton from "components/small_button/small_button";

import { Genre, SignUpStep } from "common";
import { use_sign_up } from "state/use_sign_up";

import styles from "./sign_up_organization.module.css";

const SignUpOrg = () => {
	const { new_organization, set_new_organization, set_sign_up_step } = use_sign_up((state) => ({
		new_organization: state.new_organization,
		set_new_organization: state.set_new_organization,
		set_sign_up_step: state.set_sign_up_step,
	}));
	const [displayErrors, setDisplayErrors] = useState<boolean>();
	const [paid_events, set_paid_events] = useState<boolean>(new_organization.paid_events);

	// this is a temporary fix to get the input bars working with the new hook
	// TODO: these should be replaced with a proper react-hook-form
	const [temp_new_organization, set_temp_new_organization] = useState(new_organization);
	const update_temp_new_organization = (key: keyof OrganizationSignUp, newValue: any) => {
		set_temp_new_organization({ ...temp_new_organization, [key]: newValue });
	};

	const organization_event_sizes: Array<{ value: number; label: string }> = [
		{ value: 0, label: "Select" },
		{ value: 200, label: "Less than 500" },
		{ value: 500, label: "500-1000" },
		{ value: 1000, label: "1000-5000" },
		{ value: 5000, label: "5000-10000" },
		{ value: 10000, label: "10000-30000" },
		{ value: 30000, label: "30000-50000" },
		{ value: 50000, label: "50000+" },
	];
	const organization_sizes: Array<{ value: number; label: string }> = [
		{ value: 0, label: "Select" },
		{ value: 1, label: "Less than 10" },
		{ value: 10, label: "10-30" },
		{ value: 30, label: "30-50" },
		{ value: 50, label: "50-100" },
		{ value: 100, label: "100-200" },
		{ value: 200, label: "200-300" },
		{ value: 300, label: "300+" },
	];
	const num_venues: Array<number> = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

	function isFormComplete() {
		if (
			temp_new_organization.genre === "" ||
			temp_new_organization.name === "" ||
			temp_new_organization.description === "" ||
			temp_new_organization.num_locations === 0 ||
			temp_new_organization.num_attendee_per_event === 0 ||
			temp_new_organization.number_events_annual === 0 ||
			temp_new_organization?.multiple_locations === ""
		) {
			return false;
		}
		return true;
	}

	function onBack() {
		set_sign_up_step(SignUpStep.SignUpInfo);
	}

	function onContinue() {
		if (isFormComplete()) {
			set_new_organization({
				...temp_new_organization,
				paid_events,
			});
			const next_step = paid_events ? SignUpStep.SignUpDisclaimer : SignUpStep.SignUpUser;

			set_sign_up_step(next_step);
		} else {
			setDisplayErrors(true);
		}
	}

	const renderErrors = (inputName: keyof OrganizationSignUpError) => {
		const errorMsg: OrganizationSignUpError = {
			name: "How can you plan events without a name?",
			description: "How will people know what your organization is about?",
			genre: "How will people find your venue?",
			num_locations: "How many locations do you have?",
			num_attendee_per_event: "We can help get these numbers up!",
			multiple_locations: "Do you have many?",
			number_events_annual: "Tell us how many so we can help make these a success",
		};

		if (displayErrors) {
			if (!temp_new_organization[inputName]) {
				return <ErrorMessage message={errorMsg[inputName]} />;
			}
		}
	};

	function GenreSelect() {
		return (
			<div className={styles.userInput}>
				<p className="common_bold">Organization Type:</p>
				<Dropdown
					options={["Select"].concat(Object.values(Genre))}
					value={temp_new_organization.genre}
					onChange={(value: string) => update_temp_new_organization("genre", value)}
					renderOption={(option: any, index: number) => {
						if (option === "Select") {
							return (
								<option key={index} value={""}>
									Select
								</option>
							);
						}

						return (
							<option key={index} value={option}>
								{Object.keys(Genre)[index - 1]}
							</option>
						);
					}}
				/>
				{renderErrors("genre")}
			</div>
		);
	}

	return (
		<div className={"mx-36 my-10 flex flex-col items-center"}>
			<div className={styles.column}>
				<h1 className="common_bold">Tell us about your organization.</h1>
				<h2 className="my-[10px]">Organization Information</h2>
				<div className={styles.userInputColumn}>
					<div className={styles.userInput}>
						<p className="common_bold">Name:</p>
						<InputBox
							value={temp_new_organization.name}
							onChange={(value: string) => update_temp_new_organization("name", value)}
						/>
						{renderErrors("name")}
					</div>
					<div className={styles.userInput}>
						<p className="common_bold">Description:</p>
						<InputBox
							value={temp_new_organization.description}
							onChange={(value: string) => update_temp_new_organization("description", value)}
						/>
						{renderErrors("description")}
					</div>
					<GenreSelect />
					<div className={styles.userInput}>
						<p className="common_bold">How many events do you host anually?</p>
						<Dropdown
							options={organization_sizes}
							value={temp_new_organization.number_events_annual.toString()}
							onChange={(value: string) => {
								update_temp_new_organization("number_events_annual", +value);
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
						{renderErrors("number_events_annual")}
					</div>
					<div className={styles.userInput}>
						<p className="common_bold">How big are your events?</p>
						<Dropdown
							options={organization_event_sizes}
							value={temp_new_organization.num_attendee_per_event.toString()}
							onChange={(value: string) => {
								update_temp_new_organization("num_attendee_per_event", +value);
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
						{renderErrors("num_attendee_per_event")}
					</div>
					<div className={styles.userInput}>
						<p className="common_bold">Do you have multiple event hosting locations?</p>
						<Dropdown
							placeholder={"Select"}
							options={["Select", "Yes", "No"]}
							value={temp_new_organization.multiple_locations ? "Yes" : "No"}
							onChange={(value: string) => {
								update_temp_new_organization("multiple_locations", value === "Yes");
							}}
							renderOption={(option: any, index: number) => {
								return (
									<option value={option} key={index}>
										{option}
									</option>
								);
							}}
						/>
						{renderErrors("multiple_locations")}
					</div>
					{temp_new_organization.multiple_locations === true && (
						<div className={styles.userInput}>
							<p className="common_bold">How Many?:</p>
							<Dropdown
								placeholder={"Select"}
								options={num_venues}
								value={temp_new_organization.num_locations.toString()}
								onChange={(value: string) => {
									update_temp_new_organization("num_locations", +value);
								}}
								renderOption={(option: any, index: number) => {
									return (
										<option value={option.toString()} key={index}>
											{option === 10 ? "10+" : option}
										</option>
									);
								}}
							/>
							{renderErrors("num_locations")}
						</div>
					)}
					<div className={styles.radio_section}>
						<p className="common_bold">Will you be hosting paid events?</p>
						<div className={styles.radio_section_options_container}>
							<RadioButton
								checked={paid_events}
								label={"Yes"}
								onChange={() => {
									update_temp_new_organization("paid_events", true);
									set_paid_events(true);
								}}
							/>
							<RadioButton checked={!paid_events} label={"No"} onChange={() => set_paid_events(false)} />
						</div>
					</div>
				</div>
				<div className={styles.buttonRow}>
					<SmallButton onClick={onBack}>Back</SmallButton>
					<SmallButton onClick={onContinue}>Continue</SmallButton>
				</div>
			</div>
		</div>
	);
};

export default SignUpOrg;
