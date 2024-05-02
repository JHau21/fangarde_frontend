import InputBox from "components/input_box";

import styles from "./styles.module.css";
import common from "../../../../../../common/css/common.module.css";

type Props = {
	header: string;
	placeholder: string;
	ssn: string;
	onChange: Function;
};

const SSNInput = ({ header, placeholder, ssn, onChange }: Props) => {
	const format_ssn_display = (ssn_input: string) => {
		if (ssn_input.length > 5) {
			const block_one: RegExpMatchArray | [] = /^\d{3}/.exec(ssn_input) || [];

			const block_two: RegExpMatchArray | [] = /^\d{2}/.exec(ssn_input.slice(3)) || [];

			const block_three: RegExpMatchArray | [] = /^\d{1,4}/.exec(ssn_input.slice(5)) || [];

			return block_one[0] + "-" + block_two[0] + "-" + block_three[0];
		} else if (ssn_input.length > 3) {
			const block_one: RegExpMatchArray | [] = /^\d{3}/.exec(ssn_input) || [];
			const block_two: RegExpMatchArray | [] = /^\d{1,2}/.exec(ssn_input.slice(3)) || [];

			return block_one[0] + "-" + block_two[0];
		}

		return ssn_input;
	};

	return (
		<div className={styles.input_container}>
			<p className={common.common_bold}>{header}</p>
			<InputBox
				placeholder={placeholder}
				value={format_ssn_display(ssn)}
				onChange={(value: string) => onChange(value)}
				maxLength={11}
			/>
		</div>
	);
};

export default SSNInput;
