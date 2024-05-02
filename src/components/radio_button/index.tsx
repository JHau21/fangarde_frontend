import SmallButton from "components/small_button/small_button";

type Props = {
	checked: boolean;
	check_box_class?: string;
	disabled?: boolean;
	id?: any;
	key?: number;
	label: React.ReactNode;
	label_class?: string;
	value?: string;
	onChange: Function;
	custom_button_class?: string;
	selected_button_class?: string;
	selected_value?: string;
};

const RadioButton = ({
	checked,
	check_box_class,
	disabled,
	id,
	key,
	label,
	label_class,
	value,
	onChange,
	custom_button_class,
	selected_button_class,
	selected_value,
}: Props) => {
	const check_box_style: string =
		check_box_class ??
		`
            m-0 
            mr-[10px] 
            p-0 
            appearance-none 
            bg-white 
            w-[16px] 
            h-[16px] 
            border-2 
            border-light-blue 
            hover:cursor-pointer 
            hover:border-medium-blue 
            checked:border-dark-blue 
			checked:bg-dark-blue
        `;

	const label_style: string =
		label_class ??
		`
            m-0 
            p-0 
            text-left 
			font-custom 
			font-normal 
			text-regular 
			text-fangarde-black 
            flex 
            flex-row 
            items-center 
            h-full 
        `;

	if (custom_button_class) {
		return (
			<SmallButton
				className={selected_value?.toString() === value?.toString() ? selected_button_class : custom_button_class}
				onClick={() => {
					onChange(value);
				}}
			>
				{label}
			</SmallButton>
		);
	} else {
		return (
			<label className={label_style} key={key}>
				<input
					id={id}
					className={check_box_style}
					disabled={disabled}
					type={"radio"}
					value={value}
					checked={checked}
					onChange={(event) => onChange(event.target.value)}
				/>
				{label}
			</label>
		);
	}
};

export default RadioButton;
