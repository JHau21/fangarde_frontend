import SmallButton from "../../../../../../../components/small_button/small_button";
import styles from "./event_card.module.css";
import default_event_image from "../../../../../../../common/images/default_concert_stage_image3.png";

interface EventCardProps {
	event: FullEvent;
	onSeeDetails: Function;
}

const EventCard = ({ event, onSeeDetails }: EventCardProps) => {
	// Helper function to format the time till event section of the event card
	function format_time(date: Date) {
		const today: Date = new Date();

		const js_date: Date = new Date(date);

		const curr_month: number = today.getMonth() + 1;
		const event_month: number = js_date.getMonth() + 1;
		const curr_year: number = today.getFullYear();
		const event_year: number = js_date.getFullYear();

		if (js_date < today) {
			return null; // Don't display past events.
		}

		if (event_month - curr_month === 0) {
			const diff = js_date.getDate() - today.getDate();

			switch (diff) {
				case 0: {
					return "Today!";
				}
				case 1: {
					return "Tomorrow!";
				}
				default: {
					return diff + " days away!";
				}
			}
		} else if (event_year - curr_year === 0) {
			const diff = event_month - curr_month;

			switch (diff) {
				case 1: {
					return "Next month!";
				}
				default: {
					return diff + " months away!";
				}
			}
		} else {
			const diff = event_year - curr_year;

			switch (diff) {
				case 1: {
					return "Next year!";
				}
				default: {
					return diff + " years away!";
				}
			}
		}
	}

	function getDisplayDate(date: Date) {
		const myDate = new Date(date);
		var monthStr = myDate.toLocaleString("en-US", { month: "short" });
		var dayStr = myDate.toLocaleString("en-US", { day: "numeric" });
		var suffix;
		if (dayStr.endsWith("1") && !dayStr.endsWith("11")) {
			suffix = "st";
		} else if (dayStr.endsWith("2") && !dayStr.endsWith("12")) {
			suffix = "nd";
		} else if (dayStr.endsWith("3") && !dayStr.endsWith("13")) {
			suffix = "rd";
		} else {
			suffix = "th";
		}
		return monthStr + " " + dayStr + suffix;
	}

	return (
		<div>
			<div className={"flex h-[190px] w-[869px] flex-row items-center justify-between rounded-md border-2 border-medium-blue"}>
				<div
					className={
						"ml-[13px] mr-[30px] flex h-[160px] w-[213px] items-center overflow-hidden rounded-md border-2 border-medium-blue"
					}
				>
					<img
						className={styles.eventCardImage}
						src={event?.search_image ? event.search_image : default_event_image}
						alt={"Event Location"}
					/>
				</div>
				<div className={styles.eventCardInfo}>
					<div className={styles.cardColumn}>
						<p className={"m-0 max-w-[600px] truncate p-0 text-sm-header font-bold"}>{event.name}</p>
						<p className={"m-0 mt-[20px] max-w-[600px] truncate font-custom text-sm-header text-fangarde-gray"}>
							{getDisplayDate(event.event_start_time)} @ {event.location.name}
						</p>
					</div>
					<div className={styles.cardRow}>
						<p className={"font-custom text-sm-header font-bold text-dark-blue"}>
							{format_time(event.event_start_time)}
						</p>
						<SmallButton onClick={() => onSeeDetails(event)}>See Details</SmallButton>
					</div>
				</div>
			</div>
		</div>
	);
};
export default EventCard;
