import { useEffect, useState } from "react";
import { TokenResult } from "@stripe/stripe-js";

import BankAccountCard from "./bank_account_card/bank_account_card";
import Dropdown from "components/dropdown";
import ErrorMessage from "components/error_message";
import InputBox from "components/input_box";
import Loader from "partials/loader/loader";
import SmallButton from "components/small_button/small_button";
import TextButton from "components/text_button";

import { api } from "axiosClients/client";

import { useUser } from "../../../../../../../../state/useUser";
import { use_accounting } from "state/admin/accounting";
import { use_stripe } from "state/use_stripe";

import styles from "./banking.module.css";
import common from "../../../../../../../../common/css/common.module.css";
import color_palette from "../../../../../../../../common/types/colors";

import add_button from "../../../../../../../../common/icons/add_button.svg";

import { AccountingStatementInterval } from "common";

type BankingInfo = {
	routing_number: string;
	account_number: string;
	confirm_account_number: string;
};

type Warnings = {
	acc_delete: boolean;
	acc_warn: boolean;
	confirm_acc_warn: boolean;
	route_warn: boolean;
	upload: boolean;
	add: boolean;
	email: boolean;
	financial_settings: boolean;
};

enum PayoutSchedules {
	default = "",
	day = "daily",
	week = "weekly",
	month = "monthly",
}

type NewPayoutSchedule = {
	schedule: PayoutSchedules | string | undefined;
	date_or_day: string | number | undefined;
	payout_destination: string | undefined;
};

type AccountingStatement = {
	interval: AccountingStatementInterval | undefined;
	email_address: string | undefined;
};

const default_bank_account_info: BankingInfo = {
	routing_number: "",
	account_number: "",
	confirm_account_number: "",
};

const default_warnings: Warnings = {
	acc_delete: false,
	acc_warn: false,
	confirm_acc_warn: false,
	route_warn: false,
	upload: false,
	add: false,
	email: false,
	financial_settings: false,
};

const Banking = () => {
	const { user_organization, set_user_organization } = useUser((state) => ({
		user_organization: state.userOrganization,
		set_user_organization: state.setUserOrganization,
	}));

	const { bank_accounts, payouts_schedule, statement_interval, set_payout_settings, set_statement_interval, set_bank_accounts } =
		use_accounting((state) => ({
			bank_accounts: state.bank_accounts,
			payouts_schedule: state.payouts_schedule,
			statement_interval: state.statement_interval,
			set_payout_settings: state.set_payout_settings,
			set_statement_interval: state.set_statement_interval,
			set_bank_accounts: state.set_bank_accounts,
		}));

	const default_new_payout_schedule: NewPayoutSchedule = {
		schedule: payouts_schedule?.schedule.interval,
		date_or_day: undefined,
		payout_destination: undefined,
	};

	const default_new_accounting_statement: AccountingStatement = {
		interval: undefined,
		email_address: undefined,
	};

	const [add_bank_account, set_add_bank_account] = useState<boolean>(false);
	const [warn, set_warn] = useState<Warnings>(default_warnings);
	const [warning_message, set_warning_message] = useState<string>("");
	const [bank_account_information, set_bank_account_information] = useState<BankingInfo>(default_bank_account_info);
	const [current_bank_accounts, set_current_bank_accounts] = useState<Array<BankAccount> | undefined>(bank_accounts);
	const [new_payout_schedule, set_new_payout_schedule] = useState<NewPayoutSchedule | undefined>(undefined);
	const [new_accounting_statement_schedule, set_new_accounting_statement_schedule] = useState<AccountingStatement | undefined>(
		undefined
	);
	const stripe = use_stripe((state) => state.get_stripe_instance());
	const [payout, set_payout] = useState<PayoutObject | undefined>(payouts_schedule);
	const [edit, set_edit] = useState<boolean>(false);
	const [loading, set_loading] = useState<boolean>(false);
	const [delete_loading, set_delete_loading] = useState<boolean>(false);

	const payout_options: Array<{ value: PayoutSchedules; label: string }> = [
		{ value: PayoutSchedules.default, label: "None" },
		{ value: PayoutSchedules.day, label: "Daily" },
		{ value: PayoutSchedules.week, label: "Weekly" },
		{ value: PayoutSchedules.month, label: "Monthly" },
	];
	const payout_dates: Array<{ value: number; label: string }> = [
		{ value: 0, label: "None" },
		{ value: 1, label: "1st" },
		{ value: 2, label: "2nd" },
		{ value: 3, label: "3rd" },
		{ value: 4, label: "4th" },
		{ value: 5, label: "5th" },
		{ value: 6, label: "6th" },
		{ value: 7, label: "7th" },
		{ value: 8, label: "8th" },
		{ value: 9, label: "9th" },
		{ value: 10, label: "10th" },
		{ value: 11, label: "11th" },
		{ value: 12, label: "12th" },
		{ value: 13, label: "13th" },
		{ value: 14, label: "14th" },
		{ value: 15, label: "15th" },
		{ value: 16, label: "16th" },
		{ value: 17, label: "17th" },
		{ value: 18, label: "18th" },
		{ value: 19, label: "19th" },
		{ value: 20, label: "20th" },
		{ value: 21, label: "21st" },
		{ value: 22, label: "22nd" },
		{ value: 23, label: "23rd" },
		{ value: 24, label: "24th" },
		{ value: 25, label: "25th" },
		{ value: 26, label: "26th" },
		{ value: 27, label: "27th" },
		{ value: 28, label: "28th" },
		{ value: 29, label: "29th" },
		{ value: 30, label: "30th" },
		{ value: 31, label: "31st" },
	];
	const payout_days: Array<{ value: number | string; label: string }> = [
		{ value: 0, label: "None" },
		{ value: "sunday", label: "Sunday" },
		{ value: "monday", label: "Monday" },
		{ value: "tuesday", label: "Tuesday" },
		{ value: "wednesday", label: "Wednesday" },
		{ value: "thursday", label: "Thursday" },
		{ value: "friday", label: "Friday" },
		{ value: "saturday", label: "Saturday" },
	];
	const statement_intervals: Array<{ value: AccountingStatementInterval; label: string }> = [
		{ value: AccountingStatementInterval.weekly, label: "Weekly" },
		{ value: AccountingStatementInterval.monthly, label: "Monthly" },
		{ value: AccountingStatementInterval.yearly, label: "Yearly" },
	];

	// placed error handling stuff into a function to readability
	const all_fields_entered = () => {
		return (
			!warn.acc_warn &&
			// !warn.name_warn &&
			!warn.confirm_acc_warn &&
			!warn.route_warn &&
			// bank_account_information.bank_name.length > 0 &&
			bank_account_information.account_number.length > 0 &&
			bank_account_information.confirm_account_number.length > 0 &&
			bank_account_information.routing_number.length > 0
		);
	};

	const handle_acc_num = (acc_num: string) => {
		let formatted_acc_num = acc_num;

		// 17 is the max account number length
		if (formatted_acc_num.length > 17) {
			formatted_acc_num = formatted_acc_num.slice(0, 17);
		}

		formatted_acc_num = formatted_acc_num.replace(/\D/g, "");

		set_bank_account_information({
			...bank_account_information,
			account_number: formatted_acc_num,
		});

		set_warn({
			...warn,
			acc_warn: formatted_acc_num.length < 8,
			confirm_acc_warn: formatted_acc_num !== bank_account_information.confirm_account_number,
		});
	};

	const handle_confirm_acc_num = (acc_num: string) => {
		let formatted_conf_acc_num = acc_num;

		// 17 is the max account number length
		if (formatted_conf_acc_num.length > 17) {
			formatted_conf_acc_num = formatted_conf_acc_num.slice(0, 17);
		}

		formatted_conf_acc_num = formatted_conf_acc_num.replace(/\D/g, "");

		set_warn({
			...warn,
			confirm_acc_warn: formatted_conf_acc_num !== bank_account_information.account_number,
		});

		set_bank_account_information({
			...bank_account_information,
			confirm_account_number: formatted_conf_acc_num,
		});
	};

	const handle_routing_num = (routing_num: string) => {
		let formatted_routing_num = routing_num;

		// 9 is the max routing number length
		if (formatted_routing_num.length > 9) {
			formatted_routing_num = formatted_routing_num.slice(0, 9);
		}

		formatted_routing_num = formatted_routing_num.replace(/\D/g, "");

		set_warn({
			...warn,
			route_warn: formatted_routing_num.length < 9,
		});

		set_bank_account_information({
			...bank_account_information,
			routing_number: formatted_routing_num,
		});
	};

	const delete_bank_account = async (id: string) => {
		set_delete_loading(true);

		set_warn({
			...warn,
			acc_delete: false,
		});

		const acc_id: string = user_organization.stripe_conn_id;

		const { data } = await api.post("/delete_stripe_bank_account", {
			acc_id,
			bank_acc_id: id,
		});

		const { success } = data;

		if (success) {
			let current_bank_accounts_copy: Array<BankAccount> | any = new Array(current_bank_accounts)[0];

			current_bank_accounts_copy = current_bank_accounts_copy.filter((bank_account: BankAccount) => bank_account.id !== id);

			set_current_bank_accounts(current_bank_accounts_copy);
			set_bank_accounts(current_bank_accounts_copy);
		} else {
			set_warn({
				...warn,
				acc_delete: true,
			});
		}

		set_delete_loading(false);
	};

	const fetch_bank_accounts = async () => {
		const acc_id: string = user_organization.stripe_conn_id;

		if (acc_id) {
			set_statement_interval(user_organization.financial_settings);
			set_loading(true);

			const { data } = await api.post("/retrieve_stripe_bank_accounts", { acc_id });

			const { payload } = data;

			const payout_destination = payload.bank_accounts.filter(
				(bank_account: BankAccount) => bank_account.default_for_currency
			)[0];

			if (payload) {
				set_bank_accounts(payload.bank_accounts);
				set_current_bank_accounts(payload.bank_accounts);

				set_payout_settings({
					...payload.payouts,
					payout_destination: payout_destination?.id,
				});
				set_payout({
					...payload.payouts,
					payout_destination: payout_destination?.id,
				});

				set_loading(false);
			} else {
				set_current_bank_accounts([]);
				set_bank_accounts([]);
				set_payout_settings(undefined);
				set_payout(undefined);
				set_loading(false);
			}
		} else {
			set_current_bank_accounts([]);
			set_bank_accounts([]);
			set_payout_settings(undefined);
			set_payout(undefined);
		}
	};

	const handle_financial_settings_change = async () => {
		let payload = undefined;
		// const interval = user_organization?.financial_settings?.interval;
		// const email_address = user_organization?.financial_settings?.email_address;

		if (new_payout_schedule) {
			const { schedule, date_or_day, payout_destination } = new_payout_schedule;

			if (schedule === PayoutSchedules.day && !date_or_day) {
				payload = {
					new_payout_destination: payout_destination ?? undefined,
					payouts: {
						schedule: {
							delay_days: 2,
							interval: schedule,
						},
					},
				};
			} else if ((schedule === PayoutSchedules.week || schedule === PayoutSchedules.month) && date_or_day) {
				payload = {
					new_payout_destination: payout_destination ?? undefined,
					payouts: {
						schedule: {
							[`${schedule}_anchor`]: date_or_day,
							interval: schedule,
						},
					},
				};
			} else if (payout_destination) {
				payload = {
					new_payout_destination: payout_destination,
				};
			}
		}

		if (new_accounting_statement_schedule) {
			const { interval, email_address } = new_accounting_statement_schedule;

			if (interval && Object.values(AccountingStatementInterval).includes(interval)) {
				const new_email_address: string | undefined = email_address ?? statement_interval?.email_address ?? undefined;

				payload
					? (payload = {
							...payload,
							statement_timing: {
								email_address: new_email_address,
								interval: interval,
							},
					  })
					: (payload = {
							statement_timing: {
								email_address: new_email_address,
								interval: interval,
							},
					  });
			} else if (email_address) {
				const current_interval: string | undefined = statement_interval?.interval ?? undefined;

				payload
					? (payload = {
							...payload,
							statement_timing: {
								email_address: email_address,
								interval: current_interval,
							},
					  })
					: (payload = {
							statement_timing: {
								email_address: email_address,
								interval: current_interval,
							},
					  });
			}
		}

		const { stripe_conn_id, _id } = user_organization;

		if (payload && _id && stripe_conn_id) {
			set_loading(true);

			payload = {
				...payload,
				org_id: _id,
				acc_id: stripe_conn_id,
			};

			const res = await api.post("/update_financial_settings", payload);

			const { financial_settings, payouts, payout_destination_updated } = res.data;

			if ((!financial_settings && !payouts && !payout_destination_updated) || res.data.error) {
				set_warn({ ...warn, financial_settings: true });

				set_loading(false);

				return;
			}

			if (payouts) {
				const payout_destination = current_bank_accounts?.filter(
					(bank_account: BankAccount) => bank_account.default_for_currency
				)[0];

				set_payout({
					...payouts,
					payout_destination: payout_destination?.id,
				});
				set_payout_settings({
					...payouts,
					payout_destination: payout_destination?.id,
				});

				set_new_payout_schedule(undefined);
			}

			if (financial_settings) {
				let new_user_organization = user_organization;

				const new_interval = {
					interval: financial_settings.interval,
					email_address: financial_settings.email_address,
				};

				new_user_organization["financial_settings"] = new_interval;

				set_user_organization(new_user_organization);
				set_statement_interval(new_interval);

				set_new_accounting_statement_schedule(undefined);
				set_new_payout_schedule(undefined);
			}

			set_edit(false);
			fetch_bank_accounts();
			set_loading(false);
		} else {
			set_warn({
				...warn,
				financial_settings: true,
			});
		}
	};

	const handle_submit = async () => {
		set_warn({
			...warn,
			upload: false,
			add: false,
		});
		set_warning_message("");
		set_loading(true);

		const { routing_number, account_number } = bank_account_information;

		let response: TokenResult = await stripe.createToken("bank_account", {
			country: "US",
			currency: "usd",
			routing_number: routing_number,
			account_number: account_number,
			account_holder_name: user_organization.name,
			account_holder_type: "company",
		});

		const { token } = response;

		if (!token) {
			set_warn({
				...warn,
				upload: true,
			});

			if (response?.error?.message) {
				set_warning_message(`Could add new bank account. Failed with error message: ${response.error.message}`);
			}

			set_loading(false);

			return;
		}

		const acc_id: string = user_organization.stripe_conn_id;

		const { data } = await api.post("/add_new_bank_account", {
			acc_id,
			bank_acc_id: token.id,
		});

		if (!data.added) {
			set_warn({
				...warn,
				add: true,
			});

			set_loading(false);

			return;
		}

		set_bank_account_information(default_bank_account_info);
		set_warn(default_warnings);
		set_loading(false);
		fetch_bank_accounts();
		set_add_bank_account(false);
	};

	const render_payout_day = (type: string) => {
		switch (type) {
			case "day": {
				return (
					(new_payout_schedule?.schedule === PayoutSchedules.week && edit) ||
					(payout?.schedule.interval === "weekly" && payout?.schedule.weekly_anchor && !new_payout_schedule)
				);
			}
			case "date": {
				return (
					(new_payout_schedule?.schedule === PayoutSchedules.month && edit) ||
					(payout?.schedule.interval === "monthly" && payout?.schedule.monthly_anchor && !new_payout_schedule)
				);
			}
		}
	};

	useEffect(() => {
		if (!bank_accounts || !payouts_schedule) {
			fetch_bank_accounts();
		}
	}, []);

	const BankAccountSection = () => {
		if (delete_loading) {
			return (
				<div className={"min-h-[150px] w-full"}>
					<Loader />
				</div>
			);
		}

		return (
			<div className={styles.bank_account_list}>
				{current_bank_accounts && current_bank_accounts.length ? (
					current_bank_accounts.map((bank_account: BankAccount, index: number) => {
						return (
							<div key={index} className={"w-full"}>
								<BankAccountCard
									payout_destination={bank_account.default_for_currency}
									bank_account={bank_account}
									num_bank_accounts={current_bank_accounts.length}
									onDelete={(id: string) => delete_bank_account(id)}
								/>
							</div>
						);
					})
				) : (
					<h3>
						{user_organization.stripe_conn_id
							? `No Bank Account Added. Click the "plus" button in the top right to add one!`
							: `You are not currently signed up for paid events! Please contact us if you'd like to sign up!`}
					</h3>
				)}
			</div>
		);
	};

	if (loading) {
		return (
			<div className={"mt-[100px] h-[400px] w-full"}>
				<Loader />
			</div>
		);
	}

	if (!loading && add_bank_account) {
		return (
			<div className={"flex w-full flex-col items-start"}>
				<div className={styles.input_container}>
					<p className={common.common_bold}>Account Number:</p>
					<InputBox
						value={bank_account_information.account_number}
						onChange={(value: string) => handle_acc_num(value)}
						maxLength={17}
					/>
					{warn.acc_warn && <ErrorMessage message={"Please enter a valid account number."} />}
				</div>
				<div className={styles.input_container}>
					<p className={common.common_bold}>Confirm Account Number:</p>
					<InputBox
						value={bank_account_information.confirm_account_number}
						onChange={(value: string) => handle_confirm_acc_num(value)}
						maxLength={17}
					/>
					{warn.confirm_acc_warn && <ErrorMessage message={"Please make sure both inputted account numbers match."} />}
				</div>
				<div className={styles.input_container}>
					<p className={common.common_bold}>Routing Number:</p>
					<InputBox
						value={bank_account_information.routing_number}
						onChange={(value: string) => handle_routing_num(value)}
						maxLength={9}
					/>
					{warn.route_warn && <ErrorMessage message={"Please enter a valid routing number."} />}
				</div>
				<div className={styles.button_center_container}>
					<SmallButton
						onClick={() => {
							set_add_bank_account(false);

							set_bank_account_information(default_bank_account_info);

							set_warn(default_warnings);
						}}
					>
						Exit
					</SmallButton>
					<SmallButton
						onClick={() =>
							// lots of disgusting error checking
							all_fields_entered() && handle_submit()
						}
						disabled={!all_fields_entered()}
					>
						Submit
					</SmallButton>
				</div>
				<div className={"mt-6 w-full"}>
					{warn.upload && (
						<ErrorMessage
							message={
								!warning_message
									? "Failed to create new bank account. Please ensure all information was entered correctly."
									: warning_message
							}
						/>
					)}
					{warn.add && (
						<ErrorMessage message={"Could not add bank account to your financial account. Please contact us."} />
					)}
				</div>
			</div>
		);
	}

	return (
		<div className={"mb-10 flex w-full flex-col items-start"}>
			<div className={styles.bank_accounts}>
				{current_bank_accounts && current_bank_accounts.length > 0 && (
					<div className={styles.banking_settings_section}>
						<div className={styles.banking_header_section}>
							<h1 className={styles.bank_account_header}>Financial Settings</h1>
							{!edit ? (
								<TextButton
									className={"m-0 w-[6%] text-left font-custom text-md-header font-bold hover:cursor-pointer"}
									onClick={() => {
										set_edit(true);
										set_new_payout_schedule(default_new_payout_schedule);
										set_new_accounting_statement_schedule(default_new_accounting_statement);
									}}
									label={"Edit"}
								/>
							) : (
								<div className={styles.edit_options}>
									<TextButton
										className={"m-0 w-[50%] text-left font-custom text-sm-header font-bold hover:cursor-pointer"}
										onClick={() => !warn.email && handle_financial_settings_change()}
										label={"Save"}
									/>
									<TextButton
										className={"m-0 w-[50%] text-left font-custom text-sm-header font-bold hover:cursor-pointer"}
										onClick={() => {
											set_new_payout_schedule(undefined);
											set_new_accounting_statement_schedule(undefined);

											if (warn.financial_settings) {
												set_warn({
													...warn,
													financial_settings: false,
												});
											}

											set_edit(false);
										}}
										label={"Cancel"}
									/>
								</div>
							)}
						</div>
						<h2 className={styles.bank_account_header}>Payouts</h2>
						<div className={styles.payout_section_row}>
							<div className={styles.payout_schedule_section}>
								<h3 className={styles.bank_account_header}>Payout Schedule:</h3>
								<Dropdown
									options={payout_options}
									value={new_payout_schedule?.schedule ?? payout?.schedule.interval}
									onChange={(value: PayoutSchedules) => {
										if (warn.financial_settings) {
											set_warn({
												...warn,
												financial_settings: false,
											});
										}

										new_payout_schedule
											? set_new_payout_schedule({
													...new_payout_schedule,
													schedule: value,
													date_or_day: undefined,
											  })
											: set_new_payout_schedule({
													payout_destination: undefined,
													schedule: value,
													date_or_day: undefined,
											  });
									}}
									renderOption={(option: any, index: number) => {
										const { value, label } = option;

										if (label === "None") {
											return (
												<option value={value} key={index} disabled={true}>
													{label}
												</option>
											);
										}

										return (
											<option value={value} key={index + 1}>
												{label}
											</option>
										);
									}}
									disabled={!edit}
								/>
							</div>
							{render_payout_day("date") && (
								<div className={styles.payout_schedule_section}>
									<h3 className={styles.bank_account_header}>Payout Date:</h3>
									<Dropdown
										options={payout_dates}
										value={new_payout_schedule?.date_or_day ?? payout?.schedule.monthly_anchor}
										onChange={(value: string) => {
											if (warn.financial_settings) {
												set_warn({
													...warn,
													financial_settings: false,
												});
											}

											new_payout_schedule
												? set_new_payout_schedule({
														...new_payout_schedule,
														date_or_day: value,
												  })
												: set_new_payout_schedule({
														schedule: undefined,
														date_or_day: value,
														payout_destination: undefined,
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
										disabled={!edit}
									/>
								</div>
							)}
							{render_payout_day("day") && (
								<div className={styles.payout_schedule_section}>
									<h3 className={styles.bank_account_header}>Payout Day:</h3>
									<Dropdown
										options={payout_days}
										value={new_payout_schedule?.date_or_day ?? payout?.schedule.weekly_anchor}
										onChange={(value: string) => {
											if (warn.financial_settings) {
												set_warn({
													...warn,
													financial_settings: false,
												});
											}

											new_payout_schedule
												? set_new_payout_schedule({
														...new_payout_schedule,
														date_or_day: value,
												  })
												: set_new_payout_schedule({
														schedule: undefined,
														date_or_day: value,
														payout_destination: undefined,
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
										disabled={!edit}
									/>
								</div>
							)}
						</div>
						<div className={styles.payout_section_row} style={{ marginTop: "20px", marginBottom: "10px" }}>
							<div className={styles.payout_destination_section}>
								<h3 className={styles.bank_account_header}>Payout Destination:</h3>
								{current_bank_accounts && (
									<Dropdown
										options={current_bank_accounts}
										value={new_payout_schedule?.payout_destination ?? payout?.payout_destination}
										onChange={(value: string) => {
											if (warn.financial_settings) {
												set_warn({
													...warn,
													financial_settings: false,
												});
											}

											new_payout_schedule
												? set_new_payout_schedule({
														...new_payout_schedule,
														payout_destination: value,
												  })
												: set_new_payout_schedule({
														schedule: undefined,
														date_or_day: undefined,
														payout_destination: value,
												  });
										}}
										renderOption={(option: any, index: number) => {
											const { id, bank_name, last4 } = option;

											return (
												<option value={id} key={index}>
													{bank_name} / {"********" + last4}
												</option>
											);
										}}
										disabled={!edit}
									/>
								)}
							</div>
						</div>
						{edit && !warn.financial_settings && (
							<p
								className={common.common_medium}
								style={{
									color: color_palette.black,
								}}
							>
								Please note that all financial payouts are{" "}
								<span
									className={common.common_bold}
									style={{
										color: color_palette.dark_blue,
									}}
								>
									delayed
								</span>{" "}
								by a{" "}
								<span
									className={common.common_bold}
									style={{
										color: color_palette.dark_blue,
									}}
								>
									minimum of 2 days
								</span>
								.
							</p>
						)}
						{new_payout_schedule?.schedule === "monthly" && !warn.financial_settings && (
							<p
								className={common.common_medium}
								style={{
									margin: "0px",
									padding: "0px",
									color: color_palette.black,
								}}
							>
								If the{" "}
								<span
									className={common.common_bold}
									style={{
										color: color_palette.dark_blue,
									}}
								>
									29th, 30th, or 31st
								</span>{" "}
								are selected, payouts will be sent on the{" "}
								<span
									className={common.common_bold}
									style={{
										color: color_palette.dark_blue,
									}}
								>
									last day of the shorter months
								</span>
								.
							</p>
						)}
						<h2
							className={styles.bank_account_header}
							style={{
								marginTop: "20px",
								marginBottom: "10px",
							}}
						>
							Statements
						</h2>
						<div className={`${styles.banking_header_section} mb-[10px]`}>
							<div className={styles.payout_schedule_section}>
								<h3 className={styles.bank_account_header}>Statement Interval:</h3>
								<Dropdown
									options={statement_intervals}
									value={new_accounting_statement_schedule?.interval ?? statement_interval?.interval ?? "None"}
									onChange={(value: AccountingStatementInterval) => {
										if (warn.financial_settings) {
											set_warn({
												...warn,
												financial_settings: false,
											});
										}

										new_accounting_statement_schedule
											? set_new_accounting_statement_schedule({
													...new_accounting_statement_schedule,
													interval: value,
											  })
											: set_new_accounting_statement_schedule({
													email_address: undefined,
													interval: value,
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
									disabled={!edit}
								/>
							</div>
							<div className={styles.payout_schedule_section}>
								<h3 className={styles.bank_account_header}>Destination Email Address:</h3>
								<InputBox
									value={
										new_accounting_statement_schedule?.email_address ??
										statement_interval?.email_address ??
										"None"
									}
									onChange={(value: string) => {
										if (warn.financial_settings) {
											set_warn({
												...warn,
												financial_settings: false,
											});
										}

										new_accounting_statement_schedule
											? set_new_accounting_statement_schedule({
													...new_accounting_statement_schedule,
													email_address: value,
											  })
											: set_new_accounting_statement_schedule({
													email_address: value,
													interval: undefined,
											  });

										set_warn({
											...warn,
											email:
												value.length < 1 ||
												/^\s*$/.test(value) ||
												/^[^@.]+$/.test(value) ||
												!/\.(com|net|org|gov|fun|edu)$/.test(value),
										});
									}}
									disabled={!edit}
								/>
							</div>
						</div>
						{!warn.financial_settings && !warn.email && (
							<p
								className={common.common_medium}
								style={{
									color: color_palette.black,
								}}
							>
								If the{" "}
								<span
									className={common.common_bold}
									style={{
										color: color_palette.dark_blue,
									}}
								>
									weekly
								</span>{" "}
								interval is selected, statements will be sent every Monday. If the{" "}
								<span
									className={common.common_bold}
									style={{
										color: color_palette.dark_blue,
									}}
								>
									monthly
								</span>{" "}
								interval is selected, statements will be sent on the last day of every month. If the{" "}
								<span
									className={common.common_bold}
									style={{
										color: color_palette.dark_blue,
									}}
								>
									yearly
								</span>{" "}
								interval is selected, statements will be sent on the last day of every year.
							</p>
						)}
						{warn.financial_settings && !warn.email && (
							<ErrorMessage
								message={`Some or none of the fields have been filled out. If this is an accident, please hit "Cancel". Otherwise, make sure you fill out all the necessary fields when making changes.`}
							/>
						)}
						{warn.email && <ErrorMessage message={"Please ensure that you have entered a valid email address."} />}
					</div>
				)}
				<div className={styles.banking_header_section}>
					<h1 className={styles.bank_account_header}>
						{current_bank_accounts && current_bank_accounts?.length < 2 ? "Bank Account" : "Bank Accounts"}
					</h1>
					{user_organization.stripe_conn_id && (
						<img
							className={styles.add_button}
							alt="Add Icon"
							src={add_button}
							onClick={() => user_organization.stripe_conn_id && set_add_bank_account(true)}
						/>
					)}
				</div>
				{warn.acc_delete && <ErrorMessage message={"Failed to delete the selected bank account. Please contact us."} />}
				<BankAccountSection />
			</div>
		</div>
	);
};

export default Banking;
