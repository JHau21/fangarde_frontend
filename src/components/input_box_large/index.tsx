import styles from "./index.module.css";

interface InputBoxProps {
	value: string;
	setValue: Function;
	error: boolean;
}

const InputBoxLarge = ({ value, setValue, error }: InputBoxProps) => {
	return (
		<div className={styles.root}>
			<textarea
				className={styles.inputLong}
				value={value}
				maxLength={1245}
				onChange={(e) => {
					const value = e.target.value;
					setValue(value);
				}}
			/>
			{error && (
				<p className={styles.errorMessage}>
					{"This field is required!"}
				</p>
			)}
		</div>
	);
};

export default InputBoxLarge;
