import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import ArrowButton from "components/arrow_button";
import BillingForm from "./billing_form";
import SummarySection from "./summary_section";

import { useUser } from "state/useUser";
import { use_ticket_order } from "state/events/use_ticket_order";

import { handle_order } from "./utils";

import { Donation, OrderPayload } from "./types";
import { EventComponentProps } from "../types";

const Billing: React.FC<EventComponentProps> = ({ loading, set_loading }) => {
	const { user } = useUser();
	const { selected_organization, selected_event, selected_tickets, set_promo_code_state, set_donation_state } = use_ticket_order(
		(state) => ({
			selected_event: state.selected_event,
			selected_tickets: state.selected_tickets,
			selected_organization: state.selected_organization,
			set_promo_code_state: state.set_promo_discount,
			set_donation_state: state.set_donation,
		})
	);

	const navigate = useNavigate();

	const [confirm_promo_code, set_confirm_promo_code] = useState<{
		promo_code: string;
		discount: number;
	}>({
		promo_code: "",
		discount: 0,
	});
	const [error, set_error] = useState<string | undefined>(undefined);
	const [donation, set_donation] = useState<Donation>({
		amount: 0,
		type: "None",
	});

	const { primary_color, secondary_color } = selected_event?.color_scheme ?? {
		primary_color: undefined,
		secondary_color: undefined,
	};

	const go_back = () => {
		if (donation.amount > 0 && donation.type !== "") set_donation_state(undefined);
		if (confirm_promo_code.discount > 0 && confirm_promo_code.promo_code !== "") set_promo_code_state(undefined);

		navigate("/event/buy_tickets");
	};

	const go_forward = async (payload: OrderPayload) => {
		set_loading(true);

		const { success, message } = await handle_order(payload);

		if (success) {
			if (donation.amount > 0 && donation.type !== "") set_donation_state(donation);
			if (confirm_promo_code.discount > 0 && confirm_promo_code.promo_code !== "")
				set_promo_code_state(confirm_promo_code.discount);

			navigate("/event/confirmation");

			set_loading(false);
		} else {
			set_error(message);
			set_loading(false);
		}
	};

	return (
		<div className="mx-auto flex w-11/12 flex-col justify-between font-custom text-regular font-normal md:my-8 md:w-3/4 md:flex-row">
			{selected_organization && selected_event && (
				<div className={"flex flex-col items-start md:w-5/12"}>
					<ArrowButton
						onClick={go_back}
						default_color={primary_color}
						hover_color={secondary_color}
						active_color={secondary_color}
					>
						Back
					</ArrowButton>
					<BillingForm
						user={user}
						confirm_promo_code={confirm_promo_code}
						donation={donation}
						loading={loading}
						selected_organization={selected_organization}
						selected_tickets={selected_tickets ?? []}
						primary_color={primary_color}
						secondary_color={secondary_color}
						selected_event={selected_event}
						submit_order={(payload: OrderPayload) => go_forward(payload)}
						error={error}
						set_error={set_error}
						set_loading={set_loading}
						set_donation={set_donation}
					/>
				</div>
			)}
			{selected_event && selected_organization && (
				<div className="md:min-h-[480px] md:w-6/12">
					<SummarySection
						selected_tickets={selected_tickets ?? []}
						donation={donation}
						loading={loading}
						selected_event={selected_event}
						confirm_promo_code={confirm_promo_code}
						set_confirm_promo_code={set_confirm_promo_code}
						primary_color={primary_color}
						secondary_color={secondary_color}
					/>
				</div>
			)}
		</div>
	);
};

export default Billing;
