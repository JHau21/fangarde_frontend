import React, { useState } from "react";

import { calculate_billing } from "./billing_calculations";

import { DonationType, TransactionType } from "common";

import total_up_arrow_image from "common/icons/continue_arrow_default_black.svg";
import information_bubble from "common/icons/information_box.svg";

type Props = {
	open?: boolean;
	selected_tickets: Array<SelectedTicket>;
	donation_amount: number;
	donation_type?: DonationType;
	promo_discount: number | undefined;
	transaction_type?: TransactionType;
};

const BillingSummaryBox: React.FC<Props> = ({
	open = true,
	selected_tickets,
	donation_amount,
	donation_type,
	promo_discount,
	transaction_type,
}: Props) => {
	const { ticket_items, service_fee, processing_fee, order_total_w_fees, donation_total } = calculate_billing({
		selected_tickets,
		donation_amount,
		donation_type,
		promo_discount,
		transaction_type,
	});

	const [show_details, setshow_details] = useState(true);

	return (
		<div className="mb-4 w-full font-custom text-regular font-normal text-fangarde-black">
			<div className={"mb-[10px]"} onClick={() => setshow_details(!show_details)} style={{ cursor: "pointer" }}>
				<div className={"m-0 flex h-8 flex-row items-center justify-between"}>
					<h2 className={"m-0 text-left"}>Total</h2>
					<div className="m-0 flex h-8 flex-row items-center">
						<h2>${order_total_w_fees.toFixed(2)}</h2>
						<img
							className={"ml-[10px] h-[20px] w-[20px]"}
							src={total_up_arrow_image}
							alt="Toggle Arrow"
							style={{
								transform: show_details ? "rotate(90deg)" : "rotate(270deg)",
							}}
						/>
					</div>
				</div>
			</div>
			{show_details && open && (
				<>
					<div>
						<h3 className={"m-0 text-left"}>Tickets</h3>
						<div className={"m-h-[78px] overflow-auto leading-4"}>{ticket_items}</div>
					</div>
					<div className={"mb-[10px]"}>
						<h3 className={"m-0 my-[5px] text-left"}>Fees {transaction_type && "(Deducted from profit)"}</h3>
						<div className={"mb-[10px] flex flex-row items-center justify-between"}>
							<div className={"nowrap ml-[15px] flex flex-row items-center"}>
								<span>Service Fee: </span>
								<img
									src={information_bubble}
									alt="Information Bubble"
									title="$1 + 1% per ticket"
									style={{
										alignContent: "center",
										width: "20px",
										height: "20px",
										marginLeft: "5px",
									}}
								/>
							</div>
							<span className={"text-right"}>${service_fee.toFixed(2)}</span>
						</div>
						<div className={"mb-[10px] flex flex-row items-center justify-between"}>
							<div className={"nowrap ml-[15px] flex flex-row items-center"}>
								<span>Credit Card Processing Fee </span>
								<img
									src={information_bubble}
									alt="Information Bubble"
									title="(ticket total + $0.30) x 2.99%"
									style={{
										alignContent: "center",
										width: "20px",
										height: "20px",
										marginLeft: "5px",
									}}
								/>
							</div>
							<span className={"text-right"}>${processing_fee.toFixed(2)}</span>
						</div>
					</div>
					{donation_amount > 0 && (
						<div className={"mb-[10px]"}>
							<h3 className={"m-0 text-left"}>Donation</h3>
							<div className={"my-[5px] ml-[15px] flex flex-row items-center justify-between"}>
								<span>Donation Amount:</span>
								<span>${donation_total.toFixed(2)}</span>
							</div>
						</div>
					)}
					{promo_discount && promo_discount > 0 && (
						<div className={"mb-[10px]"}>
							<h3 className={"m-0 text-left"}>Promotion</h3>
							<div className={"my-[5px] ml-[15px] flex flex-row items-center justify-between"}>
								<span>Promo Code:</span>
								<span>{Math.round(promo_discount * 100)}%</span>
							</div>
						</div>
					)}
				</>
			)}
		</div>
	);
};

export default BillingSummaryBox;
