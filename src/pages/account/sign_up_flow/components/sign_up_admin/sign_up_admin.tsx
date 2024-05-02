import { useState } from "react";
import styles from "./sign_up_admin.module.css";

import { emptyGeneralAdmin, emptyUserError } from "../../types/types";
import SmallButton from "../../../../../components/small_button/small_button";
import InputForm from "../input_form/input_form";
import arrow from "../../../../../common/icons/dropdown_arrow.svg";
import { AdminRoles, SignUpStep } from "../../../../../common";

interface SignUpAdminProps {
	setSignUpStep: Function;
	setNewAdmins: Function;
	newAdmins: Admin[];
}
const SignUpAdmin = ({
	setSignUpStep,
	setNewAdmins,
	newAdmins,
}: SignUpAdminProps) => {
	const [admins, setAdmins] = useState<Admin[]>(newAdmins);
	const [errors, setErrors] = useState<UserError[]>([emptyUserError]);
	const [attemptDeleteRoot, setAttemptDeleteRoot] = useState<boolean>(false);
	const [submitAttempts, setSubmitAttempts] = useState<number>(0);
	const setAdmin = (index: any, tempUser: any) => {
		let tempAdmins = admins.slice(0);
		tempAdmins[index] = tempUser;
		setAdmins(tempAdmins);
	};
	const setError = (index: any, tempError: any) => {
		let tempErrors = errors.slice(0);
		tempErrors[index] = tempError;
		setErrors(tempErrors);
	};
	function renderAdmins() {
		return admins.map((admin, idx) => {
			return (
				<div className={styles.adminColumn} key={idx}>
					<InputForm
						displayErrors={submitAttempts > 0}
						user={admins[0]}
						setUser={(tempUser: any) =>
							setAdmin(idx, tempUser)
						}
						error={errors[0]}
						setError={(error: any) => setError(idx, error)}
					/>
					<div
						onClick={() => {
							if (admin.role === AdminRoles.Root) {
								setAttemptDeleteRoot(true);
							} else {
								handleDeleteAdmin(idx);
							}
						}}
						className={styles.removeAdmin}
					>
						Delete Administrator
					</div>
					{admin.role === AdminRoles.Root &&
						attemptDeleteRoot && (
							<p className={styles.removeAdminError}>
								{
									"You cannot delete the Root Administrator."
								}
							</p>
						)}
				</div>
			);
		});
	}

	function handleDeleteAdmin(index: number) {
		let tempAdmins = admins.slice(0);
		tempAdmins.splice(index, 1);
		setAdmins(tempAdmins);

		let tempErrors = errors.slice(0);
		tempErrors.splice(index, 1);
		setErrors(tempErrors);
	}

	function addAdmin() {
		setAttemptDeleteRoot(false);

		let tempAdmins = admins.slice(0);
		tempAdmins.push(emptyGeneralAdmin);
		setAdmins(tempAdmins);

		let tempErrors = errors.slice(0);
		tempErrors.push(emptyUserError);
		setErrors(tempErrors);
	}
	function errorExists() {
		let errorExists = false;
		errors.map((error) => {
			if (
				error.first_name ||
				error.last_name ||
				error.email ||
				error.confirm_email
			) {
				errorExists = true;
				return errorExists;
			}
		});
		return errorExists;
	}

	function isFormIncomplete() {
		let formIncomplete = false;
		admins.map((admin) => {
			if (
				admin.first_name === "" ||
				admin.last_name === "" ||
				admin.email === "" ||
				admin.confirm_email === ""
			) {
				formIncomplete = true;
				return formIncomplete;
			}
		});
		return formIncomplete;
	}

	function onContinue() {
		if (!errorExists() && !isFormIncomplete()) {
			setNewAdmins(admins);
			setSubmitAttempts(0);
			setAttemptDeleteRoot(false);
			setSignUpStep(SignUpStep.SignUpDone);
		} else {
			setSubmitAttempts(submitAttempts + 1);
		}
	}
	function onBack() {
		setSignUpStep(SignUpStep.SignUpOrg);
	}

	return (
		<div className="common_root">
			<div className={styles.column}>
				<h1 className="common_bold">
					Who will be managing your events?
				</h1>
				<h2 className={styles.adminHeader}>
					Organization Administrators
				</h2>
				<div className={styles.scrollRow}>
					<div
						className={styles.adminRow}
						style={
							admins.length < 3
								? { justifyContent: "center" }
								: {}
						}
					>
						{renderAdmins()}
					</div>
					{admins.length > 2 && (
						<>
							<div className={styles.scrollBar}></div>
							<img
								className={styles.scrollArrow}
								src={arrow}
								alt={"scroll"}
							/>
						</>
					)}
				</div>
				<div className={styles.userInputColumn}>
					<SmallButton
						onClick={() => {
							addAdmin();
							setSubmitAttempts(0);
						}}
					>
						Add Administrator
					</SmallButton>
					<div className={styles.buttonRow}>
						<SmallButton
							onClick={() => {
								onBack();
							}}
						>
							Back
						</SmallButton>
						<SmallButton
							onClick={() => {
								onContinue();
							}}
							disabled={admins.length < 1}
						>
							Continue
						</SmallButton>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SignUpAdmin;
