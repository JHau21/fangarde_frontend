import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface DateSelectorProps {
	className?: string;
	selectedDate?: Date;
	handleDateChange: Function;
	dateFormat: string;
	width?: number;
	minDate?: Date;
	maxDate?: Date;
	readonly?: boolean;
}

const DateSelector = ({
	className,
	selectedDate,
	handleDateChange,
	dateFormat,
	width,
	minDate,
	maxDate,
	readonly,
}: DateSelectorProps) => {
	const date_selector_style: string =
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

	return (
		<div style={{ width: width ? `${width} px` : "100%" }}>
			<DatePicker
				popperPlacement="bottom-start"
				wrapperClassName={date_selector_style}
				className={date_selector_style}
				selected={selectedDate}
				onChange={(date: Date) => handleDateChange(date)}
				dateFormat={dateFormat}
				minDate={minDate ? minDate : null}
				maxDate={maxDate ? maxDate : null}
				placeholderText={"None"}
				readOnly={readonly}
			/>
		</div>
	);
};

export default DateSelector;
