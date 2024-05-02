import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import Loader from "partials/loader/loader";

import DateSelector from "../../../create_event/components/date_selector/date_selector";
import Dropdown from "components/dropdown";
import ErrorMessage from "components/error_message";
import Modal from "components/modal/modal";
import SmallButton from "components/small_button/small_button";

import styles from "./index.module.css";

import { format_date } from "../books";

export enum ModalTypes {
	Event = "event",
	Range = "range",
	None = "none",
}

export type Payload = {
	statement_type?: ModalTypes;
	event_id?: string;
	org_id?: string;
	start_date?: Date;
	end_date?: Date;
};

type Props = {
	warning: string;
	event_options: Array<EventCreate>;
	onSubmit: Function;
	onExit: Function;
};

const default_payload: Payload = {
	statement_type: ModalTypes.None,
	event_id: undefined,
	org_id: undefined,
	start_date: undefined,
	end_date: undefined,
};

const AccountingStatementModal = ({ warning, onSubmit, onExit, event_options }: Props) => {
	const {
		clearErrors,
		formState: { errors },
		getValues,
		handleSubmit,
		register,
		reset,
		setValue,
	} = useForm<Payload>({
		defaultValues: default_payload,
		mode: "onSubmit",
		reValidateMode: "onSubmit",
	});

	const [loading, set_loading] = useState<boolean>(false);

	const statement_options: Array<{ value: ModalTypes; label: string }> = [
		{ value: ModalTypes.None, label: "None" },
		{ value: ModalTypes.Event, label: "Event Accounting Statement" },
		{ value: ModalTypes.Range, label: "Date Range Accounting Statement" },
	];

	const set_end_date = (value: Date) => {
		const date: Date = new Date(value);
		const start_date = getValues("start_date");

		if (!start_date || (start_date && date > start_date)) {
			setValue("end_date", date);
			clearErrors("end_date");
			return;
		}

		const start_date_day = start_date.getDate();
		const start_date_month = start_date.getMonth();
		const start_date_year = start_date.getFullYear();
		let default_end_date = new Date(start_date_year, start_date_month, start_date_day + 1);

		if (default_end_date >= new Date()) {
			const default_start_date = new Date(start_date_year, start_date_month, start_date_day - 1);
			default_end_date = new Date(start_date_year, start_date_month, start_date_day);

			setValue("start_date", default_start_date);
			setValue("end_date", default_end_date);
			clearErrors("start_date");
			clearErrors("end_date");
		} else {
			setValue("end_date", default_end_date);
			clearErrors("end_date");
		}
	};

	const set_start_date = (value: Date) => {
		const date: Date = new Date(value);
		const end_date = getValues("end_date");

		if (!end_date || (end_date && date < end_date)) {
			setValue("start_date", date);
			clearErrors("start_date");
			return;
		}

		const end_date_day = end_date.getDate();
		const end_date_month = end_date.getMonth();
		const end_date_year = end_date.getFullYear();
		const default_start_date = new Date(end_date_year, end_date_month, end_date_day - 1);

		setValue("start_date", default_start_date);
		clearErrors("start_date");
	};

	const validate_payload = () => {
		const accounting_statement_config: Payload = getValues();
		const { start_date, end_date, event_id } = accounting_statement_config;

		return (start_date && end_date) || event_id;
	};

	const validate_submission = (payload: FieldValues) => {
		set_loading(true);
		validate_payload() && onSubmit(payload);
	};

	const AccountingStatementOptions = () => {
		switch (getValues("statement_type")) {
			case ModalTypes.Event: {
				return (
					<div className={styles.event_selection_wrapper}>
						<h3>Event:</h3>
						<Dropdown
							{...register("event_id", {
								required: "An event needs to be selected!",
							})}
							value={getValues("event_id")}
							options={[{ name: "None" }].concat(event_options)}
							onChange={(value: string) => {
								setValue("event_id", value);
								clearErrors("event_id");
							}}
							renderOption={(option: any, index: number) => {
								const { _id, name, location, event_start_time } = option;

								if (name === "None") {
									return (
										<option value={name} key={index}>
											{name}
										</option>
									);
								}

								return (
									<option value={_id} key={index}>
										{name + " / " + location.name + " / " + format_date(event_start_time)}
									</option>
								);
							}}
						/>
						{errors.event_id?.message && <ErrorMessage message={errors.event_id.message} />}
					</div>
				);
			}
			case ModalTypes.Range: {
				return (
					<div className={styles.dates_wrapper}>
						<div className={styles.date_wrapper}>
							<h3>Start Date:</h3>
							<DateSelector
								{...register("start_date", {
									required: "A start date needs to be selected!",
								})}
								selectedDate={getValues("start_date")}
								handleDateChange={(value: Date) => set_start_date(value)}
								dateFormat="MM/dd/yyyy"
								maxDate={new Date()}
							/>
							{errors.start_date?.message && <ErrorMessage message={errors.start_date.message} />}
						</div>
						<div className={styles.date_wrapper}>
							<h3>End Date:</h3>
							<DateSelector
								{...register("end_date", {
									required: "An end date needs to be selected!",
								})}
								selectedDate={getValues("end_date")}
								handleDateChange={(value: Date) => set_end_date(value)}
								dateFormat="MM/dd/yyyy"
								maxDate={new Date()}
							/>
							{errors.end_date?.message && <ErrorMessage message={errors.end_date.message} />}
						</div>
					</div>
				);
			}
			default: {
				return <></>;
			}
		}
	};

	if (loading && !warning) {
		return (
			<Modal onExit={onExit}>
				<div
					style={{
						height: "235px",
						width: "470px",
						marginTop: "75px",
					}}
				>
					<Loader />
				</div>
			</Modal>
		);
	} else if (loading && warning) {
		set_loading(false);
	}

	return (
		<Modal
			onExit={() => {
				reset();
				onExit();
			}}
		>
			<div className={"flex w-[470px] flex-col items-center"}>
				<h1 className={"my-[15px]"}>Generate Statement</h1>
				<Dropdown
					{...register("statement_type", {
						required: "The statement type needs to be selected!",
					})}
					options={statement_options}
					onChange={(value: string) => {
						if (getValues() !== default_payload) {
							reset();
						}

						if (value === ModalTypes.Event || value === ModalTypes.Range) {
							setValue("statement_type", value);
							clearErrors("statement_type");
						} else {
							setValue("statement_type", ModalTypes.None);
							clearErrors("statement_type");
						}
					}}
					renderOption={(option: any, index: number) => {
						const { value, label } = option;
						return <option value={value}>{label}</option>;
					}}
				/>
				<form className={styles.forms_wrapper} onSubmit={handleSubmit(validate_submission)}>
					{getValues("statement_type") !== ModalTypes.None && <AccountingStatementOptions />}
					{warning && <ErrorMessage message={warning} />}
					<SmallButton disabled={!validate_payload()}>Submit</SmallButton>
				</form>
			</div>
		</Modal>
	);
};

export default AccountingStatementModal;
