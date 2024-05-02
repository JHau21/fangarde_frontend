import InputBox from "components/input_box";

import styles from "./styles.module.css";
import common from "../../../../../../common/css/common.module.css";

type Props = {
	header: string;
	placeholder: string;
	dob: string;
	onChange: Function;
};

const DOBInput = ({ header, placeholder, dob, onChange }: Props) => {
	const format_dob_display = (dob_input: string) => {
		if (dob_input.length > 4) {
			const block_one: RegExpMatchArray | [] = /^\d{2}/.exec(dob_input) || [];

			const block_two: RegExpMatchArray | [] = /^\d{2}/.exec(dob_input.slice(2)) || [];

			const block_three: RegExpMatchArray | [] = /^\d{1,4}/.exec(dob_input.slice(4)) || [];

			return block_one[0] + "/" + block_two[0] + "/" + block_three[0];
		} else if (dob_input.length > 2) {
			const block_one: RegExpMatchArray | [] = /^\d{2}/.exec(dob_input) || [];
			const block_two: RegExpMatchArray | [] = /^\d{1,2}/.exec(dob_input.slice(2)) || [];

			return block_one[0] + "/" + block_two[0];
		}

		return dob_input;
	};

	return (
		<div className={styles.input_container}>
			<p className={common.common_bold}>{header}</p>
			<InputBox
				placeholder={placeholder}
				value={format_dob_display(dob)}
				onChange={(value: string) => onChange(value)}
				maxLength={10}
			/>
		</div>
	);
};

export default DOBInput;
