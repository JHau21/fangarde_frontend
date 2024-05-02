import RadioButton from "components/radio_button";

import styles from "./radio_component.module.css";

import { RadioOptions } from "./types/types";

interface RadioComponentProps {
	options: RadioOptions[];
	row?: boolean;
	title?: string;
	index?: number;
	selected_button_class?: string;
	custom_button_class ?: string;
	selected_value?: string;
}

const RadioComponent = ({ options, row, title, index, selected_button_class, custom_button_class, selected_value }: RadioComponentProps) => {
	function renderRadio() {
		return options.map((option, index) => {
			const { id, label, value, checked } = option;

			return (
				<div className="mx-[10px]">
					<RadioButton
						id={id}
						key={index}
						label={label}
						value={value.toString()}
						checked={checked}
						onChange={(child_value: string) => option.handleChange(child_value)}
						selected_button_class={selected_button_class}
						custom_button_class={custom_button_class}
						selected_value={selected_value}
					/>
				</div>
			);
		});
	}

	return (
		<div className={styles.inputContainer}>
			{title && <h3>{title}</h3>}
			<div className={!row ? styles.radioForm : styles.rowRadioForm}>{renderRadio()}</div>
		</div>
	);
};

export default RadioComponent;
