import { useEffect, useState } from "react";

import ErrorMessage from "components/error_message";
import InputBox from "components/input_box";
import RadioComponent from "../radio_component/radio_component";
import SmallButton from "../../../../../../../../../components/small_button/small_button";
import TextAreaInputBox from "components/text_area";
import TimeSelectionSection from "./time_selection_section";

import styles from "./additional_event_info.module.css";

import { useUser } from "../../../../../../../../../state/useUser";
import { use_accounting } from "state/admin/accounting";

import { api } from "axiosClients/client";

import { AccessType, AdmissionType, IndoorsOutdoors, DonationType } from "../../../../../../../../../common";

type TicketInfoProps = {
	onSubmit: Function;
	onBack: Function;
	event: EventCreate;
	setEvent: Function;
};

const AdditionalEventInfo = ({ onSubmit, onBack, event, setEvent }: TicketInfoProps) => {
	const [displayErrors, setDisplayErrors] = useState<boolean>(false);
	const userOrganization = useUser((state) => state.userOrganization);

	const set_bank_accounts = use_accounting((state) => state.set_bank_accounts);

	const section_style: string = "relative my-[20px] flex flex-col items-center";

	const DonationOptions = [
		{
			label: "Yes",
			value: "yes",
			id: "donate_no",
			checked: event.donations === true,
			handleChange: (value: any) => {
				setEvent({
					...event,
					donations: true,
				});
			},
		},
		{
			label: "No",
			value: "no",
			id: "donate_yes",
			checked: event.donations === false,
			handleChange: (value: any) => {
				const newEvent: EventCreate = {
					...event,
					donations: false,
				};
				delete newEvent.donation_message;
				delete newEvent.donation_type;
				delete newEvent.donation_options;
				setEvent(newEvent);
			},
		},
	];

	const DonationTypeOptions = [
		{
			label: "Percentage (%)",
			value: DonationType.Percentage,
			id: "percentage",
			checked: event.donation_type === DonationType.Percentage,
			handleChange: (value: any) => {
				setEvent({
					...event,
					donation_type: value,
					donation_options: [10, 15, 20, 25],
				});
			},
		},
		{
			label: "Flat Amount ($)",
			value: DonationType.Flat,
			id: "flat",
			checked: event.donation_type === DonationType.Flat,
			handleChange: (value: any) => {
				setEvent({
					...event,
					donation_type: value,
					donation_options: [5, 10, 15, 20],
				});
			},
		},
	];

	const AccessOptions = [
		{
			label: "Public",
			value: AccessType.Public,
			id: "public",
			checked: event.access_type === AccessType.Public,
			handleChange: (value: any) => handleChange(value, "access_type"),
		},
		{
			label: "Private",
			value: AccessType.Private,
			id: "private",
			checked: event.access_type === AccessType.Private,
			handleChange: (value: any) => handleChange(value, "access_type"),
		},
	];

	const SubEventOptions = [
		{
			label: "No",
			value: false,
			id: "no_sub",
			checked: event.sub_events === false,
			handleChange: (value: any) => handleChange(value, "sub_events"),
		},
		{
			label: "Yes",
			value: true,
			id: "yes_sub",
			checked: event.sub_events === true,
			handleChange: (value: any) => handleChange(value, "sub_events"),
		},
	];

	const isFormComplete =
		event.access_type !== AccessType.None &&
		event.event_end_time !== undefined &&
		event.event_start_time !== undefined &&
		event.donations !== undefined &&
		(event.donations === true ? event.donation_message !== undefined && event.donation_type !== undefined : true);

	function renderErrors(header: keyof EventCreate) {
		if (
			displayErrors &&
			(event[header] === false ||
				event[header] === IndoorsOutdoors.None ||
				event[header] === AdmissionType.None ||
				event[header] === AccessType.None)
		) {
			return <ErrorMessage message={"This field is required!"} />;
		}
	}

	function handleChange(value: any, header: keyof EventCreate) {
		const newEvent: EventCreate = {
			...event,
			[header]: value === "true" || value === "false" ? value === "true" : value,
		};

		setEvent(newEvent);
	}

	function handleContinue() {
		if (isFormComplete) {
			onSubmit();
		} else {
			setDisplayErrors(true);
		}
	}

	useEffect(() => {
		if (userOrganization.stripe_conn_id) {
			api.post("/retrieve_stripe_bank_accounts", {
				acc_id: userOrganization.stripe_conn_id,
			})
				.then((res: any) => {
					if (res.error) {
						console.log(res.error);
					} else {
						set_bank_accounts(res.data.payload.bank_accounts);
					}
				})
				.catch((err: any) => {
					console.log(err);
				});
		}
	}, []);

	return (
		<div className="mx-36 mt-4 flex flex-col items-center">
			<div className={styles.column}>
				<h1 className="my-[20px] p-0">Additional Event Information</h1>
				<TimeSelectionSection
					title={"Start Time"}
					event={event}
					set_event={setEvent}
					render_errors={renderErrors}
					handle_change={handleChange}
					date_type={"event_start_time"}
				/>
				<TimeSelectionSection
					title={"End Time"}
					event={event}
					set_event={setEvent}
					render_errors={renderErrors}
					handle_change={handleChange}
					date_type={"event_end_time"}
				/>
				<div className={section_style}>
					<h3>Will this event have sub-events?</h3>
					<RadioComponent options={SubEventOptions} row={true} />
				</div>
				<div className={section_style}>
					<h3>Access Type</h3>
					<RadioComponent options={AccessOptions} row={true} />
					{displayErrors && event.access_type === AccessType.None && <ErrorMessage message={"This field is required!"} />}
				</div>
				<div className={section_style}>
					<h3>Would you like to accept donations?</h3>
					<RadioComponent options={DonationOptions} row={true} />
					{displayErrors && event.donations === undefined && <ErrorMessage message={"This field is required!"} />}
				</div>
				{event.donations && (
					<>
						<div className={section_style}>
							<h3>Would you like to take a percentage or a flat amount?</h3>
							<RadioComponent options={DonationTypeOptions} row={true} />
							{event.donation_type === "percentage" && (
								<p className={`w-full whitespace-nowrap font-custom text-regular font-bold text-medium-blue`}>
									{"Warning! This is only an option for paid events. Is this a paid event?"}
								</p>
							)}
							{displayErrors && event.donation_type === undefined && (
								<ErrorMessage message={"This field is required!"} />
							)}
						</div>
						{event.donation_options && (
							<div className={section_style}>
								<h3>What would you like the options to be?</h3>
								<div className={styles.row}>
									{event.donation_options.map((option, index) => {
										return (
											<div key={index} className="flex flex-row items-center">
												{event.donation_type === DonationType.Flat && <span className="text-[20px]">$</span>}
												<div className="relative mx-[10px] w-[80px] text-center">
													<InputBox
														value={option.toString()}
														maxLength={10}
														onChange={(value: string) => {
															let temp_donation_options = event.donation_options || [];
															if (!Number.isNaN(Number(value))) {
																temp_donation_options[index] = Number(value);
																setEvent({
																	...event,
																	donation_options: temp_donation_options,
																});
															}
														}}
													/>
													{option === 0 && (
														<p className=" absolute left-1/2 w-16 -translate-x-1/2 transform whitespace-pre-wrap font-custom text-regular text-sm font-bold text-fangarde-medium-red">
															Option should not be 0!
														</p>
													)}
												</div>
												{event.donation_type === DonationType.Percentage && (
													<span className="text-[20px]">%</span>
												)}
											</div>
										);
									})}
								</div>
							</div>
						)}
						<div className={`${section_style} mt-[47px]`}>
							<h3>What should the donation message be?</h3>
							<TextAreaInputBox
								placeholder={
									"e.g. Our organization relies on donations from people like you. Thank you for your support!"
								}
								value={event.donation_message}
								maxLength={800}
								onChange={(value: string) =>
									setEvent({
										...event,
										donation_message: value,
									})
								}
							/>
							{displayErrors && event.donation_message === undefined && (
								<ErrorMessage message={"This field is required!"} />
							)}
						</div>
					</>
				)}
				<div className={styles.button_section}>
					<div className="flex w-full flex-row items-center justify-between">
						<SmallButton
							onClick={() => {
								onBack();
							}}
						>
							Back
						</SmallButton>
						<SmallButton
							onClick={() => {
								handleContinue();
							}}
						>
							Continue
						</SmallButton>
					</div>
					{!isFormComplete && displayErrors && <ErrorMessage message={"Please fix your errors before submitting!"} />}
				</div>
			</div>
		</div>
	);
};

export default AdditionalEventInfo;
