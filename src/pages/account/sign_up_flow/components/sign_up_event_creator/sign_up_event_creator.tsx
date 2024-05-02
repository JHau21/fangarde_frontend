import { useEffect, useState } from "react";

import InputBox from "components/input_box";
import SmallButton from "../../../../../components/small_button/small_button";

import { emptyUserSignUpError, emptyOwner } from "../../types/types";
import InputForm from "../input_form/input_form";
import styles from "./sign_up_event_creator.module.css";
import exitIcon from "common/icons/exit.svg";
import checkBoxIcon from "common/icons/checkbox.svg";
import { SignUpStep } from "common";
import { api } from "axiosClients/client";
import { use_sign_up } from "state/use_sign_up";

interface SignUpEventCreatorProps {
	onSubmit: Function;
	paidEvents: boolean;
}

const SignUpEventCreator = ({ onSubmit, paidEvents }: SignUpEventCreatorProps) => {
	//State Variables
	const { new_admin, new_owner, set_new_admin, set_sign_up_step } = use_sign_up((state) => ({
		new_admin: state.new_admin,
		new_owner: state.new_owner,
		set_new_admin: state.set_new_admin,
		set_sign_up_step: state.set_sign_up_step,
	}));

	const [user, setUser] = useState<AdminSignUp>(new_admin);
	const [error, setError] = useState<UserSignUpError>(emptyUserSignUpError);
	const [displayErrors, setDisplayErrors] = useState<boolean>(false);
	const [submitError, setSubmitError] = useState<String>("");
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

	//Variables to validate password
	const validatePasswordLength = !(user.password.length < 8 || user.password.length > 16);
	const validatePasswordUpper = /[A-Z]/.test(user.password);
	const validatePasswordSpecial = /[\W_]/.test(user.password);
	const validatePassword = validatePasswordLength && validatePasswordUpper && validatePasswordSpecial;
	const validatePasswordsMatch = user.password === user.confirm_password;

	//Function to Check if Form is Good For Submission
	function errorExistsOrIsFormIncomplete() {
		// Check if Error is Present //
		let errorExists = false;
		if (error.first_name || error.last_name || error.email || error.confirm_email || error.phone_number) {
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
			user.phone_number === ""
		) {
			formIncomplete = true;
			return formIncomplete;
		}
		return formIncomplete || errorExists;
	}
	// Click Handlers //
	async function handleClick() {
		if (!errorExistsOrIsFormIncomplete() && !submitError && validatePassword && validatePasswordsMatch) {
			//Save Data
			//Call API to check if admin exists
			try {
				const res = await api.post("/admin_exists", {
					email: user.email,
				});
				if (res.status === 201) {
					const { data } = res;
					if (data.error) {
						setSubmitError(data.message);
					} else if (data.admin_exists) {
						setSubmitError("User already exists, please login.");
					} else if (!data.admin_exists) {
						set_new_admin(user); // idk why we have two state hooks for admins and one is never used but I do as lord David commands
						onSubmit(user);
					}
				}
			} catch (error) {
				console.log("err", error);
			}
		} else {
			setSubmitError("Please fix errors before submitting!");
			setDisplayErrors(true);
		}
	}
	function handleBack() {
		if (new_owner !== emptyOwner && paidEvents) {
			set_sign_up_step(SignUpStep.SignUpOwner);
		} else if (new_owner === emptyOwner && paidEvents) {
			set_sign_up_step(SignUpStep.SignUpOrgIdentity);
		} else {
			set_sign_up_step(SignUpStep.SignUpOrg);
		}
	}

	//Function to handle Password Input Changes
	function handleChange(valueChange: AdminSignUp) {
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

export default SignUpEventCreator;
