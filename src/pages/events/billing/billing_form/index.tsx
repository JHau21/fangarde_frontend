import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { CardNumberElement, CardCvcElement, CardExpiryElement, useStripe, useElements } from "@stripe/react-stripe-js";

import BillingCurtain from "./billing_curtain";
import DonationSection from "./donation_section";
import Dropdown from "components/dropdown";
import ErrorMessage from "components/error_message";
import InputBox from "components/input_box";
import OptInSection from "./opt_in_section";
import SmallButton from "components/small_button/small_button";

import { countries, states } from "utils/constants";
import { paid_event } from "utils/common_methods";

import color_palette from "common/types/colors";

import { font_style, input_style } from "common/styles/stripe";

import { BillingData, PaidHookForm } from "./types";
import { OrderPayload, Donation } from "../types";

import { ButtonTypes } from "common";

type Props = {
	user?: User;
	confirm_promo_code: {
		promo_code: string;
		discount: number;
	};
	donation: Donation;
	loading: boolean;
	selected_tickets: Array<SelectedTicket>;
	selected_organization: Organization;
	primary_color?: string;
	secondary_color?: string;
	selected_event: EventCreate;
	submit_order: Function;
	error: string | undefined;
	set_error: Function;
	set_loading: Function;
	set_donation: Function;
};

const BillingForm: React.FC<Props> = ({
	user,
	confirm_promo_code,
	donation,
	loading,
	selected_tickets,
	selected_organization,
	primary_color,
	secondary_color,
	selected_event,
	submit_order,
	error,
	set_error,
	set_loading,
	set_donation,
}) => {
	const {
		clearErrors,
		formState: { errors },
		getValues,
		handleSubmit,
		register,
		setValue,
	} = useForm<PaidHookForm>({
		defaultValues: {
			first_name: "",
			last_name: "",
			email: "",
			confirm_email: "",
			card_number: "",
			expiration_date: "",
			security_code: "",
			billing_address: "",
			country: "US",
			city: "",
			state: "AL",
			zip_code: "",
		},
		mode: "onSubmit",
		reValidateMode: "onSubmit",
	});
	const stripe = useStripe();
	const elements = useElements();

	const [open_user_section, set_open_user_section] = useState<boolean>(false);
	const [open_payment_section, set_open_payment_section] = useState<boolean>(false);
	const [open_billing_section, set_open_billing_section] = useState<boolean>(false);
	const [opt_in, set_opt_in] = useState<boolean>(user?.email ? selected_organization?.mailing_list?.includes(user.email) : false);
	const [paid, set_paid] = useState<boolean>(paid_event(selected_tickets));

	const on_submit = async () => {
		const values: PaidHookForm = getValues();

		if (!(user?.first_name && user?.last_name && user?.email) && !(values.first_name && values.last_name && values.email)) {
			set_error("We are missing important user information. Please log into an account or fill out the user fields.");

			return;
		} else if (
			paid &&
			(values.billing_address === "" ||
				values.country === "" ||
				values.city === "" ||
				values.state === "" ||
				values.zip_code === "")
		) {
			set_error("Some or all billing address fields have not been filled out!");

			return;
		} else if (donation.amount < 0) {
			set_error("Donation amount must be positive number!");

			return;
		}

		const error_list: Array<any> = Object.keys(errors);

		if (error_list.length > 0) {
			set_error("Please ensure that all fields are filled out correctly before continuing!");

			return;
		} else {
			if (error) set_error(undefined);

			clearErrors();

			let stripe_token: any;

			if (paid) {
				if (!stripe || !elements) {
					set_error("An unknown error occurred! Please try again later!");

					return;
				}

				const card_number_element = await elements.getElement(CardNumberElement);

				const data: BillingData = {
					currency: "usd",
					name: user ? user?.first_name + " " + user?.last_name : values.first_name + " " + values.last_name,
					address_line1: values.billing_address,
					address_city: values.city,
					address_state: values.state,
					address_zip: values.zip_code,
					address_country: values.country,
				};

				if (!card_number_element) {
					set_error("An unknown error occurred! Please try again later!");

					return;
				}

				const result = await stripe.createToken(card_number_element, data);

				if (result.error) {
					set_error(result.error.message ?? "An unknown error occurred!");

					return;
				} else {
					stripe_token = result.token;
				}
			}

			const payload_donation: Donation | undefined =
				donation.amount > 0 && donation.type !== ""
					? {
							amount: donation.amount,
							type: selected_event.donation_type,
					  }
					: undefined;

			const payload: OrderPayload = {
				order: selected_tickets,
				organization: selected_organization,
				stripe_token: stripe_token,
				event: selected_event,
				user: {
					user_id: user?._id ?? undefined,
					first_name: user?.first_name ?? values.first_name,
					last_name: user?.last_name ?? values.last_name,
					email: user?.email ?? values.email,
				},
				promo_code: confirm_promo_code.promo_code !== "" ? confirm_promo_code.promo_code : undefined,
				donation: payload_donation,
				paid_tickets: paid,
				opted_in: opt_in,
			};

			submit_order(payload);
		}
	};

	useEffect(() => {
		if (!stripe || !elements) set_loading(true);
		else set_loading(false);
	}, [stripe, elements]);

	return (
		<form className={"w-full"} onSubmit={handleSubmit(on_submit)}>
			<h1 className={"m-0 text-lg-header"}>Order Information</h1>
			<div className={"min-h-[350px]"}>
				{(!user?.email || !user?.first_name || !user?.last_name) && (
					<BillingCurtain
						title={"User Information"}
						open={open_user_section && !loading}
						set_open={set_open_user_section}
						primary_color={primary_color}
					>
						<div className={"flex w-full flex-col items-start"}>
							<div className={"my-2 flex w-full flex-row items-center justify-between"}>
								<div className={"w-[47%]"}>
									<p>Email Address</p>
									<InputBox
										{...register("email", {
											pattern: {
												value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i,
												message: "Please enter a valid email address",
											},
											maxLength: { value: 330, message: "Please enter a valid email address!" }, // max length gmail address
											minLength: { value: 4, message: "Please enter a valid email address!" },
											validate: {
												value: (value: string) =>
													value === getValues("confirm_email") ||
													"Please ensure that both emails match each other!",
											},
										})}
										onChange={(value: string) => {
											if (selected_organization?.mailing_list?.includes(value) && !opt_in) set_opt_in(true);
											else if (!selected_organization?.mailing_list?.includes(value) && opt_in)
												set_opt_in(false);

											setValue("email", value);
										}}
										default_color={primary_color}
										hover_color={secondary_color}
										focus_color={secondary_color}
									/>
									{errors?.email?.message && <ErrorMessage message={errors.email.message} />}
								</div>
								<div className={"w-[47%]"}>
									<p>Confirm Email Address</p>
									<InputBox
										{...register("confirm_email", {
											pattern: {
												value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i,
												message: "Please enter a valid email address",
											},
											maxLength: { value: 330, message: "Please enter a valid email address!" },
											minLength: { value: 4, message: "Please enter a valid email address!" },
											validate: {
												value: (value: string) =>
													value === getValues("email") ||
													"Please ensure that both emails match each other!",
											},
										})}
										onChange={(value: string) => setValue("confirm_email", value)}
										default_color={primary_color}
										hover_color={secondary_color}
										focus_color={secondary_color}
									/>
									{errors?.confirm_email?.message && <ErrorMessage message={errors.confirm_email.message} />}
								</div>
							</div>
							<div className={"my-2 flex w-full flex-row items-center justify-between"}>
								<div className={"w-[47%]"}>
									<p>First Name</p>
									<InputBox
										{...register("first_name", {
											maxLength: { value: 330, message: "Please enter a valid first name!" },
											minLength: { value: 1, message: "Please enter a valid first name!" },
										})}
										onChange={(value: string) => setValue("first_name", value)}
										default_color={primary_color}
										hover_color={secondary_color}
										focus_color={secondary_color}
									/>
									{errors?.first_name?.message && <ErrorMessage message={errors.first_name.message} />}
								</div>
								<div className={"w-[47%]"}>
									<p>Last Name</p>
									<InputBox
										{...register("last_name", {
											maxLength: { value: 330, message: "Please enter a valid last name!" },
											minLength: { value: 1, message: "Please enter a valid last name!" },
										})}
										onChange={(value: string) => setValue("last_name", value)}
										default_color={primary_color}
										hover_color={secondary_color}
										focus_color={secondary_color}
									/>
									{errors?.last_name?.message && <ErrorMessage message={errors.last_name.message} />}
								</div>
							</div>
						</div>
					</BillingCurtain>
				)}
				{paid ? (
					<div className={"flex w-full flex-col items-start"}>
						<BillingCurtain
							title={"Payment Information"}
							open={open_payment_section && !loading}
							set_open={set_open_payment_section}
							primary_color={primary_color}
						>
							<div className={"flex w-full flex-col items-start"}>
								<div className={"my-2 w-full"}>
									<p>Card Number</p>
									<div
										className={input_style}
										style={{ border: `2px solid ${primary_color ?? color_palette.medium_blue}` }}
									>
										<CardNumberElement options={{ style: font_style }} className={"inset-0 w-full"} />
									</div>
								</div>
								<div className={"my-2 flex w-full flex-row items-center justify-between"}>
									<div className={"flex w-[46%] flex-col items-start"}>
										<p>Expiration Date</p>
										<div
											className={input_style}
											style={{ border: `2px solid ${primary_color ?? color_palette.medium_blue}` }}
										>
											<CardExpiryElement options={{ style: font_style }} className={"inset-0 w-full"} />
										</div>
									</div>
									<div className={"flex w-[46%] flex-col items-start"}>
										<p>Security Code</p>
										<div
											className={input_style}
											style={{ border: `2px solid ${primary_color ?? color_palette.medium_blue}` }}
										>
											<CardCvcElement options={{ style: font_style }} className={"inset-0 w-full"} />
										</div>
									</div>
								</div>
							</div>
						</BillingCurtain>
						<BillingCurtain
							title={"Billing Address"}
							open={open_billing_section && !loading}
							set_open={set_open_billing_section}
							primary_color={primary_color}
						>
							<div className={"flex w-full flex-col items-start"}>
								<div className={"my-2 w-full"}>
									<p>Street</p>
									<InputBox
										{...register("billing_address", {
											minLength: { value: 1, message: "Street address must be more than one character!" },
										})}
										placeholder={"e.g. 1234 First St"}
										onChange={(value: string) => setValue("billing_address", value)}
										default_color={primary_color}
										hover_color={secondary_color}
										focus_color={secondary_color}
										autocomplete="street-address"
									/>
									{errors?.billing_address?.message && <ErrorMessage message={errors.billing_address.message} />}
								</div>
								<div className={"my-2 flex w-full flex-row items-center justify-between"}>
									<div className={"w-[47%]"}>
										<p>Country</p>
										<Dropdown
											{...register("country")}
											options={countries}
											onChange={(value: string) => setValue("country", value)}
											renderOption={(
												{ name, country_code }: { name: string; country_code: string },
												index: number
											) => {
												return (
													<option value={country_code} key={index}>
														{name + " - " + country_code}
													</option>
												);
											}}
											default_color={primary_color}
											hover_color={secondary_color}
											focus_color={secondary_color}
										/>
										{errors?.country?.message && <ErrorMessage message={errors.country.message} />}
									</div>
									<div className={"w-[47%]"}>
										<p>State</p>
										<Dropdown
											{...register("state")}
											options={states}
											onChange={(value: string) => setValue("state", value)}
											renderOption={(
												{ name, abbreviation }: { name: string; abbreviation: string },
												index: number
											) => {
												return (
													<option value={abbreviation} key={index}>
														{name + " - " + abbreviation}
													</option>
												);
											}}
											default_color={primary_color}
											hover_color={secondary_color}
											focus_color={secondary_color}
										/>
									</div>
								</div>
								<div className={"my-2 flex w-full flex-row items-center justify-between"}>
									<div className={"w-[47%]"}>
										<p>City</p>
										<InputBox
											{...register("city", {
												minLength: { value: 1, message: "Please enter a valid city!" },
											})}
											onChange={(value: string) => setValue("city", value)}
											default_color={primary_color}
											hover_color={secondary_color}
											focus_color={secondary_color}
											autocomplete="address-level2"
											name="city"
										/>
										{errors?.city?.message && <ErrorMessage message={errors.city.message} />}
									</div>
									<div className={"w-[47%]"}>
										<p>Zip Code</p>
										<InputBox
											{...register("zip_code", {
												maxLength: { value: 5, message: "Please enter a valid postal code!" },
												minLength: { value: 5, message: "Please enter a valid postal code!" },
											})}
											onChange={(value: string) => {
												if (value.length > 5) {
													value = value.slice(0, 5);
												}

												value = value.replace(/[^\d]/g, "");

												setValue("zip_code", value);
											}}
											maxLength={5}
											default_color={primary_color}
											hover_color={secondary_color}
											focus_color={secondary_color}
											autocomplete="postal-code"
										/>
										{errors?.zip_code?.message && <ErrorMessage message={errors.zip_code.message} />}
									</div>
								</div>
							</div>
						</BillingCurtain>
					</div>
				) : (
					<h3 className="m-0 my-[10px] p-0 text-sm-header">No payment information required!</h3>
				)}
				<DonationSection
					selected_tickets={selected_tickets}
					selected_event={selected_event}
					loading={loading}
					primary_color={primary_color}
					secondary_color={secondary_color}
					donation={donation}
					paid={paid}
					set_donation={set_donation}
					set_paid={set_paid}
				/>
			</div>
			<OptInSection
				selected_organization={selected_organization}
				opt_in={opt_in}
				set_opt_in={set_opt_in}
				primary_color={primary_color}
				secondary_color={secondary_color}
			/>
			{error && <ErrorMessage message={error} />}
			<SmallButton
				default_color={primary_color}
				hover_color={secondary_color}
				active_color={primary_color}
				className={"mt-full mb-[15px] h-8 w-full rounded-md bg-transparent font-custom text-regular md:mb-0"}
				type={ButtonTypes.Submit}
			>
				Submit
			</SmallButton>
		</form>
	);
};

export default BillingForm;
