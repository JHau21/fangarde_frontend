import { useState, useEffect } from "react";
import { EmptyCustomTicketMessage, EmptySeatHolds, TicketType } from "../../../../../../types/types";
import { SeatHoldsReleaseType } from "../../../../../../../../../common";

import DateSelector from "../date_selector/date_selector";
import Dropdown from "components/dropdown";
import InputBox from "components/input_box";
import TimePicker from "../time_picker/time_picker";
import RadioComponent from "../radio_component/radio_component";
import ObjectID from "bson-objectid";

import styles from "./ticket_type.module.css";

import { useUser } from "../../../../../../../../../state/useUser";
import { use_accounting } from "state/admin/accounting";

import ErrorMessage from "components/error_message";
import TextAreaInputBox from "components/text_area";
import { CreateEventRequest } from "../../types";

interface TicketTypeProps {
	ticket_type: TicketType;
	index: number;
	set_ticket_with_index: Function;
	displayErrors: boolean;
	isFormComplete: boolean[];
	setIsFormComplete: Function;
	all_ticket_types: TicketType[];
	event: TicketEventCreate;
}

const TicketTypeInput = ({
	all_ticket_types,
	ticket_type,
	index,
	set_ticket_with_index,
	displayErrors,
	setIsFormComplete,
	isFormComplete,
	event,
}: TicketTypeProps) => {
	const [price, setPrice] = useState<string>();
	const userOrganization = useUser((state) => state.userOrganization);

	const bank_accounts = use_accounting((state) => state.bank_accounts);

	const isSeatHoldsComplete = () => {
		if (ticket_type.seat_holds !== undefined) {
			if (
				ticket_type?.seat_holds?.num_seat_holds <= ticket_type.number_of_tickets &&
				!(!Number.isNaN(ticket_type.seat_holds.num_seat_holds) && ticket_type.seat_holds?.num_seat_holds <= 0) &&
				ticket_type.seat_holds?.seat_holds_release_type
			) {
				if (ticket_type.seat_holds.seat_holds_release_type === SeatHoldsReleaseType.timed) {
					return ticket_type.seat_holds?.seat_hold_release_time !== undefined;
				} else if (ticket_type.seat_holds.seat_holds_release_type === SeatHoldsReleaseType.ticket) {
					return (
						ticket_type.seat_holds?.seat_hold_release_ticket_type_id !== undefined &&
						ticket_type.seat_holds?.seat_hold_release_ticket_type_id?.toHexString() !== ticket_type?._id?.toHexString()
					);
				} else {
					return true;
				}
			} else {
				return false;
			}
		} else {
			return true;
		}
	};
	const isCustomMessageComplete = () => {
		if (ticket_type.custom_ticket_message !== undefined) {
			return ticket_type.custom_ticket_message?.title !== "" && ticket_type.custom_ticket_message?.content !== "";
		} else {
			return true;
		}
	};
	const isThisFormComplete =
		// ticket_type.resellable !== undefined &&
		// ticket_type.transferrable !== undefined &&
		// ticket_type.merchandise !== undefined &&
		ticket_type.ticket_name !== "" &&
		ticket_type.ticket_tier !== "" &&
		ticket_type.number_of_tickets > 0 &&
		!Number.isNaN(ticket_type.number_of_tickets) &&
		!Number.isNaN(ticket_type.price) &&
		ticket_type.release_time <= event.event_start_time &&
		isSeatHoldsComplete() &&
		isCustomMessageComplete();

	const Message_Options = [
		{
			label: "Yes",
			value: "yes",
			id: "yes_custom_message",
			checked: ticket_type.custom_ticket_message !== undefined,
			handleChange: () => {
				set_ticket_with_index(index, {
					...ticket_type,
					custom_ticket_message: EmptyCustomTicketMessage,
				});
			},
		},
		{
			label: "No",
			value: "no",
			id: "no_custom_message",
			checked: ticket_type.custom_ticket_message === undefined,
			handleChange: () => {
				const temp_ticket_type = { ...ticket_type };
				delete temp_ticket_type.custom_ticket_message;
				set_ticket_with_index(index, {
					...temp_ticket_type,
				});
			},
		},
	];
	const SeatHoldingOptions = [
		{
			label: "Yes",
			value: "Yes",
			id: "yes_holds",
			checked: ticket_type.seat_holds !== undefined,
			handleChange: () => {
				set_ticket_with_index(index, {
					...ticket_type,
					seat_holds: EmptySeatHolds,
				});
			},
		},
		{
			label: "No",
			value: "No",
			id: "no_holds",
			checked: ticket_type.seat_holds === undefined,
			handleChange: () => {
				const temp_ticket_type: TicketType = {
					...ticket_type,
				};
				delete temp_ticket_type.seat_holds;
				set_ticket_with_index(index, {
					...temp_ticket_type,
				});
			},
		},
	];
	function renderErrors(header: keyof TicketType) {
		if (displayErrors && ticket_type[header] === "") {
			return <ErrorMessage message={"This field is required!"} />;
		}
	}
	function handlePriceInputChange(value: string) {
		if (/^\d*(\.\d{0,2})?$/.test(value)) {
			setPrice(value);
			const numberValue = Number(value);
			if (!isNaN(numberValue) && numberValue >= 0) {
				set_ticket_with_index(index, {
					...ticket_type,
					price: numberValue,
				});
			} else {
				setPrice(undefined);
				set_ticket_with_index(index, {
					...ticket_type,
					price: NaN,
				});
			}
		} else {
			setPrice(price);
		}
	}
	useEffect(() => {
		if (ticket_type.release_time.getTime() >= ticket_type.stop_sale_time.getTime()) {
			const newDate = new Date(ticket_type.release_time.getTime() + 15 * 60000); // Add 15 minutes in milliseconds
			set_ticket_with_index(index, {
				...ticket_type,
				stop_sale_time: newDate,
			});
		}
	}, [ticket_type.release_time, ticket_type.stop_sale_time]);

	useEffect(() => {
		let temp_errors = isFormComplete.slice(0);
		temp_errors[index] = isThisFormComplete;
		setIsFormComplete(temp_errors);
	}, [ticket_type]);

	useEffect(() => {
		set_ticket_with_index(index, {
			...ticket_type,
			release_time: new Date(),
		});
	}, []);
	return (
		<div className={styles.column}>
			<div className={styles.inputRow}>
				<div className={styles.inputContainer}>
					<h3>Ticket Name:</h3>
					<InputBox
						value={ticket_type.ticket_name}
						maxLength={200}
						onChange={(value: string) =>
							set_ticket_with_index(index, {
								...ticket_type,
								ticket_name: value,
							})
						}
					/>
					{renderErrors("ticket_name")}
				</div>
				<div className={styles.inputContainer}>
					<h3>Ticket Price:</h3>
					<div className="relative flex w-full flex-row items-center">
						<span className="absolute left-[-3%] text-[20px]">$</span>
						<InputBox
							value={price !== undefined ? price.toString() : "0"}
							readOnly={!(userOrganization.stripe_conn_id && bank_accounts && bank_accounts.length)}
							type={"number"}
							pattern={"/^[0-9]*(.[0-9]+)?$/"}
							onChange={(value: string) => handlePriceInputChange(value)}
						/>
					</div>
					{userOrganization.stripe_conn_id && !(bank_accounts && bank_accounts.length) && (
						<ErrorMessage message={"You must have a Bank Account Connected to set prices!"} />
					)}
					{!userOrganization.stripe_conn_id && (
						<ErrorMessage message={"You must have a Stripe Account Connected to set prices!"} />
					)}
					{displayErrors && Number.isNaN(ticket_type.price) && <ErrorMessage message={"This field is required!"} />}
				</div>
			</div>
			<div className={styles.inputRow}>
				<div className={styles.inputContainer}>
					<h3>Ticket Tier:</h3>
					<InputBox
						value={ticket_type.ticket_tier}
						maxLength={200}
						onChange={(value: string) =>
							set_ticket_with_index(index, {
								...ticket_type,
								ticket_tier: value,
							})
						}
					/>
					{renderErrors("ticket_tier")}
				</div>
				<div className={styles.inputContainer}>
					<h3>How many tickets would you like to release?</h3>
					<InputBox
						value={ticket_type.number_of_tickets === 0 ? "" : ticket_type.number_of_tickets.toString()}
						type={"number"}
						min={1}
						max={1000000}
						maxLength={8}
						pattern="/^[0-9]*(\.[0-9]+)?$/"
						onChange={(value: string) => {
							const num: number = Number(value);

							if (!isNaN(num) && num >= 0) {
								if (value.length <= 7) {
									set_ticket_with_index(index, {
										...ticket_type,
										number_of_tickets: value,
									});
								}
							} else {
								set_ticket_with_index(index, {
									...ticket_type,
									number_of_tickets: "",
								});
							}
						}}
					/>
					{displayErrors && Number.isNaN(ticket_type.number_of_tickets) && (
						<ErrorMessage message={"This field is required!"} />
					)}
					{displayErrors && !Number.isNaN(ticket_type.number_of_tickets) && ticket_type.number_of_tickets <= 0 && (
						<ErrorMessage message={"You need more than 0 tickets!"} />
					)}
				</div>
			</div>
			<div className={styles.dateInputRow}>
				<div className={styles.inputContainer}>
					<h3>What time would you like to release your tickets?</h3>
					<div className="flex w-full flex-col">
						<div className={styles.date_selector}>
							<DateSelector
								selectedDate={ticket_type.release_time}
								handleDateChange={(value: Date) => {
									const now = new Date();
									if (value < now) {
										set_ticket_with_index(index, {
											...ticket_type,
											release_time: now,
										});
									} else {
										set_ticket_with_index(index, {
											...ticket_type,
											release_time: value,
										});
									}
								}}
								dateFormat="MM/dd/yyyy"
								width={200}
								minDate={new Date()}
							/>
							<div className={styles.date_wrapper}>
								<TimePicker
									selectedTime={ticket_type.release_time}
									handleTimeChange={(value: Date) =>
										set_ticket_with_index(index, {
											...ticket_type,
											release_time: value,
										})
									}
									width={200}
									minTime={new Date()}
								/>
							</div>
						</div>
						{displayErrors && ticket_type.release_time > event.event_start_time && (
							<ErrorMessage message="You cannot release tickets after the event start time!" />
						)}
					</div>
					{renderErrors("release_time")}
				</div>
				<div className={styles.inputContainer}>
					<h3>What time would you like to stop ticket sales?</h3>
					<div className={styles.date_selector}>
						<DateSelector
							selectedDate={ticket_type.stop_sale_time}
							handleDateChange={(value: Date) =>
								set_ticket_with_index(index, {
									...ticket_type,
									stop_sale_time: value,
								})
							}
							dateFormat="MM/dd/yyyy"
							width={200}
							minDate={ticket_type.release_time}
						/>
						<div className={styles.date_wrapper}>
							<TimePicker
								selectedTime={ticket_type.stop_sale_time}
								handleTimeChange={(value: Date) =>
									set_ticket_with_index(index, {
										...ticket_type,
										stop_sale_time: value,
									})
								}
								width={200}
							/>
						</div>
					</div>
					{renderErrors("stop_sale_time")}
				</div>
			</div>
			<div className={styles.radio}>
				<RadioComponent options={Message_Options} title={"Do you want a custom message on this ticket?"} index={index} />
			</div>
			{ticket_type.custom_ticket_message !== undefined && (
				<div className={styles.inputContainerCenter}>
					<div className="my-[10px] flex w-full flex-col items-center">
						<h3>Custom Message Title</h3>
						<InputBox
							value={ticket_type.custom_ticket_message.title}
							onChange={(value: string) =>
								set_ticket_with_index(index, {
									...ticket_type,
									custom_ticket_message: {
										...ticket_type.custom_ticket_message,
										title: value,
									},
								})
							}
						/>
						{displayErrors && ticket_type.custom_ticket_message.title === "" && (
							<ErrorMessage message={"This field cannot be empty!"} />
						)}
					</div>
					<div className="my-[10px] flex w-full flex-col items-center">
						<h3>Custom Message Content</h3>
						<TextAreaInputBox
							value={ticket_type.custom_ticket_message.content}
							onChange={(value: string) =>
								set_ticket_with_index(index, {
									...ticket_type,
									custom_ticket_message: {
										...ticket_type.custom_ticket_message,
										content: value,
									},
								})
							}
						/>
						{displayErrors && ticket_type.custom_ticket_message.content === "" && (
							<ErrorMessage message={"This field cannot be empty!"} />
						)}
					</div>
				</div>
			)}
			<div className={styles.radio}>
				<RadioComponent options={SeatHoldingOptions} title={"Do you want to hold seats?"} index={index} />
			</div>
			{ticket_type.seat_holds !== undefined && (
				<>
					<div className={styles.inputContainerCenter}>
						<h3>How many seats would you like to hold?</h3>
						<InputBox
							type={"number"}
							min={1}
							max={1000000}
							maxLength={8}
							pattern={"/^[0-9]*(.[0-9]+)?$/"}
							onChange={(value: string) => {
								const num: number = Number(value);

								if (!isNaN(num) && num >= 0) {
									if (value.length <= 7) {
										set_ticket_with_index(index, {
											...ticket_type,
											seat_holds: {
												...ticket_type.seat_holds,
												num_seat_holds: num,
											},
										});
									}
								} else {
									set_ticket_with_index(index, {
										...ticket_type,
										seat_holds: {
											...ticket_type.seat_holds,
											num_seat_holds: "",
										},
									});
								}
							}}
						/>
						{displayErrors && ticket_type.seat_holds.num_seat_holds > ticket_type.number_of_tickets && (
							<ErrorMessage message={"You cannot hold more seats than tickets!"} />
						)}
						{displayErrors &&
							!Number.isNaN(ticket_type.seat_holds.num_seat_holds) &&
							ticket_type.seat_holds?.num_seat_holds <= 0 && <ErrorMessage message={"You need more than 0 seats!"} />}
					</div>
					<div className={styles.inputContainerCenter}>
						<h3>How would you like to release these tickets?</h3>
						<Dropdown
							options={[
								{ value: SeatHoldsReleaseType.none, label: "Indefinitely" },
								{ value: SeatHoldsReleaseType.timed, label: "At a scheduled time." },
								{ value: SeatHoldsReleaseType.ticket, label: "After a selected ticket type has sold out." },
							]}
							renderOption={(option: any, index: number) => {
								const { value, label } = option;

								return (
									<option value={value} key={index}>
										{label}
									</option>
								);
							}}
							value={ticket_type.seat_holds?.seat_holds_release_type}
							onChange={(value: string) => {
								const temp_ticket_type = { ...ticket_type };
								if (value === SeatHoldsReleaseType.none) {
									delete temp_ticket_type?.seat_holds?.seat_hold_release_time;
									delete temp_ticket_type?.seat_holds?.seat_hold_release_ticket_type_id;
								}
								if (value === SeatHoldsReleaseType.timed) {
									delete temp_ticket_type?.seat_holds?.seat_hold_release_time;
								}
								if (value === SeatHoldsReleaseType.ticket) {
									delete temp_ticket_type?.seat_holds?.seat_hold_release_ticket_type_id;
								}
								set_ticket_with_index(index, {
									...temp_ticket_type,
									seat_holds: {
										...temp_ticket_type.seat_holds,
										seat_holds_release_type: value,
									},
								});
							}}
						/>
					</div>
					{displayErrors && !ticket_type.seat_holds?.seat_holds_release_type && (
						<ErrorMessage message={"This field is required!"} />
					)}
					{ticket_type.seat_holds.seat_holds_release_type === SeatHoldsReleaseType.timed && (
						<div className={styles.inputContainerCenter}>
							<h3>When would you like to release these tickets?</h3>
							<div className={styles.releaseDateRow}>
								<DateSelector
									selectedDate={ticket_type.seat_holds?.seat_hold_release_time}
									handleDateChange={(value: Date) => {
										set_ticket_with_index(index, {
											...ticket_type,
											seat_holds: {
												...ticket_type.seat_holds,
												seat_hold_release_time: value,
											},
										});
									}}
									dateFormat="MM/dd/yyyy"
									width={200}
									minDate={new Date()}
								/>
								<TimePicker
									selectedTime={
										ticket_type.seat_holds.seat_hold_release_time
											? ticket_type.seat_holds.seat_hold_release_time
											: new Date()
									}
									handleTimeChange={(value: Date) => {
										set_ticket_with_index(index, {
											...ticket_type,
											seat_holds: {
												...ticket_type.seat_holds,
												seat_hold_release_time: value,
											},
										});
									}}
									minTime={new Date()}
								/>
							</div>
							{displayErrors && ticket_type.seat_holds?.seat_hold_release_time === undefined && (
								<ErrorMessage message={"This field is required!"} />
							)}
						</div>
					)}
					{ticket_type.seat_holds.seat_holds_release_type === SeatHoldsReleaseType.ticket && (
						<div className={styles.inputContainerCenter}>
							<h3>Which ticket type would you like to release these tickets after?</h3>
							<Dropdown
								default_option={<option value={""}>Please select an option.</option>}
								options={all_ticket_types}
								placeholder={"Select a ticket type."}
								renderOption={(option: any, index: number) => {
									return (
										<option key={index} value={option?._id?.toHexString()}>
											{option.ticket_name || "Unnamed Ticket"}
										</option>
									);
								}}
								value={ticket_type.seat_holds.seat_hold_release_ticket_type_id?.toHexString() || undefined}
								onChange={(value: string) => {
									if (value === "") {
										set_ticket_with_index(index, {
											...ticket_type,
											seat_holds: {
												...ticket_type.seat_holds,
												seat_hold_release_ticket_type_id: undefined,
											},
										});
									} else {
										set_ticket_with_index(index, {
											...ticket_type,
											seat_holds: {
												...ticket_type.seat_holds,
												seat_hold_release_ticket_type_id: ObjectID.createFromHexString(value),
											},
										});
									}
								}}
							/>

							{displayErrors && ticket_type.seat_holds?.seat_hold_release_ticket_type_id === undefined && (
								<ErrorMessage message={"This field is required!"} />
							)}
							{displayErrors &&
								ticket_type.seat_holds?.seat_hold_release_ticket_type_id?.toHexString() ===
									ticket_type?._id?.toHexString() && (
									<ErrorMessage message={"You cannot release tickets after the same ticket type!"} />
								)}
						</div>
					)}
				</>
			)}
		</div>
	);
};

export default TicketTypeInput;
