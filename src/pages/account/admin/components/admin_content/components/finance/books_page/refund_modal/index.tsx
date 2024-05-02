import { useState } from "react";
import { useNavigate } from "react-router-dom";

import ErrorMessage from "components/error_message";
import InputBox from "components/input_box";
import Loader from "partials/loader/loader";
import Modal from "components/modal/modal";
import SmallButton from "components/small_button/small_button";

import { RefundModalState } from "../books";
import { RefundTypes } from "common";

import check_shield_icon from "common/icons/shield_logo.svg";
import color_palette from "common/types/colors";

type Props = {
	selected_event: EventCreate | undefined;
	refund_modal: RefundModalState;
	warning: string;
	success: boolean;
	onExit: Function;
	onSubmit: Function;
};

const RefundModal = ({ selected_event, refund_modal, warning, success, onExit, onSubmit }: Props) => {
	const [input_match, set_input_match] = useState<boolean>(false);
	const [loading, set_loading] = useState<boolean>(false);

	const navigate = useNavigate();

	if (success) {
		return (
			<Modal
				onExit={() => {
					set_loading(false);
					onExit();
				}}
			>
				<div className={"flex w-[470px] flex-col items-center px-6"}>
					<img className={"w-[450px]"} src={check_shield_icon} alt={"Shield logo with checkmark"} />
					<h2>Successfully submitted {refund_modal.refund_type === RefundTypes.Event ? "refunds" : "refund"}!</h2>
					<SmallButton
						onClick={() => {
							set_loading(false);
							onExit();
						}}
					>
						Exit
					</SmallButton>
				</div>
			</Modal>
		);
	}

	if (loading && !warning) {
		return (
			<Modal hide_x={true} onExit={onExit}>
				<div className={"mt-[150px] h-[335px] w-[470px]"}>
					<Loader />
				</div>
			</Modal>
		);
	} else if (loading && warning) {
		set_loading(false);
	}

	const RefundModalHeading = () => {
		return (
			<>
				{refund_modal.refund_type === RefundTypes.Event ? (
					<div className={"text-left font-custom text-sm-header font-bold text-fangarde-black "}>
						<h1 className={"my-2 text-lg-header"}>Refund Event</h1>
						<h2 className={"my-2 w-[440px] truncate text-md-header"}>
							Event Name: <span className={"text-sm-header font-normal "}>{selected_event?.name}</span>
						</h2>
					</div>
				) : (
					<div className={"text-left font-custom text-sm-header font-bold text-fangarde-black "}>
						<h1 className={"my-2 text-lg-header "}>Refund Transaction</h1>
						<h2 className={"my-2 text-md-header "}>
							Transaction ID: <span className={"text-ellipsis text-sm-header font-normal"}>{refund_modal.id}</span>
						</h2>
					</div>
				)}
			</>
		);
	};

	const DisclaimerBullets = () => {
		return (
			<ul className={"ml-6 list-disc"}>
				{" "}
				<li className={"my-1"}>
					All refunds are{" "}
					<span
						style={{
							color: "#dc1a21",
						}}
					>
						<b>final</b>
					</span>
					. If you accidentally submit a refund, we can try to{" "}
					<span
						className={"text-dark-blue hover:cursor-pointer hover:text-light-blue active:text-medium-blue"}
						onClick={() => navigate("/contact")}
					>
						<b>help</b>
					</span>{" "}
					but we{" "}
					<span
						style={{
							color: color_palette.red,
						}}
					>
						<b>cannot</b>
					</span>{" "}
					guarantee a recovery of the {refund_modal.refund_type === RefundTypes.Trans ? "charge" : "charges"}.
				</li>{" "}
				<li className={"my-1"}>
					You{" "}
					<span
						style={{
							color: color_palette.red,
						}}
					>
						<b>will lose</b>
					</span>{" "}
					some money if you refund your event. To be specific, you will lose a portion or the entire{" "}
					<span
						className={"text-dark-blue hover:cursor-pointer hover:text-light-blue active:text-medium-blue"}
						onClick={() => window.open("https://stripe.com/pricing")}
					>
						<b>payment processing fee</b>{" "}
					</span>
					charged by{" "}
					<span
						className={"text-dark-blue hover:cursor-pointer hover:text-light-blue active:text-medium-blue"}
						onClick={() => window.open("https://support.stripe.com/questions/understanding-fees-for-refunded-payments")}
					>
						<b>Stripe</b>
					</span>{" "}
					on every transaction.
				</li>{" "}
				<li className={"my-1"}>
					All cash transactions{" "}
					<span
						style={{
							color: color_palette.red,
						}}
					>
						<b>cannot</b>
					</span>{" "}
					be refunded by Fangarde.
				</li>
			</ul>
		);
	};

	return (
		<Modal onExit={onExit}>
			<div className={"flex w-[470px] flex-col items-start px-6"}>
				<RefundModalHeading />
				<h3 className={"font-bold"}>Please note the following before continuing:</h3>
				<DisclaimerBullets />
				<h3 className={"font-bold"}>Revenue Lost</h3>
				<p className={"my-1"}>
					By providing a refund, we estimate you'll lose:{" "}
					<span
						style={{
							color: color_palette.red,
						}}
					>
						{/* In the future this will not be $0 */}
						<b>${"0.00"}</b>
					</span>
				</p>
				<p className={"my-1"}>
					To provide a refund, please type out the refund ID "<b>{refund_modal.id}</b>" below and click "Submit":
				</p>
				<div className={"my-4 flex w-full flex-row items-center justify-between"}>
					<InputBox
						placeholder={"Enter the refund ID..."}
						onPaste={(event: any) => event.preventDefault()} // disallow pasting to make this action deliberate
						onChange={(value: string) => set_input_match(value === refund_modal.id)}
						maxLength={50}
					/>
					<SmallButton
						className={"h-9 w-[85px] rounded-md border-[3px] bg-transparent font-custom text-regular "}
						disabled={!input_match}
						onClick={() => {
							set_loading(true);
							input_match && onSubmit();
						}}
					>
						Submit
					</SmallButton>
				</div>
				{warning && <ErrorMessage message={warning} />}
			</div>
		</Modal>
	);
};

export default RefundModal;
