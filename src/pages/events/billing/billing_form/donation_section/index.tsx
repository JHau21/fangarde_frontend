import React, { useState } from "react";

import BillingCurtain from "../billing_curtain";
import Dropdown from "components/dropdown";
import InputBox from "components/input_box";

import { paid_event } from "utils/common_methods";

import { DonationType } from "common";

type Props = {
	selected_tickets: Array<SelectedTicket>;
	selected_event: EventCreate;
	loading: boolean;
	donation: Donation;
	paid: boolean;
	set_donation: Function;
	set_paid: Function;
	primary_color?: string;
	secondary_color?: string;
};

const DonationSection: React.FC<Props> = ({
	selected_tickets,
	selected_event,
	loading,
	donation,
	paid,
	set_donation,
	set_paid,
	primary_color,
	secondary_color,
}) => {
	const [open_donation_section, set_open_donation_section] = useState<boolean>(false);

	if (selected_event.donations && selected_event.donation_options && selected_event.donation_options.length && selected_tickets) {
		return (
			<BillingCurtain
				title={"Donation"}
				message={selected_event?.donation_message}
				open={open_donation_section && !loading}
				set_open={set_open_donation_section}
				primary_color={primary_color}
			>
				<div className={"mb-[10px] flex w-full flex-col items-start"}>
					<p className={"m-0 w-full"}>Donation Option</p>
					<div className={"flex-start mb-[10px] flex w-full flex-col"}>
						<Dropdown
							options={["None", ...selected_event.donation_options, "Custom"]}
							value={donation.type === "Custom" ? "Custom" : donation.amount}
							onChange={(value: string) => {
								if (value !== "None" && value !== "Custom") {
									if (!paid) set_paid(true);

									set_donation({
										amount: Number(value),
										type: "Standard",
									});
								} else if (value === "Custom") set_donation({ amount: 0, type: "Custom" });
								else {
									if (paid) set_paid(paid_event(selected_tickets));

									set_donation({
										amount: 0,
										type: value,
									});
								}
							}}
							renderOption={(option: any, index: number) => {
								if (option === "None" || option === "Custom") {
									return (
										<option value={option} key={index}>
											{option}
										</option>
									);
								}

								return (
									<option value={option} key={index}>
										{selected_event.donation_type === "flat" && "$"}
										{option}
										{selected_event.donation_type === "percentage" && "%"}
									</option>
								);
							}}
							default_color={primary_color}
							hover_color={secondary_color}
							focus_color={secondary_color}
						/>
						{donation.type === "Custom" && (
							<div className={"relative mt-[20px] w-full"}>
								{selected_event.donation_type === DonationType.Flat && (
									<span className={"absolute left-[-12px] top-[2.5px] text-sm-header font-bold md:left-[-20px]"}>
										$
									</span>
								)}
								<InputBox
									placeholder={"Enter a custom donation amount."}
									onChange={(value: string) => {
										if (!paid) set_paid(true);

										const cleaned_value = value.replace(/\D/g, "");

										if (Number(cleaned_value) > 0) {
											set_donation({
												...donation,
												amount: Number(cleaned_value),
											});
										} else {
											set_donation({
												...donation,
												amount: 0,
											});
										}
									}}
									maxLength={4}
									default_color={primary_color}
									hover_color={secondary_color}
									focus_color={secondary_color}
								/>
								{selected_event.donation_type === DonationType.Percentage && (
									<span className={"absolute right-[-12px] top-[2.5px] text-sm-header font-bold md:right-[-20px]"}>
										%
									</span>
								)}
							</div>
						)}
					</div>
				</div>
			</BillingCurtain>
		);
	} else return null;
};

export default DonationSection;
