import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { EventContext } from "../../../../../types/types";

import SmallButton from "../../../../../../../../components/small_button/small_button";
import SpreadsheetModal from "../../upcoming_events/event_details/get_attendees_modal/get_attendees_modal";

import styles from "./past_event_details.module.css";
import default_banner_image from "../../../../../../../../common/images/default_concert_stage_image3.png";

const PastEventDetails = () => {
	//Context
	const context: EventContext = useOutletContext();
	const { selected_event } = context;
	const [show_modal, set_show_modal] = useState<boolean>(false);

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
	const formattedAddress = `${selected_event?.location.address?.street} ${selected_event?.location.address?.city}, ${selected_event?.location?.address.state} ${selected_event?.location?.address.zip}`;

	return (
		<div>
			<h2 className={styles.headerTitle}>Past Event Information</h2>
			<div style={{ position: "relative" }}>
				<div className={styles.header}>
					<div className={styles.editRow}>
						<div className={styles.buttonColumn}>
							<SmallButton
								onClick={() => {
									set_show_modal(!show_modal);
								}}
							>
								Get Attendee List
							</SmallButton>
						</div>
					</div>
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
							<div className={"ml-[15px] border-l-[4px] border-medium-blue pl-[15px] font-custom text-fangarde-gray"}>
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
								className={"ml-[15px] max-w-[450px] border-l-[4px] border-medium-blue pl-[15px] text-fangarde-gray"}
							>
								{selected_event?.genre}
							</div>
						</div>
					</div>
				</div>
				<div className={styles.eventInfo}>
					<div className={styles.column}>
						<h2>General Information</h2>
						<div className={"flex h-[160px] flex-col items-start justify-between"}>
							<h3 className={"w-full max-w-[450px] font-bold text-medium-blue"}>
								Event Name:{" "}
								<p className={"w-full truncate font-custom text-sm-header font-normal text-fangarde-black"}>
									{selected_event?.name}
								</p>
							</h3>
							<h3 className={"w-full max-w-[450px] font-bold text-medium-blue"}>
								Event Genre:{" "}
								<p className={"w-full truncate font-custom text-sm-header font-normal text-fangarde-black"}>
									{selected_event?.genre}
								</p>
							</h3>
							<h3 className={"w-full max-w-[450px] font-bold text-medium-blue"}>
								Event Description:{" "}
								<p className={"w-full truncate font-custom text-sm-header font-normal text-fangarde-black"}>
									{selected_event?.description ? selected_event.description : "None"}
								</p>
							</h3>
						</div>
					</div>
					<div className={styles.imageColumn}>
						<h2>Event Search Image</h2>
						<div className="relative flex cursor-pointer items-center justify-center self-center overflow-hidden rounded-lg bg-[#808080] md:h-[270px] md:w-[350px]">
							<img
								src={selected_event?.search_image ? selected_event.search_image : default_banner_image}
								alt={"Event Location"}
								className=" md:w-[350px]"
							/>
						</div>
					</div>
				</div>
				<div className={styles.eventInfo}>
					<div className={styles.column}>
						<h2>Event Search Image</h2>
						<div className={"flex h-[160px] flex-col items-start justify-between"}>
							<h3 className={"w-full max-w-[450px] font-bold text-medium-blue"}>
								Location Name:{" "}
								<p className={"w-full truncate font-custom text-sm-header font-normal text-fangarde-black"}>
									{selected_event?.location.name}
								</p>
							</h3>
							<h3 className={"w-full max-w-[450px] font-bold text-medium-blue"}>
								Address:{" "}
								<p className={"w-full truncate font-custom text-sm-header font-normal text-fangarde-black"}>
									{selected_event?.location.address.street ? formattedAddress : "None"}
								</p>
							</h3>
							<h3 className={"w-full max-w-[450px] font-bold text-medium-blue"}>
								Location Instruction:{" "}
								<p className={"w-full truncate font-custom text-sm-header font-normal text-fangarde-black"}>
									{selected_event?.name}
								</p>
							</h3>
						</div>
					</div>
					<div className={styles.imageColumn}>
						<h2>Event Banner Image</h2>
						<div className="relative flex cursor-pointer items-center justify-center self-center overflow-hidden rounded-lg bg-[#808080] md:h-[270px] md:w-[350px]">
							<img
								src={selected_event?.banner ? selected_event.banner : default_banner_image}
								alt={"Event Location"}
								className=" md:w-[350px]"
							/>
						</div>
					</div>
				</div>
				{show_modal && (
					<SpreadsheetModal
						event={selected_event as any}
						data={selected_event.transactions}
						onExit={() => set_show_modal(false)}
						ticket_types={selected_event.ticket_types}
					/>
				)}
			</div>
		</div>
	);
};

export default PastEventDetails;
