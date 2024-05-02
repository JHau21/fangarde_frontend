import InputBox from "components/input_box";

import styles from "./styles.module.css";
import common from "../../../../../../../common/css/common.module.css";

type Props = {
	header: string;
	placeholder: string;
	phone_number: string;
	onChange: Function;
	readonly?: boolean;
};

const PhoneNumberInput = ({ header, placeholder, phone_number, onChange, readonly }: Props) => {
	const format_phone_number_display = (phone_number_input: string) => {
		if (phone_number_input) {
			if (phone_number_input.length > 6) {
				const block_one: RegExpMatchArray | [] = /^\d{3}/.exec(phone_number_input) || [];

				const block_two: RegExpMatchArray | [] = /^\d{3}/.exec(phone_number_input.slice(3)) || [];

				const block_three: RegExpMatchArray | [] = /^\d{1,4}/.exec(phone_number_input.slice(6)) || [];

				return "(" + block_one[0] + ") " + block_two[0] + "-" + block_three[0];
			} else if (phone_number_input.length > 3) {
				const block_one: RegExpMatchArray | [] = /^\d{3}/.exec(phone_number_input) || [];
				const block_two: RegExpMatchArray | [] = /^\d{1,3}/.exec(phone_number_input.slice(3)) || [];

				return "(" + block_one[0] + ") " + block_two[0];
			}
		}

		return phone_number_input;
	};

	return (
		<div className={styles.input_container}>
			<p className={common.common_bold}>{header}</p>
			<InputBox
				type="text"
				readOnly={readonly}
				placeholder={placeholder}
				value={format_phone_number_display(phone_number)}
				onChange={(value: string) => onChange(value)}
				maxLength={14}
			/>
		</div>
	);
};

export default PhoneNumberInput;
