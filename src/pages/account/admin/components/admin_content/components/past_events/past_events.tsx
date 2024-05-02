import { useState, useEffect } from "react";
import styles from "./past_events.module.css";
import dropdown_arrow from "../../../../../../../common/icons/dropdown_arrow.svg";
import { useUser } from "../../../../../../../state/useUser";
import { EventContext, Filters } from "../../../../types/types";
import { empty_filters } from "../../../../types/types";
import EventCard from "../event_card/event_card";
import { search_events } from "../../../admin_menu/api";
import Loader from "../../../../../../../partials/loader/loader";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Genre } from "../../../../../../../common";

import { common_admin_root } from "common/styles/admin";

const PastEvents = () => {
	const [filters, set_filters] = useState<Filters>(empty_filters);
	const [order, set_order] = useState<string>("Soonest");
	const [load, set_load] = useState<boolean>(false);
	const pastEvents = useUser((state) => state.pastEvents);
	const setPastEvents = useUser((state) => state.setPastEvents);
	const context: EventContext = useOutletContext();
	const navigate = useNavigate();

	async function handleChange(value: any, header: keyof Filters) {
		await set_filters({
			...filters,
			[header]: value,
		});
	}
	//Render Events
	const onSeeDetails = (event: EventModel) => {
		navigate(`${event._id}`);
		context.set_selected_event(event);
	};
	function render_event_cards() {
		return pastEvents.map((event, idx) => (
			<div key={idx} className={styles.eventCardWrapper}>
				<EventCard event={event} key={idx} onSeeDetails={onSeeDetails} />
			</div>
		));
	}
	function order_events(option: any) {
		if (option === "Soonest") {
			setPastEvents(
				pastEvents.slice(0).sort((event1, event2) => {
					return new Date(event1.event_start_time).getTime() - new Date(event2.event_start_time).getTime();
				})
			);
		} else if (option === "Latest") {
			setPastEvents(
				pastEvents.slice(0).sort((event1, event2) => {
					return new Date(event2.event_start_time).getTime() - new Date(event1.event_start_time).getTime();
				})
			);
		}
	}
	function onSuccess(data: any) {
		set_load(false);
		setPastEvents(data.events);
	}
	function onError(data: any) {
		set_load(false);
	}
	useEffect(() => {
		order_events(order);
	}, [order]);
	useEffect(() => {
		set_load(true);
		let orderNumber = -1;
		if (order === "Soonest") {
			orderNumber = 1;
		}
		search_events(filters, orderNumber, "past_events", onSuccess, onError);
	}, [filters]);
	return (
		<div className={common_admin_root}>
			<div className={styles.header}>
				<div
					className={
						"my-[40px] flex h-[156px] flex-col items-start justify-between border-l-[3px] border-medium-blue py-[10px] pl-[15px] font-custom text-sm-header font-bold"
					}
				>
					<div className={styles.row}>
						Event Name
						<div className={"ml-[15px] border-l-[3px] border-medium-blue pl-[15px] text-dark-blue"}>
							<input
								className={styles.search}
								placeholder={"Search for an event by name..."}
								type="text"
								onChange={(e) => {
									const value = e.target.value;
									handleChange(value, "name");
								}}
							/>
						</div>
					</div>
					{
						//TODO Refactor and consolidate the filters into one component
						// TODO These include filters in past event, upcoming events, and all events
						// TODO Additionally we ahould add filters to the accounting page
					}
					{/* <div className={styles.row}>
						<div style={{ alignSelf: "center" }}>Time</div>
						<div className={styles.date}>
							Start Date:
							<div className={styles.dateWrapper}>
								<DateSelector
									selectedDate={filters.start_time}
									handleDateChange={(value: Date) =>
										handleChange(new Date(new Date(value).setHours(0, 0, 0, 0)), "start_time")
									}
									dateFormat="MM/dd/yyyy"
									width={150}
									maxDate={new Date()}
								/>
								<p className={styles.dateRemove} onClick={() => handleChange(undefined, "start_time")}>
									Remove
								</p>
							</div>
							End Date:
							<div className={styles.dateWrapper}>
								<DateSelector
									selectedDate={filters.end_time}
									handleDateChange={(value: Date) =>
										handleChange(new Date(new Date(value).setHours(23, 59, 59, 999)), "end_time")
									}
									dateFormat="MM/dd/yyyy"
									width={150}
									maxDate={new Date()}
								/>
								<p className={styles.dateRemove} onClick={() => handleChange(undefined, "end_time")}>
									Remove
								</p>
							</div>
						</div>
					</div> */}
					<div className={styles.row}>
						Location
						<div className={"ml-[15px] border-l-[3px] border-medium-blue pl-[15px] text-dark-blue"}>
							<input
								className={styles.search}
								placeholder={"Anywhere..."}
								type="text"
								onChange={(e) => {
									const value = e.target.value;
									handleChange(value, "location");
								}}
							/>
						</div>
					</div>
					<div className={styles.row}>
						Genre
						<select
							className={
								"ml-[15px] border-l-[3px] border-medium-blue pl-[15px] text-sm-header font-normal text-fangarde-black hover:cursor-pointer"
							}
							defaultValue={Genre.None}
							onChange={(event) => {
								const value = event.target.value;
								handleChange(value, "genre");
							}}
						>
							{Object.entries(Genre)
								.reverse()
								.map(([key, value], idx) => (
									<option key={idx} value={value}>
										{key}
									</option>
								))}
						</select>
					</div>
				</div>
				<p style={{ margin: "0px" }}>
					If you would like to edit an event, print a guest list, or just see more information, select the “See Details”
					button on the desired event card.
				</p>
			</div>
			<div className={styles.orderRow}>
				<h3 className={styles.headerTitle}>
					Events Ordered By: <p className={styles.plain}>{order}</p>
				</h3>
				<img className={styles.dropdownArrow} src={dropdown_arrow} alt={"Dropdown Arrow"} />
				<select className={styles.select} id="select" onChange={(event) => set_order(event.target.value)}>
					<option value={"Soonest"}>Soonest</option>
					<option value={"Latest"}>Latest</option>
				</select>
			</div>
			<div className={styles.eventCards}>
				{load && (
					<div className={styles.loader}>
						<Loader />
					</div>
				)}
				{pastEvents.length > 0 && !load ? (
					render_event_cards()
				) : (
					<h3 className={styles.noResults}>
						Search for an event, select a time frame, or choose a location to see your events.
					</h3>
				)}
			</div>
		</div>
	);
};

export default PastEvents;
