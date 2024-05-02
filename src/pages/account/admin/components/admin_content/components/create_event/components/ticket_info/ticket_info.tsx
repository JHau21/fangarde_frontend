import { useEffect, useState } from "react";
import { CreateEventRequest } from "../../types";
import styles from "./ticket_info.module.css";
import SmallButton from "../../../../../../../../../components/small_button/small_button";
import { TicketType, CreateEmptyTicketType } from "../../../../../../types/types";
import TicketTypeInput from "../ticket_type/ticket_type";
import ObjectId from "bson-objectid";
import { DonationType } from "common";
import ErrorMessage from "components/error_message";

interface TicketInfoProps {
	onSubmit: Function;
	onBack: Function;
	request: CreateEventRequest;
	setRequest: Function;
}
const TicketInfo = ({ onSubmit, onBack, request, setRequest }: TicketInfoProps) => {
	const [displayErrors, setDisplayErrors] = useState<boolean>(false);
	const [isFormComplete, setIsFormComplete] = useState<boolean[]>([]);
	const { ticket_types, event } = request;
	const complete = isFormComplete.every(Boolean);
	function setTicketWithIndex(index: number, info: TicketType) {
		let temp_ticket_types: TicketType[] = ticket_types.slice(0);
		temp_ticket_types[index] = info;
		setRequest({
			...request,
			ticket_types: temp_ticket_types,
		});
	}
	const is_paid = ticket_types.some((ticket_type) => ticket_type.price !== 0);
	function renderTicketTypeForms() {
		return ticket_types.map((ticket_type, idx) => {
			return (
				<div className={styles.adminColumn} key={idx}>
					<TicketTypeInput
						index={idx}
						ticket_type={ticket_type}
						event={event}
						all_ticket_types={ticket_types}
						set_ticket_with_index={setTicketWithIndex}
						displayErrors={displayErrors}
						isFormComplete={isFormComplete}
						setIsFormComplete={setIsFormComplete}
					/>
					{ticket_types.length > 1 && (
						<>
							<div className={styles.deleteButton}>
								<SmallButton
									onClick={() => {
										handleDeleteTicketType(idx);
									}}
								>
									Delete Ticket
								</SmallButton>
							</div>
							<div className={styles.seperator}></div>
						</>
					)}
				</div>
			);
		});
	}
	function handleDeleteTicketType(index: number) {
		let temp_ticket_types = ticket_types.slice(0);
		temp_ticket_types.splice(index, 1);
		setRequest({
			...request,
			ticket_types: temp_ticket_types,
		});

		let tempErrors = isFormComplete.slice(0);
		tempErrors.splice(index, 1);
		setIsFormComplete(tempErrors);
	}

	function addTicketType() {
		let temp_ticket_types = ticket_types.slice(0);
		const newTicketType = CreateEmptyTicketType();
		temp_ticket_types.push({ ...newTicketType, _id: new ObjectId() });
		setRequest({
			...request,
			ticket_types: temp_ticket_types,
		});

		let tempErrors = isFormComplete.slice(0);
		tempErrors.push(true);
		setIsFormComplete(tempErrors);
	}

	//Click Handler
	function handleSubmit() {
		let complete = true;
		isFormComplete.map((isComplete) => {
			if (!isComplete || (!is_paid && event.donation_type === DonationType.Percentage)) {
				complete = false;
			}
			return isComplete;
		});
		if (complete) {
			onSubmit();
		} else {
			setDisplayErrors(true);
		}
	}
	useEffect(() => {
		let temp_ticket_types = ticket_types.slice(0);
		temp_ticket_types[0]._id = new ObjectId();
		setRequest({
			...request,
			ticket_types: temp_ticket_types,
		});
	}, []);

	return (
		<div className="mt-4 flex flex-col items-center">
			<div className={styles.column}>
				<h1 className="my-[20px] p-0">Ticket Information</h1>
				<h2 className="my-[20px] p-0">Your Tickets</h2>
				{renderTicketTypeForms()}
				<div className={styles.button}>
					<SmallButton
						onClick={() => {
							addTicketType();
							setDisplayErrors(false);
						}}
					>
						Add New Ticket
					</SmallButton>
				</div>
				<div className={styles.buttonRow}>
					<SmallButton
						onClick={() => {
							onBack();
						}}
					>
						Back
					</SmallButton>
					<div className={styles.continue}>
						<SmallButton
							onClick={() => {
								handleSubmit();
							}}
						>
							Continue
						</SmallButton>
						{!complete && displayErrors && (
							<p className={styles.errorMessageSubmit}>{"Please fix your errors before submitting!"}</p>
						)}
						{complete && !is_paid && event.donation_type === DonationType.Percentage && (
							<ErrorMessage
								className="absolute left-1 text-sm font-bold text-fangarde-medium-red "
								message="You need to have at least one paid ticket to ask for percentage donations. Add a paid ticket or choose flat donations."
							/>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default TicketInfo;
