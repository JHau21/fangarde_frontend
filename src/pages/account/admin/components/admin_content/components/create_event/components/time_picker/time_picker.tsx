import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface TimePickerProps {
	className?: string;
	selectedTime: Date;
	handleTimeChange: Function;
	width?: number;
	minTime?: Date;
}

const TimePicker = ({ className, selectedTime, handleTimeChange, width, minTime }: TimePickerProps) => {
	const time_picker_style: string =
		className ??
		`
			m-0 
			h-[35px] 
			w-full
			text-left 
			font-custom 
			font-normal 
			text-regular 
			text-fangarde-black 
			p-[2px] 
			pl-[5px] 
			border-2 
			border-medium-blue 
			rounded-md 
			hover:border-dark-blue 
			focus:border-dark-blue 
			focus:outline-0 
		`;

	const calculateMinTime = (date: Date) => {
		const today = minTime ? minTime : new Date();
		let isToday = date.toDateString() === today.toDateString();
		if (isToday) {
			today.setHours(today.getHours());

			return today;
		}
		const newDate = new Date(date);
		return new Date(newDate.setHours(0, 0, 0, 0));
	};

	const calculateMaxTime = () => {
		return new Date(new Date().setHours(23, 59, 59, 999));
	};
	const CustomTimeInput: React.FC<{ value?: string; onClick?: () => void }> = ({ value = "", onClick }) => (
		<input
			className={time_picker_style} // Use the same class as the date picker
			value={value}
			onClick={onClick}
			readOnly // Set the input to read-only to prevent manual entry
		/>
	);
	return (
		<div style={{ width: width ? `${width} px` : "100%" }}>
			<DatePicker
				popperPlacement="bottom-start"
				className={time_picker_style}
				id="time-picker"
				showTimeSelect
				showTimeSelectOnly
				timeIntervals={30}
				timeCaption="Time"
				dateFormat="h:mm aa"
				selected={selectedTime}
				onChange={(time: Date) => handleTimeChange(time)}
				minDate={new Date()}
				minTime={calculateMinTime(selectedTime)}
				maxTime={calculateMaxTime()}
				customInput={<CustomTimeInput />} // Add this line to use a custom input component
			/>
		</div>
	);
};

export default TimePicker;
