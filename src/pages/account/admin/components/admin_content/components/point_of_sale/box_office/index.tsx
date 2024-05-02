import { useState, useEffect } from "react";

import ErrorMessage from "components/error_message";
import Loader from "partials/loader/loader";
import PaymentSection from "./payment_section";
import CartSection from "./cart_section";
import SelectSection from "./select_section";
import SmallButton from "components/small_button/small_button";
import SuccessMessage from "components/success_message";

import { useUser, UseUserState } from "state/useUser";

import {
	capture_payment_intent,
	create_payment_intent,
	fetch_events,
	filter_selected_tickets,
	generate_pdf,
	store_order,
	process_payment_intent,
} from "./utils";
import { cart_empty, paid_event } from "utils/common_methods";

import { common_admin_root } from "common/styles/admin";

import { CashOrFreeRequest, CardRequest } from "./types";

import { TransactionType } from "common";

const BoxOffice = () => {
	const user_organization = useUser((state: UseUserState) => state.userOrganization);

	const { terminals } = user_organization;

	const [all_events, set_all_events] = useState<Array<EventCreate>>([]);
	const [tickets, set_tickets] = useState<Array<TicketType>>([]);
	const [selected_event, set_selected_event] = useState<EventCreate | undefined>();
	const [selected_tickets, set_selected_tickets] = useState<Array<SelectedTicket>>([]);
	const [transaction_type, set_transaction_type] = useState<TransactionType>(TransactionType.Cash);
	const [error, set_error] = useState<string | undefined>(undefined);
	const [temp_pdf_data, set_temp_pdf_data] = useState<Blob | undefined>(undefined);
	const [terminal, set_terminal] = useState<Terminal | undefined>(undefined);
	const [loading, set_loading] = useState<boolean>(false);

	const handle_order = async () => {
		if (cart_empty(selected_tickets)) {
			set_error("Please select some ticket before attempting to process an order!");

			return;
		} else if (!selected_event) {
			set_error("Please select an event from the dropdown list!");

			return;
		} else if (!user_organization) {
			set_error("Please ensure that you are still logged in!");

			return;
		} else if (!paid_event(selected_tickets) && transaction_type !== TransactionType.Free) {
			set_error("Please ensure that you select the free payment option if the tickets are free!");

			return;
		}

		if (
			transaction_type === TransactionType.Card &&
			selected_event &&
			user_organization &&
			user_organization.stripe_conn_id &&
			terminal
		) {
			if (error) set_error(undefined);

			set_loading(true);

			const event_id: string = selected_event._id;
			const org_id: string = user_organization._id;

			const { stripe_conn_id } = user_organization;

			const pii_response = await create_payment_intent(selected_tickets, stripe_conn_id);

			if (!pii_response.success || !pii_response.pii) {
				set_error(pii_response.message);
				set_loading(false);

				return;
			}

			const process_pi_response = await process_payment_intent(terminal.terminal_id, pii_response.pii);

			if (!process_pi_response.success) {
				set_error(process_pi_response.message + "Please try again!");
				set_loading(false);

				return;
			}

			const capture_pi_response = await capture_payment_intent(pii_response.pii, terminal.terminal_id);

			if (!capture_pi_response.success) {
				set_error(capture_pi_response.message);
				set_loading(false);

				return;
			}

			const body: CardRequest = {
				transaction_type: transaction_type,
				event_id: event_id,
				org_id: org_id,
				order: selected_tickets,
				payment_intent_id: pii_response.pii,
			};

			const response = await store_order(body);

			const { success, message, pdf_data } = response;

			if (success) {
				set_temp_pdf_data(pdf_data);

				await refresh_events();

				set_transaction_type(TransactionType.Cash);
				set_loading(false);
			} else {
				set_error(message);
				set_loading(false);

				return;
			}
		} else if (
			(transaction_type === TransactionType.Cash || transaction_type === TransactionType.Free) &&
			selected_event &&
			user_organization
		) {
			if (error) set_error(undefined);

			set_loading(true);

			const event_id: string = selected_event._id;
			const org_id: string = user_organization._id;

			const body: CashOrFreeRequest = {
				transaction_type: transaction_type,
				event_id: event_id,
				org_id: org_id,
				order: selected_tickets,
			};

			const response = await store_order(body);

			const { success, message, pdf_data } = response;

			if (success) {
				set_temp_pdf_data(pdf_data);

				await refresh_events();

				set_transaction_type(TransactionType.Cash);
				set_loading(false);
			} else {
				set_error(message);

				set_loading(false);

				return;
			}
		} else {
			set_error("Please select a valid payment method option. Valid options are 'Card', 'Cash', or 'Free'.");

			return;
		}
	};

	const refresh_events = async () => {
		set_loading(true);

		const response = await fetch_events(user_organization._id);

		const { success, message, updated_all_events } = response;

		if (success && updated_all_events && updated_all_events.length) {
			const selected_event_idx: number = selected_event ? all_events.indexOf(selected_event) : 0;

			set_selected_event(updated_all_events[selected_event_idx]);
			set_selected_tickets(filter_selected_tickets(updated_all_events, selected_event_idx));
			set_tickets(updated_all_events[selected_event_idx].ticket_types);

			set_all_events(updated_all_events);
		} else {
			set_error(message);
		}

		set_loading(false);
	};

	useEffect(() => {
		refresh_events();
	}, []);

	if (!loading && (!all_events || !all_events.length)) {
		return (
			<div className={common_admin_root}>
				<h1 className={"m-0 my-[10px] text-lg-header"}>Box Office</h1>
				<h3 className={"m-0 my-[10px] text-sm-header font-bold"}>
					You haven't hosted any events yet or are not currently hosting an events. Come back when you have active events!
				</h3>
			</div>
		);
	} else {
		return (
			<div className={common_admin_root}>
				{/* Make this loader a ternary to avoid re-rendering entire component and resetting local state */}
				{loading && (
					<Loader className="absolute left-0 top-[70px] z-[1000px] flex h-full w-full items-center justify-center bg-white" />
				)}
				<h1 className={"m-0 my-[10px] text-lg-header"}>Box Office</h1>
				<SelectSection
					all_events={all_events}
					on_set_event={(value: number) => {
						set_selected_event(all_events[value]);
						set_selected_tickets(filter_selected_tickets(all_events, value));
						set_tickets(all_events[value].ticket_types);
					}}
					on_set_terminal={(value: number) => {
						if (value > -1) set_terminal(terminals[value]);
						else {
							set_terminal(terminals[value]);
							if (transaction_type === TransactionType.Card) set_transaction_type(TransactionType.Cash);
						}
					}}
				/>
				<CartSection
					tickets={tickets}
					selected_tickets={selected_tickets}
					set_tickets={set_tickets}
					set_selected_tickets={set_selected_tickets}
				/>
				<PaymentSection
					selected_tickets={selected_tickets}
					transaction_type={transaction_type}
					set_transaction_type={set_transaction_type}
					card_disabled={!terminal}
				/>
				{temp_pdf_data && (
					<SuccessMessage>
						Successfully purchased tickets! Please choose to either print them or proceed to the next order.
					</SuccessMessage>
				)}
				{!temp_pdf_data ? (
					<div className={"my-[20px] flex w-[500px] flex-row items-center justify-between"}>
						<SmallButton disabled={cart_empty(selected_tickets) || loading} onClick={() => handle_order()}>
							Process Order
						</SmallButton>
						<SmallButton disabled={cart_empty(selected_tickets) || loading} onClick={() => set_selected_tickets([])}>
							Clear
						</SmallButton>
					</div>
				) : (
					<div className={"my-[20px] flex w-[500px] flex-row items-center justify-between"}>
						<SmallButton
							onClick={() => {
								generate_pdf(temp_pdf_data);
								set_temp_pdf_data(undefined);
							}}
						>
							Print Tickets
						</SmallButton>
						<SmallButton onClick={() => set_temp_pdf_data(undefined)}>Next Order</SmallButton>
					</div>
				)}
				{error && <ErrorMessage message={error} />}
			</div>
		);
	}
};

export default BoxOffice;
