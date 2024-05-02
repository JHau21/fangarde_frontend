import DateSelector from "../../date_selector/date_selector";
import TimePicker from "../../time_picker/time_picker";

import { roundDateToNearest30Minutes } from "common/functions";

type Props = {
	title: string;
	event: EventCreate;
	set_event: Function;
	render_errors: Function;
	handle_change: Function;
	date_type: "event_start_time" | "event_end_time";
};

const TimeSelectionSection = ({ title, event, set_event, render_errors, handle_change, date_type }: Props) => {
	return (
		<div className={"flex flex-col items-center"}>
			<h2 className={"my-[20px] p-0"}>{title}</h2>
			<div className={"flex w-[770px] flex-row justify-between"}>
				<div className={"relative flex flex-col items-start"}>
					<h3>Event Date:</h3>
					<DateSelector
						selectedDate={event[date_type]}
						handleDateChange={(value: Date) => {
							const now = roundDateToNearest30Minutes(new Date());

							if (value < now) {
								const new_event: EventCreate = {
									...event,
									[date_type]: now,
								};
								set_event(new_event);
							} else {
								const new_event: EventCreate = {
									...event,
									[date_type]: new Date(new Date(value).setHours(event[date_type].getHours())),
								};
								set_event(new_event);
							}
						}}
						dateFormat="MM/dd/yyyy"
						width={184}
						minDate={new Date()}
					/>
					{render_errors(date_type)}
				</div>
				<div className={"relative flex flex-col items-start"}>
					<h3>Event Time:</h3>
					<TimePicker
						selectedTime={event[date_type]}
						handleTimeChange={(value: Date) => handle_change(value, date_type)}
					/>
					{render_errors(date_type)}
				</div>
				<div className={"relative flex flex-col items-start"}>
					<h3>Event Day:</h3>
					<DateSelector
						selectedDate={event[date_type]}
						handleDateChange={(value: Date) => handle_change(value, date_type)}
						dateFormat="EEEE"
						width={184}
						minDate={new Date()}
						readonly
					/>
					{render_errors(date_type)}
				</div>
			</div>
		</div>
	);
};

export default TimeSelectionSection;
