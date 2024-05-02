import React, { useState } from "react";

import BillingSummaryBox from "components/billing_summary_components/billing_summary_box";
import ErrorMessage from "components/error_message";
import PromoCodeSection from "./promo_code_section";
import SuccessMessage from "components/success_message";

import { handle_promo_verification } from "./utils";
import { paid_event } from "utils/common_methods";

import { Donation } from "../types";
import { PromoCodePayload } from "./types";

import { DonationType } from "common";

type Props = {
	selected_tickets: Array<SelectedTicket>;
	donation: Donation;
	loading: boolean;
	selected_event: EventCreate;
	confirm_promo_code: {
		promo_code: string;
		discount: number;
	};
	set_confirm_promo_code: Function;
	primary_color?: string;
	secondary_color?: string;
};

const SummarySection: React.FC<Props> = ({
	selected_tickets,
	donation,
	loading,
	selected_event,
	confirm_promo_code,
	set_confirm_promo_code,
	primary_color,
	secondary_color,
}) => {
	const [promo_code_message, set_promo_code_message] = useState<string | undefined>(undefined);

	const submit_promo_code = async (promo_code: string) => {
		const payload: PromoCodePayload = {
			promo_code: promo_code,
			event_id: selected_event._id,
		};

		const { success, message, promo_code_doc } = await handle_promo_verification(payload);

		if (success && promo_code_doc) {
			set_confirm_promo_code({
				promo_code: promo_code_doc.code,
				discount: promo_code_doc.discount,
			});
		}

		set_promo_code_message(message);
	};

	const PromoCodeMessage = () => {
		if (promo_code_message) {
			switch (promo_code_message) {
				case "Successfully applied promo code!": {
					return <SuccessMessage>{promo_code_message}</SuccessMessage>;
				}
				default: {
					return <ErrorMessage message={promo_code_message} />;
				}
			}
		} else return null;
	};

	return (
		<div className="flex h-full w-full flex-col items-start rounded bg-fangarde-light-gray px-8 py-4">
			<div className={"my-[10px] w-full"}>
				<BillingSummaryBox
					open={!loading}
					selected_tickets={selected_tickets}
					donation_amount={Number(donation.amount)}
					donation_type={
						selected_event?.donation_type === DonationType.Flat ||
						selected_event?.donation_type === DonationType.Percentage
							? selected_event?.donation_type
							: undefined
					}
					promo_discount={confirm_promo_code.discount > 0 ? confirm_promo_code.discount : undefined}
				/>
			</div>
			<PromoCodeSection
				disallow_promo={false}
				primary_color={primary_color}
				secondary_color={secondary_color}
				submit_promo_code={(promo_code: string) => submit_promo_code(promo_code)}
				disabled={
					(confirm_promo_code.promo_code !== "" && confirm_promo_code.discount !== 0) || !paid_event(selected_tickets)
				}
			/>
			<PromoCodeMessage />
		</div>
	);
};

export default SummarySection;
