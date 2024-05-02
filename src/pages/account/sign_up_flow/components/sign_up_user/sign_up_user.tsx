import { useEffect, useState } from "react";

import InputBox from "components/input_box";

import { api } from "axiosClients/client";
import { SignUpStep } from "common";
import checkBoxIcon from "common/icons/checkbox.svg";
import exitIcon from "common/icons/exit.svg";
import SmallButton from "components/small_button/small_button";
import InputForm from "pages/account/sign_up_flow/components/input_form/input_form";
import { emptyUserSignUpError } from "pages/account/sign_up_flow/types/types";
import { use_sign_up } from "state/use_sign_up";

import styles from "./sign_up_user.module.css";

interface SignUpUserProps {
	onSubmit: Function;
}

const SignUpUser = ({ onSubmit }: SignUpUserProps) => {
	//State Variables
	const { new_user, set_new_user, set_sign_up_step } = use_sign_up((state) => ({
		new_user: state.new_user,
		set_new_user: state.set_new_user,
		set_sign_up_step: state.set_sign_up_step,
	}));

	const [user, setUser] = useState<UserSignUp>(new_user);
	const [error, setError] = useState<UserSignUpError>(emptyUserSignUpError);
	const [submitAttempts, setSubmitAttempts] = useState<number>(0);
	const [submitError, setSubmitError] = useState<String>("");
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

	//Variable to displayErrors
	const displayErrors = submitAttempts > 0;
	//Variables to validate password
	const validatePasswordLength = !(user.password.length < 6 || user.password.length > 12);
	const validatePasswordUpper = /[A-Z]/.test(user.password);
	const validatePasswordSpecial = /[\W_]/.test(user.password);
	const validatePassword = validatePasswordLength && validatePasswordUpper && validatePasswordSpecial;
	const validatePasswordsMatch = user.password === user.confirm_password;

	//Function to Check if Form is Good For Submission
	function errorExistsOrIsFormIncomplete() {
		// Check if Error is Present //
		let errorExists = false;
		if (error.first_name || error.last_name || error.email || error.confirm_email || error.password || error.confirm_password) {
			errorExists = true;
			return errorExists;
		}
		// Check if Form is Complete //
		let formIncomplete = false;
		if (
			user.first_name === "" ||
			user.last_name === "" ||
			user.email === "" ||
			user.confirm_email === "" ||
			user.password === "" ||
			user.confirm_password === "" ||
			user.phone_number.length < 10
		) {
			formIncomplete = true;
			return formIncomplete;
		}
		return formIncomplete || errorExists;
	}

	// Click Handlers //
	async function handleClick() {
		if (!errorExistsOrIsFormIncomplete() && !submitError) {
			set_new_user(user);

			const res = await api.post("/user_exists", {
				email: user.email,
			});
			if (res.data.error) {
				setSubmitError(res.data.message);
			} else if (res.data.user_exists) {
				setSubmitError("User already exists, please login.");
			} else if (!res.data.user_exists) {
				onSubmit(user);
			}
		} else {
			setSubmitAttempts(submitAttempts + 1);
		}
	}

	function handleBack() {
		set_sign_up_step(SignUpStep.SignUpInit);
	}

	//Function to handle Password Input Changes
	function handleChange(valueChange: UserSignUp) {
		setUser(valueChange);
	}

	//Handles updating errors after user is updated
	useEffect(() => {
		const temp_error: UserSignUpError = {
			...error,
			password: !validatePassword,
			confirm_password: !validatePasswordsMatch,
		};
		setError(temp_error);
		setSubmitError("");
	}, [user]);
	return (
		<div className={"mx-36 my-10 flex flex-col items-center"}>
			<div className={styles.column}>
				<h1 className={"common_bold my-[10px]"}>Tell us about yourself!</h1>
				<h2 className={"my-[20px]"}>User Information</h2>
				<InputForm user={user} setUser={setUser} error={error} setError={setError} displayErrors={displayErrors} />
				<h2 className={styles.loginInforamtion}>Login Information</h2>
				<div className={styles.userInputColumn}>
					<div className={styles.userInputRow}>
						<div className={styles.nameColumn}>
							<p className="common_bold">Password:</p>
							<div className={styles.password}>
								<InputBox
									type={showPassword ? "text" : "password"}
									value={user.password}
									onChange={(value: string) =>
										handleChange({
											...user,
											password: value,
										})
									}
								/>
								<p
									className={"absolute right-[10px] top-[5px] cursor-pointer font-bold text-dark-blue"}
									onClick={() => setShowPassword(!showPassword)}
								>
									{showPassword ? "Hide" : "Show"}
								</p>
							</div>
							{validatePasswordLength ? (
								<div className={styles.passwordMsg}>
									<img className={styles.passwordIcon} src={checkBoxIcon} alt={"Length good"} />
									<p className={styles.passwordValid}>Is 8 to 16 characters long.</p>
								</div>
							) : (
								<div className={styles.passwordMsg}>
									<img className={styles.passwordIcon} src={exitIcon} alt={"Length good"} />
									<p className={styles.passwordValid}>Must be 8 to 16 characters long.</p>
								</div>
							)}
							{validatePasswordUpper ? (
								<div className={styles.passwordMsg}>
									<img className={styles.passwordIcon} src={checkBoxIcon} alt={"Length good"} />
									<p className={styles.passwordValid}>Has at least one uppercase letter.</p>
								</div>
							) : (
								<div className={styles.passwordMsg}>
									<img className={styles.passwordIcon} src={exitIcon} alt={"Length good"} />
									<p className={styles.passwordValid}>Must have at least one uppercase letter.</p>
								</div>
							)}
							{validatePasswordSpecial ? (
								<div className={styles.passwordMsg}>
									<img className={styles.passwordIcon} src={checkBoxIcon} alt={"Length good"} />
									<p className={styles.passwordValid}>Has at least one special character.</p>
								</div>
							) : (
								<div className={styles.passwordMsg}>
									<img className={styles.passwordIcon} src={exitIcon} alt={"Length good"} />
									<p className={styles.passwordValid}>Must have at least one special character.</p>
								</div>
							)}
						</div>
						<div className={styles.nameColumn}>
							<p className="common_bold">Confirm Password:</p>
							<div className={styles.password}>
								<InputBox
									type={showConfirmPassword ? "text" : "password"}
									value={user.confirm_password}
									onChange={(value: string) =>
										handleChange({
											...user,
											confirm_password: value,
										})
									}
								/>
								<p
									className={"absolute right-[10px] top-[5px] cursor-pointer font-bold text-dark-blue"}
									onClick={() => setShowConfirmPassword(!showConfirmPassword)}
								>
									{showConfirmPassword ? "Hide" : "Show"}
								</p>
							</div>
							{validatePassword &&
								(validatePasswordsMatch ? (
									<div className={styles.passwordMsg}>
										<img className={styles.passwordIcon} src={checkBoxIcon} alt={"Length good"} />
										<p className={styles.passwordValid}>Passwords match.</p>
									</div>
								) : (
									<div className={styles.passwordMsg}>
										<img className={styles.passwordIcon} src={exitIcon} alt={"Length good"} />
										<p className={styles.passwordValid}>Passwords must match.</p>
									</div>
								))}
						</div>
					</div>
					<div className={styles.buttonRow}>
						<SmallButton
							onClick={() => {
								handleBack();
							}}
						>
							Back
						</SmallButton>
						{/* <SmallButton
							onClick={() => {
								handleClick()
							}}
						>Continue</SmallButton> */}
						<div className={styles.submitError}>
							<SmallButton
								onClick={() => {
									handleClick();
								}}
							>
								Continue
							</SmallButton>
							{submitError && <p className={styles.errorMessage}>{submitError}</p>}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SignUpUser;
