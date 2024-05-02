import { Buffer } from "buffer";
import { useEffect, useState } from "react";
import { useUser } from "state/useUser";

import AccountingStatementModal from "./accounting_statements_modal";
import ExportPdf from "components/export_pdf";
import Loader from "partials/loader/loader";
import RefundModal from "./refund_modal";
import SearchInputBox from "components/search_input_box";
import Dropdown from "components/dropdown";

import { use_accounting } from "state/admin/accounting";

import { api } from "axiosClients/client";

import common from "common/css/common.module.css";
import styles from "./books.module.css";

import { ModalTypes, Payload } from "./accounting_statements_modal";
import { RefundTypes, TransactionType } from "common";
import TextButton from "components/text_button";

export type RefundModalState = {
	id: string | undefined;
	refund_type: RefundTypes | undefined;
};

export const format_date = (mongo_date: any) => {
	const date: Date = new Date(mongo_date);
	return (
		date.getMonth() +
		1 +
		"/" +
		date.getDate() +
		"/" +
		date.getFullYear() +
		" - " +
		date.toLocaleTimeString("en-US", {
			hour: "numeric",
			minute: "numeric",
			hour12: true,
		})
	);
};

const Books = () => {
	const user_organization = useUser((state) => state.userOrganization);

	const { accounting_events, selected_accounting_event, set_accounting_events } = use_accounting((state) => ({
		accounting_events: state.accounting_events,
		selected_accounting_event: state.selected_accounting_event,
		set_accounting_events: state.set_accounting_events,
	}));

	const [accounting_event_options, set_accounting_event_options] = useState<Array<EventCreate>>([]);
	const [default_transactions, set_default_transactions] = useState<Array<Transaction> | undefined>(undefined);
	const [accounting_statement_modal, set_accounting_statement_modal] = useState<boolean>(false);
	const [event_fetch_warning, set_event_fetch_warning] = useState<string>("");
	const [loading, set_loading] = useState<boolean>(false);
	const [refund_modal, set_refund_modal] = useState<RefundModalState>({
		id: undefined,
		refund_type: undefined,
	});
	const [refund_warning, set_refund_warning] = useState<string>("");
	const [selected_accounting_event_option, set_selected_accounting_event_option] = useState<SelectedEvent | undefined>(undefined);
	const [statement_warning, set_statement_warning] = useState<string>("");
	const [success, set_success] = useState<boolean>(false);

	const convert_and_download_spreadsheet = (base_64_data: string) => {
		const binary_data = Buffer.from(base_64_data, "base64");
		const blob = new Blob([binary_data], {
			type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
		});
		const url = URL.createObjectURL(blob);
		window.open(url);
	};

	const display_refund_event_button = () => {
		if (selected_accounting_event_option && selected_accounting_event_option?.transactions.length > 0) {
			const transactions: Array<Transaction> = selected_accounting_event_option.transactions;
			let sum_cost = 0;

			for (const transaction of transactions) {
				const { rounded_customer_profit, refunded, charge_id, transaction_type } = transaction;

				if (!refunded && charge_id && transaction_type !== TransactionType.Free) {
					sum_cost += rounded_customer_profit;
				}
			}

			return sum_cost > 0;
		} else {
			return false;
		}
	};

	const download_accounting_statement = (payload: Payload) => {
		let req_body: Payload;
		let req_url: string = "";

		const { statement_type, event_id, start_date, end_date } = payload;

		if (statement_warning) set_statement_warning("");

		if (statement_type === ModalTypes.Event && event_id) {
			req_body = {
				event_id: event_id,
			};

			req_url = "/get_event_accounting_statement";
		} else if (statement_type === ModalTypes.Range && start_date && end_date && user_organization._id) {
			req_body = {
				org_id: user_organization._id,
				start_date: start_date,
				end_date: end_date,
			};

			req_url = "/get_monthly_accounting_statement";
		} else {
			set_statement_warning(
				"Failed to generate statement. Please ensure that all the information you've selected is accurate!"
			);

			return;
		}

		api.post(req_url, req_body)
			.then((res) => {
				const { spreadsheet } = res.data;

				if (spreadsheet) {
					convert_and_download_spreadsheet(spreadsheet.Content);

					set_accounting_statement_modal(false);
				} else {
					set_statement_warning("Failed to generate statement. Something internal went wrong!");
				}
			})
			.catch((err) => {
				const { error } = err;

				if (error) {
					set_statement_warning(error);
				} else {
					set_statement_warning("Failed to generate statement. Something internal went wrong!");
				}
			});
	};

	const fetch_transactions = (event: EventCreate) => {
		const { _id } = event;
		let selected_event: SelectedEvent = {
			...event,
			transactions: [],
		};

		api.post("/get_event_transactions", {
			event_id: _id,
		})
			.then((res) => {
				const { status } = res;

				if (status === 200) {
					const { transactions } = res.data;

					if (transactions.length) {
						selected_event.transactions = transactions;

						set_selected_accounting_event_option(selected_event);
						set_default_transactions(transactions);
					} else {
						set_selected_accounting_event_option(selected_event);
						set_default_transactions(transactions);
					}
				} else {
					set_selected_accounting_event_option(selected_event);
					set_event_fetch_warning("Failed to fetch the transactions for this event! Please contact us.");
				}
			})
			.catch((err) => {
				set_selected_accounting_event_option(selected_event);

				const { error } = err;

				if (error) {
					set_event_fetch_warning(
						`Failed to fetch the transactions for this event! The action failed with error message ${error}`
					);
				}
			});
	};

	const fetch_init_events = () => {
		set_loading(true);

		api.post("/get_init_accounting_events", {
			id: user_organization?._id,
		})
			.then((res) => {
				const { status } = res;

				if (status === 200) {
					const { events } = res.data;

					if (events.length) {
						set_accounting_events(events);
						set_accounting_event_options(events);
						set_loading(false);
					} else {
						set_accounting_events([]);
						set_accounting_event_options([]);
						set_selected_accounting_event_option(undefined);
						set_loading(false);
					}
				} else {
					set_accounting_events([]);
					set_accounting_event_options([]);
					set_selected_accounting_event_option(undefined);
					set_event_fetch_warning("Failed to fetch your events! Please contact us.");
					set_loading(false);
				}
			})
			.catch((err) => {
				set_accounting_events([]);
				set_accounting_event_options([]);
				set_selected_accounting_event_option(undefined);

				const { error } = err;

				if (error) {
					set_event_fetch_warning(
						`Failed to fetch the transactions for this event! The action failed with error message ${error}`
					);
				}

				set_loading(false);
			});
	};

	const format_dd_display = (event_option: EventCreate | SelectedEvent) => {
		return event_option.name + " / " + event_option.location.name + " / " + format_date(event_option.event_start_time);
	};

	const refund = async (id: string | undefined) => {
		set_refund_warning("");

		if (id && default_transactions && selected_accounting_event_option) {
			const url = refund_modal.refund_type === RefundTypes.Event ? "/refund_event" : "/refund_transaction";

			api.post(url, {
				id: id,
			})
				.then((res) => {
					const { refunds, total_transactions, message } = res.data;

					if (refunds.length > 0) {
						if (refunds.length === total_transactions) {
							let updated_transactions: Array<Transaction> | undefined = new Array(...default_transactions);

							updated_transactions = updated_transactions.map((transaction: Transaction) => {
								if (refunds.includes(transaction._id)) {
									return {
										...transaction,
										refunded: true,
									};
								} else {
									return transaction;
								}
							});

							const updated_selected_event: SelectedEvent | undefined = {
								...selected_accounting_event_option,
								transactions: updated_transactions,
							};

							set_selected_accounting_event_option(updated_selected_event);
							set_default_transactions(updated_transactions);
							set_success(true);
						} else {
							set_refund_warning("Could not refund some transactions. Please contact us!");
						}
					} else {
						const { error } = res.data;

						let warning_message: string = message;

						if (error) {
							warning_message += " " + error?.raw?.message;
						}

						set_refund_warning(warning_message);
					}
				})
				.catch((err) => {
					const { message, error } = err;

					let warning_message: string = "Something went wrong!";

					if (message) {
						warning_message += " " + message;
					}

					if (error) {
						warning_message += " " + error?.raw?.message;
					}

					set_refund_warning(warning_message);
				});
		} else {
			set_refund_warning("Can't refund a transaction or event that lacks an ID!");
		}
	};

	const search_transactions = (input: string) => {
		if (selected_accounting_event_option && default_transactions) {
			let filter_trans: Array<Transaction> = new Array(...default_transactions);

			filter_trans = filter_trans.filter((transaction: Transaction) => {
				const { last_four_card_digits, first_name, last_name, email } = transaction;

				const flattened_props = last_four_card_digits + first_name + last_name + email;

				if (flattened_props.includes(input)) {
					return transaction;
				} else {
					return false;
				}
			});

			set_selected_accounting_event_option({
				...selected_accounting_event_option,
				transactions: filter_trans,
			});
		}
	};

	useEffect(() => {
		if ((!accounting_events || !accounting_events.length) && user_organization?._id) {
			fetch_init_events();
		} else if (accounting_events && accounting_events.length) {
			set_accounting_event_options(accounting_events);
		}
	}, []);

	if (loading) {
		return (
			<div className={"mt-[100px] h-[400px] w-full"}>
				<Loader />
			</div>
		);
	}

	return (
		<div className={"w-full"}>
			<div className={styles.header_section}>
				<div className={styles.books_header_row}>
					<h1 className={styles.input_title}>Transactions</h1>
					{accounting_event_options.length ? (
						<TextButton
							className={"m-0 w-[29%] text-left font-custom text-regular font-bold hover:cursor-pointer"}
							onClick={() => set_accounting_statement_modal(true)}
							label={"Download Accounting Statement"}
						/>
					) : (
						<></>
					)}
				</div>
				<div className={styles.transaction_search_section}>
					<h3>Event:</h3>
					<div className={styles.event_selection_row}>
						<Dropdown
							disabled={!accounting_event_options.length}
							value={selected_accounting_event ? format_dd_display(selected_accounting_event) : undefined}
							options={["Select", ...accounting_event_options]}
							renderOption={(option: any, index: number) => {
								if (typeof option === "string" && option === "Select") {
									return (
										<option value={option} key={index}>
											{option}
										</option>
									);
								}

								return (
									<option value={index - 1} key={index}>
										{format_dd_display(option)}
									</option>
								);
							}}
							onChange={(value: string) => {
								if (value === "Select") {
									set_selected_accounting_event_option(undefined);
								} else {
									const idx = Number(value);

									fetch_transactions(accounting_event_options[idx]);
								}
							}}
						/>
						{display_refund_event_button() && (
							<p
								className={`${styles.refund_all_button} ${common.common_bold}`}
								onClick={() =>
									set_refund_modal({ id: selected_accounting_event_option?._id, refund_type: RefundTypes.Event })
								}
							>
								Refund Event
							</p>
						)}
					</div>
				</div>
				{event_fetch_warning && (
					<p
						className={common.bold}
						style={{
							color: "#dc1a21",
						}}
					>
						{event_fetch_warning}
					</p>
				)}
				<div className={styles.transaction_search_section}>
					<h3>Search Transactions:</h3>
					<SearchInputBox
						type={"text"}
						placeholder={"Search for a transaction by last four card digits, first name, last name or email..."}
						onChange={(value: string) => search_transactions(value)}
						maxLength={120}
					/>
				</div>
			</div>
			{selected_accounting_event_option ? (
				<div className={styles.transaction_section}>
					<h2 className={styles.input_title}>Transactions List</h2>
					{selected_accounting_event_option.transactions.length ? (
						<div
							className={"flex w-full flex-col items-start rounded-lg border-2 border-medium-blue py-[15px] pl-[10px]"}
						>
							<div className={styles.transaction_labels}>
								<span className={styles.transaction_label}>Transaction ID</span>
								<span className={styles.transaction_label}>Email Address</span>
								<span className={styles.transaction_label}>Name</span>
								<span className={styles.transaction_label}>Card Digits</span>
								<span className={styles.transaction_label}>Refunded</span>
							</div>
							<div className={styles.transaction_map}>
								{selected_accounting_event_option.transactions.map((transaction: Transaction) => {
									const {
										_id,
										email,
										first_name,
										last_name,
										last_four_card_digits,
										charge_id,
										rounded_customer_profit,
										refunded,
										transaction_type,
									} = transaction;

									const full_name: string = first_name && last_name ? first_name + " " + last_name : "N/A";
									const refunded_message: string = refunded
										? "Yes"
										: transaction_type === TransactionType.Card
										? "No"
										: "N/A";

									return (
										<div
											key={transaction._id}
											className={
												"mb-[20px] flex h-[36px] w-full flex-row items-center justify-evenly border-b-2 border-medium-blue"
											}
										>
											<div className={styles.transaction_properties}>
												<span className={styles.transaction_item}>{_id}</span>
												<span className={styles.transaction_item}>{email ?? "N/A"}</span>
												<span className={styles.transaction_item}>{full_name}</span>
												<span className={styles.transaction_item}>{last_four_card_digits}</span>
												<span className={styles.transaction_item}>{refunded_message}</span>
											</div>
											<div className={styles.pdf_export_container}>
												<ExportPdf
													selected_accounting_event_option={selected_accounting_event_option}
													transaction={transaction}
												/>
											</div>
											<span
												className={`${styles.refund_all_button} ${common.common_bold}`}
												style={{
													width: "60px",
												}}
												onClick={() =>
													charge_id &&
													rounded_customer_profit > 0 &&
													!refunded &&
													transaction_type === TransactionType.Card &&
													set_refund_modal({
														id: transaction._id,
														refund_type: RefundTypes.Trans,
													})
												}
											>
												{charge_id &&
													rounded_customer_profit > 0 &&
													!refunded &&
													transaction_type === TransactionType.Card &&
													"Refund"}
											</span>
										</div>
									);
								})}
							</div>
						</div>
					) : (
						<h3>
							{default_transactions && default_transactions.length > 0
								? "No transactions found matching that search input!"
								: "No tickets purchased for this event!"}
						</h3>
					)}
				</div>
			) : (
				<h3>
					{accounting_event_options.length
						? "Please select an event to see more transactional features and transactions!"
						: "No have been hosted by this organization yet!"}
				</h3>
			)}
			{refund_modal.refund_type && (
				<RefundModal
					selected_event={selected_accounting_event_option}
					refund_modal={refund_modal}
					warning={refund_warning}
					success={success}
					onExit={() => {
						if (success) {
							set_success(false);
						}

						set_refund_modal({
							id: undefined,
							refund_type: undefined,
						});
					}}
					onSubmit={() => refund(refund_modal.id)}
				/>
			)}
			{accounting_statement_modal && (
				<AccountingStatementModal
					warning={statement_warning}
					onSubmit={(payload: Payload) => download_accounting_statement(payload)}
					onExit={() => set_accounting_statement_modal(false)}
					event_options={accounting_event_options}
				/>
			)}
		</div>
	);
};

export default Books;
