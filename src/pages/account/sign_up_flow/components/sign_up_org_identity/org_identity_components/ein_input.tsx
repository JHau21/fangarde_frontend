import InputBox from "components/input_box";

import styles from "./styles.module.css";
import common from "../../../../../../common/css/common.module.css";

type Props = {
	header: string;
	placeholder: string;
	ein: string;
	onChange: Function;
};

const EINInput = ({ header, placeholder, ein, onChange }: Props) => {
	const format_ein_display = (ein_input: string) => {
		if (ein_input.length > 2) {
			const block_one: RegExpMatchArray | [] = /^\d{2}/.exec(ein_input) || [];

			const block_two: string = ein_input.slice(2);

			return block_one[0] + "-" + block_two;
		}

		return ein_input;
	};

	return (
		<div className={styles.input_container}>
			<p className={common.common_bold}>{header}</p>
			<InputBox
				placeholder={placeholder}
				value={format_ein_display(ein)}
				onChange={(value: string) => onChange(value)}
				maxLength={10}
			/>
		</div>
	);
};

export default EINInput;
