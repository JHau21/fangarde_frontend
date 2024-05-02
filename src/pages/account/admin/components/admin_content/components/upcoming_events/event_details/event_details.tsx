import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { EventContext } from "../../../../../types/types";
import styles from "./event_details.module.css";
import default_banner_image from "../../../../../../../../common/images/default_concert_stage_image3.png";

import SmallButton from "../../../../../../../../components/small_button/small_button";
import SpreadsheetModal from "./get_attendees_modal/get_attendees_modal";
import URLModal from "./get_event_url_modal/get_event_url_modal";
import ColorWheel from "../../../../../../../../components/ColorWheel/ColorWheel";

import AdditionalEventInfo from "../../create_event/components/additional_event_info/additional_event_info";
import PromotionsModal from "./promotions_modal/promotions";
import GeneralEventInfo from "../../create_event/components/general_event_info/general_event_info";
import { api } from "axiosClients/client";

const EventDetails = () => {
	//Context
	const [promo_codes, set_promo_codes] = useState<PromoCode[]>([]);
	const context: EventContext = useOutletContext();
	const { selected_event } = context;
	const [edit_mode, set_edit_mode] = useState<boolean>(false);
	const [edit_event, set_edit_event] = useState<FullEvent>(selected_event);
	const [submitError, setSubmitError] = useState<boolean>(false);
	const [success, set_success] = useState<boolean>(false);
	const [show_modal, set_show_modal] = useState<boolean>(false);
	const [show_url_modal, set_show_url_modal] = useState<boolean>(false);
	const [edit_additional_info, set_edit_additional_info] = useState<boolean>(false);
	const [show_promotions_modal, set_show_promotions_modal] = useState<boolean>(false);

	// Format the date component as "MM/DD/YY"
	let dateStr = selected_event?.event_start_time
		? new Date(selected_event?.event_start_time).toLocaleDateString("en-US", {
				month: "2-digit",
				day: "2-digit",
				year: "2-digit",
		  })
		: "";
	// Format the time component as "h:mm am/pm"
	let timeStr = selected_event?.event_start_time
		? new Date(selected_event?.event_start_time).toLocaleTimeString("en-US", {
				hour: "numeric",
				minute: "2-digit",
				hour12: true,
		  })
		: "";
	// Concatenate the formatted date and time strings with the other text
	const displayDate = dateStr + " @ " + timeStr;
	const formattedAddress = `${selected_event?.location.address?.street} ${selected_event?.location.address?.city}, ${selected_event?.location.address?.state} ${selected_event?.location.address?.zip}`;
	function onClickEdit() {
		set_edit_mode(!edit_mode);
		set_success(false);
		setSubmitError(false);
		if (selected_event) {
			set_edit_event(selected_event);
		}
	}
	async function handleSubmit() {
		set_success(false);
		setSubmitError(false);
		const req = {
			event: edit_event,
		};

		const res = await api.post("/update_event", req);

		if (res.status === 200) {
			set_success(true);
			set_success(true);
			set_edit_mode(false);
			setSubmitError(false);
			context.set_selected_event(res.data.updated_event);
		} else {
			set_success(false);
			setSubmitError(true);
		}
	}

	function onClickEditAdditional() {
		set_edit_additional_info(!edit_additional_info);
		set_success(false);
		setSubmitError(false);
		if (selected_event) {
			set_edit_event(selected_event);
		}
	}

	useEffect(() => {
		api.post("/fetch_promo_codes", { event_id: selected_event?._id })
			.then((res) => {
				set_promo_codes(res.data.promo_codes);
			})
			.catch((err) => {
				console.log(err, "Error getting promo codes");
			});
	}, []);

	return (
		<>
			{edit_additional_info && (
				<AdditionalEventInfo
					onSubmit={() => {
						set_edit_additional_info(false);
						handleSubmit();
					}}
					onBack={() => onClickEditAdditional()}
					event={
						{
							...edit_event,
							event_start_time: new Date(edit_event.event_start_time),
							event_end_time: new Date(edit_event.event_end_time),
						} as any
					}
					setEvent={set_edit_event}
				/>
			)}
			{edit_mode && (
				<GeneralEventInfo
					onContinue={() => {
						set_edit_additional_info(false);
						handleSubmit();
					}}
					onBack={() => onClickEdit()}
					event={{
						...edit_event,
						event_start_time: new Date(edit_event.event_start_time),
						event_end_time: new Date(edit_event.event_end_time),
						banner: edit_event.banner ? edit_event.banner : default_banner_image,
						search_image: edit_event.search_image ? edit_event.search_image : default_banner_image,
					}}
					setEvent={set_edit_event}
				/>
			)}
			{!edit_additional_info && !edit_mode && (
				<>
					<div className="m-0 flex flex-row items-center justify-between p-0">
						<h2 className="m-0 p-0">Upcoming Event Information</h2>
						<p
							className={
								"font-custom text-[24px] font-bold text-dark-blue hover:text-light-blue active:text-medium-blue"
							}
							onClick={() => {
								onClickEdit();
							}}
						>
							{"Edit"}
						</p>
					</div>
					<div style={{ position: "relative" }}>
						<div className={styles.header}>
							<div className="flex h-full flex-row items-start justify-between">
								<div className="flex h-[150px] w-[70%] flex-col items-start justify-between border-l-4 border-medium-blue pl-4 font-custom text-sm-header font-bold">
									<div className={"m-0 flex w-full flex-row items-center"}>
										Event Name
										<div
											className={
												"ml-[15px] max-w-[450px] truncate border-l-[4px] border-medium-blue pl-[15px] text-fangarde-gray"
											}
										>
											{selected_event?.name}
										</div>
									</div>
									<div className={"m-0 flex w-full flex-row items-center"}>
										<div>Date/Time</div>
										<div
											className={
												"ml-[15px] border-l-[4px] border-medium-blue pl-[15px] font-custom text-fangarde-gray"
											}
										>
											{displayDate}
										</div>
									</div>
									<div className={"m-0 flex w-full flex-row items-center"}>
										Location
										<div
											className={
												"ml-[15px] max-w-[480px] truncate border-l-[4px] border-medium-blue pl-[15px] text-fangarde-gray"
											}
										>
											{selected_event?.location.name}
										</div>
									</div>
									<div className={"m-0 flex w-full flex-row items-center"}>
										Genre
										<div
											className={
												"ml-[15px] max-w-[450px] border-l-[4px] border-medium-blue pl-[15px] text-fangarde-gray"
											}
										>
											{selected_event?.genre}
										</div>
									</div>
								</div>
								<div className={"flex h-full w-[30%] flex-col items-end justify-evenly"}>
									<SmallButton onClick={() => set_show_modal(!show_modal)}>Get Attendee List</SmallButton>
									<SmallButton onClick={() => set_show_url_modal(!show_modal)}>Get Event URL</SmallButton>
									<SmallButton onClick={() => set_show_promotions_modal(!show_modal)}>Promotions!</SmallButton>
									<SmallButton onClick={() => onClickEditAdditional()}>Edit Additional Information</SmallButton>
									<ColorWheel />
								</div>
							</div>
						</div>
						<div className={styles.eventInfo}>
							<div className={styles.column}>
								<h2 className="m-0 mb-[20px] p-0">General Information</h2>
								<div className={styles.info}>
									<div className={styles.inputRow}>
										<p
											className={
												"mr-[5px] whitespace-nowrap font-custom text-sm-header font-bold text-dark-blue"
											}
										>
											Event Name:
										</p>
										<input
											className={styles.inputInfo}
											value={edit_event?.name ?? "None"}
											type={"text"}
											onChange={(event) => {
												const value = event.target.value;
												set_edit_event({
													...edit_event,
													name: value,
												});
											}}
										/>
									</div>
									<div className={styles.inputRow}>
										<p
											className={
												"mr-[5px] whitespace-nowrap font-custom text-sm-header font-bold text-dark-blue"
											}
										>
											Event Type:
										</p>
										<input className={styles.inputInfo} value={edit_event?.genre} />
									</div>
									<div
										className={styles.row}
										style={{
											marginBottom: "20px",
										}}
									>
										<p
											className={
												"mr-[5px] whitespace-nowrap font-custom text-sm-header font-bold text-dark-blue"
											}
										>
											Organization Description:{" "}
										</p>
									</div>
									<textarea
										className={styles.description}
										rows={4}
										value={edit_event?.description ? edit_event.description : ""}
										placeholder={!selected_event?.description ? "None" : ""}
										readOnly
									></textarea>
								</div>
							</div>
							<div className={styles.imageColumn}>
								<h2 className="m-0 mb-[20px] p-0">Event Banner Image</h2>
								<div className="relative flex cursor-pointer items-center justify-center self-center overflow-hidden rounded-lg bg-[#808080] md:h-[270px] md:w-[350px]">
									<img
										src={selected_event?.banner ? selected_event.banner : default_banner_image}
										alt={"Event Location"}
										className=" md:w-[350px]"
									/>
								</div>
							</div>
						</div>
						<div className={styles.eventInfo}>
							<div className={styles.column}>
								<h2 className="m-0 mb-[20px] p-0">Additional Information</h2>
								<div className={styles.info}>
									<div className={styles.inputRow}>
										<p
											className={
												"mr-[5px] whitespace-nowrap font-custom text-sm-header font-bold text-dark-blue"
											}
										>
											Location Name:
										</p>
										<input
											className={styles.inputInfo}
											value={edit_event?.location.name ? edit_event.location.name : "None"}
											type={"text"}
											readOnly
										/>
									</div>
									<div className={styles.inputRow}>
										<p
											className={
												"mr-[5px] whitespace-nowrap font-custom text-sm-header font-bold text-dark-blue"
											}
										>
											Indoors/Outdoors:
										</p>
										<input className={styles.inputInfo} value={edit_event?.indoors_outdoors} />
									</div>
								</div>
								<p className={"mr-[5px] whitespace-nowrap font-custom text-sm-header font-bold text-dark-blue"}>
									{" "}
									Address:
								</p>
								<input
									className={styles.inputInfoColumn}
									value={formattedAddress ? formattedAddress : "None"}
									type={"text"}
								/>
							</div>
							<div className={styles.imageColumn}>
								<h2 className="m-0 mb-[20px] p-0">Event Search Image</h2>
								<div className="relative flex cursor-pointer items-center justify-center self-center overflow-hidden rounded-lg bg-[#808080] md:h-[270px] md:w-[350px]">
									<img
										src={selected_event?.search_image ? selected_event.search_image : default_banner_image}
										alt={"Event Location"}
										className=" md:w-[350px]"
									/>
								</div>
							</div>
						</div>
						{edit_mode && (
							<SmallButton
								onClick={() => {
									handleSubmit();
								}}
							>
								Save
							</SmallButton>
						)}
						{submitError && <p className={styles.errorMessage}>An error occurred, please try again later.</p>}
						{success && <p className={styles.errorMessage}>Event Updated Successfully!</p>}
						{show_modal && (
							<SpreadsheetModal
								event={selected_event as any}
								data={selected_event.transactions}
								onExit={() => set_show_modal(false)}
								ticket_types={selected_event.ticket_types}
							/>
						)}
						{show_url_modal && <URLModal onExit={() => set_show_url_modal(false)} event_id={selected_event?._id} />}
						{show_promotions_modal && (
							<PromotionsModal
								onExit={() => set_show_promotions_modal(false)}
								promo_codes={promo_codes}
								set_promo_codes={set_promo_codes}
								event_id={selected_event?._id}
							/>
						)}
					</div>
				</>
			)}
		</>
	);
};

export default EventDetails;
