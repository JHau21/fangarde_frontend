import { useEffect, useState } from "react";

import ErrorMessage from "components/error_message";
import InputBox from "components/input_box";
import PhoneNumberInput from "../sign_up_owner/sign_up_owner/sign_up_owner_components/phone_number";

import styles from "./input_form.module.css";

interface InputFormProps {
	editMode?: boolean;
	setUser: Function;
	user: User;
	setError: Function;
	error: UserError;
	displayErrors?: boolean;
	confirmEmail?: boolean;
}
const InputForm = ({
	editMode = true,
	setUser = () => {},
	user = {
		first_name: "",
		last_name: "",
		email: "",
		confirm_email: "",
		phone_number: "",
	},
	setError = () => {},
	error,
	displayErrors = true,
	confirmEmail = true,
}: InputFormProps) => {
	const initializeErrors: UserError = {
		first_name: user?.first_name ? false : true,
		last_name: user?.last_name ? false : true,
		email: user?.email ? false : true,
		confirm_email: user?.confirm_email ? false : true,
		phone_number: user?.phone_number ? false : true,
	};
	const [emptyFields, setEmptyFields] = useState<UserError>(initializeErrors);

	//Validation Functions
	const validateEmail = (input: string) => {
		const emailRegex =
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		if (input === "") {
			return true;
		}
		return emailRegex.test(input);
	};
	const validateName = (input: string) => {
		const nameRegex = /^[a-zA-Z]+$/;
		if (input === "") {
			return true;
		}
		return nameRegex.test(input);
	};
	const validateConfirmEmail = (input: string) => {
		if (input === "" || !confirmEmail) {
			return true;
		}
		return input === user?.email;
	};
	const validateEmailMatch = (input: string) => {
		if (input === "" || !confirmEmail) {
			return true;
		}
		return input === user.confirm_email;
	};
	const validatePhoneNumber = (input: string) => {
		if (input === "" || input?.length < 10) {
			return false;
		}
		return true;
	};
	function handleChange(emptyFields: UserError, userChange: User, errorChange: UserError) {
		setEmptyFields({
			...emptyFields,
		});
		setUser({...userChange})
		setError({...errorChange})
	}
	const renderErrors = (inputName: keyof UserError) => {
		const errorMsg: User = {
			first_name: "Not a valid name.",
			last_name: "Please enter a name.",
			email: "Not a valid email.",
			confirm_email: "Your emails do not match",
			phone_number: "Not a valid phone number",
		};
		if(displayErrors){
			if (error[inputName] || emptyFields[inputName]) {
				return <ErrorMessage message={errorMsg[inputName]} />;
			}
			else return <></>;
		}
			else return <></>;
	};
	return (
		<div className={styles.userInputColumn}>
			<div className={styles.userInputRow}>
				<div className={styles.nameColumn}>
					<p className="common_bold">First Name:</p>
					<InputBox
						readOnly={!editMode}
						value={user?.first_name}
						onChange={(value: string) => {
							let empty = value === "";

							handleChange(
								{
									...emptyFields,
									first_name: empty,
								},
								{
									...user,
									first_name: value,
								},
								{
									...error,
									first_name: !validateName(value),
								}
							);
						}}
					/>
					{renderErrors("first_name")}
				</div>
				<div className={styles.nameColumn}>
					<p className="common_bold">Last Name:</p>
					<InputBox
						readOnly={!editMode}
						value={user?.last_name}
						onChange={(value: string) => {
							let empty = value === "";
							handleChange(
								{
									...emptyFields,
									last_name: empty,
								},
								{
									...user,
									last_name: value,
								},
								{
									...error,
									last_name: !validateName(value),
								}
							);
						}}
					/>
					{renderErrors("last_name")}
				</div>
			</div>
			<div className={styles.userInput}>
				<p className="common_bold">Email:</p>
				<InputBox
					readOnly={!editMode}
					value={user?.email}
					onChange={(value: string) => {
						let empty = value === "";
						handleChange(
							{
								...emptyFields,
								email: empty,
							},
							{
								...user,
								email: value,
							},
							{
								...error,
								email: !validateEmail(value),
								confirm_email: !validateEmailMatch(value),
							}
						);
					}}
				/>
				{renderErrors("email")}
			</div>
			{editMode && confirmEmail && (
				<div className={styles.userInput}>
					<p className="common_bold">Confirm Email:</p>
					<InputBox
						readOnly={!editMode}
						value={user?.confirm_email}
						onChange={(value: string) => {
							let empty = value === "";

							handleChange(
								{
									...emptyFields,
									confirm_email: empty,
								},
								{
									...user,
									confirm_email: value,
								},
								{
									...error,
									confirm_email: !validateConfirmEmail(value),
								}
							);
						}}
					/>
					{renderErrors("confirm_email")}
				</div>
			)}
			<div className={styles.userInput}>
					<PhoneNumberInput
						readonly={!editMode}
						header={"Phone Number:"}
						placeholder={"(XXX) XXX-XXXX"}
						phone_number={user?.phone_number}
						onChange={(phone_number: string) => {
							if (phone_number.length > 14) {
								phone_number = phone_number.slice(0, 14);
							}

							phone_number = phone_number.replace(/[^\d]/g, "");

							let empty = phone_number === "";

							handleChange(
								{
									...emptyFields,
									phone_number: empty,
								},
								{
									...user,
									phone_number: phone_number,
								},
								{
									...error,
									phone_number: !validatePhoneNumber(phone_number),
								}
							);
						}}
					/>
				{renderErrors("phone_number")}
			</div>
		</div>
	);
};

export default InputForm;
