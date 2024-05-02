import InputBox from "components/input_box";

import styles from "./styles.module.css";
import common from "../../../../../../common/css/common.module.css";

type Props = {
	header: string;
	placeholder: string;
	web_url: string;
	onChange: Function;
};

const WebURLInput = ({ header, placeholder, web_url, onChange }: Props) => {
	return (
		<div className={styles.input_container}>
			<p className={common.common_bold}>{header}</p>
			<InputBox placeholder={placeholder} value={web_url} onChange={(value: string) => onChange(value)} />
		</div>
	);
};

export default WebURLInput;
