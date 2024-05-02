import { useState, useEffect } from "react";

import { api } from "axiosClients/client";
import { convertToBase64 } from "common/functions/index";
import SmallButton from "components/small_button/small_button";
import { validateEmail, validateName, validatePhone } from "pages/account/admin/components/admin_content/components/account/helper";
import { User } from "pages/account/admin/types/types";
import Loader from "partials/loader/loader";
import { use_accounting } from "state/admin/accounting";
import { useUser } from "state/useUser";
import { get_current_jwt, remove_current_jwt } from "utils/user";

import checkBoxIcon from "common/icons/checkbox.svg";
import default_profile_picture from "common/images/default_profile.png";
import exitIcon from "common/icons/exit.svg";
import styles from "./account.module.css";

import { common_admin_root } from "common/styles/admin";

const Account = () => {
	//Global State
	const user = useUser((state) => state.user);
	const setUser = useUser((state) => state.setUser);
	const reset = useUser((state) => state.reset);
	const reset_accounting = use_accounting((state) => state.reset);
	const setUserOrganization = useUser((state) => state.setUserOrganization);
	const token = get_current_jwt();

	//Local State
	const [editMode, setEditMode] = useState<boolean>(false);
	const [editPasswordMode, setEditPasswordMode] = useState<boolean>(false);
	const [displayErrors, setDisplayErrors] = useState<boolean>(false);
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
	const [confirm_password, set_confirm_password] = useState<string>("");
	const [submitError, setSubmitError] = useState<boolean>(false);
	const [validPhone, setValidPhone] = useState<boolean>(true);
	const [loading, set_loading] = useState<boolean>(false);
	const [editUser, setEditUser] = useState<User>({
		...user,
		password: "",
	});
	const [profile_pic, set_profile_pic] = useState<string>(user.profile_picture ? user.profile_picture : default_profile_picture);
	const [profile_pic_error_msg, set_profile_pic_error_msg] = useState<string>("");

	const default_input: string = "h-[22px]";
	const focused_input: string = "border-b-2 border-dark-blue h-[22px] p-0 mt-[1px] m-0";

	async function updateUser(user: User, onSuccess: Function, onError: Function) {
		const body = { user: user };
		let path = "";
		if (user.role) {
			path = "update_admin";
		} else {
			path = "update_user";
		}

		const { data } = await api.post(path, { user });
		if (data) {
			if (data.error) {
				//Handle Error
				onError(data);
			} else {
				onSuccess(data);
			}
		} else {
			console.log("Server Connection Error");
			onError({
				message: "Server Connection Error",
			});
		}
	}

	async function update_password(user: User, onSuccess: Function, onError: Function) {
		const body = { user: user };
		let path = "";
		if (user.role) {
			path = "update_admin_password";
		} else {
			path = "update_user_password";
		}

		const { data } = await api.post(path, body);
		if (data) {
			if (data.error) {
				//Handle Error
				onError(data);
			} else {
				//Handle Success
				onSuccess(data);
			}
		} else {
			onError({
				message: "Server Connection Error",
			});
		}
	}

	//Variables to validate password
	const validatePasswordLength = !(editUser.password.length < 8 || editUser.password.length > 16);
	const validatePasswordUpper = /[A-Z]/.test(editUser.password);
	const validatePasswordSpecial = /[\W_]/.test(editUser.password);
	const validatePassword = validatePasswordLength && validatePasswordUpper && validatePasswordSpecial;
	const validatePasswordsMatch = editUser.password === confirm_password;
	//Check Form Completion
	const isFormComplete =
		validPhone && validateName(editUser.first_name) && validateName(editUser.last_name) && validateEmail(editUser.email);
	const isPasswordComplete = validatePassword && validatePasswordsMatch;
	function onCancel() {
		setEditUser({
			...user,
		});
		set_profile_pic(user.profile_picture ? user.profile_picture : "");
		setEditMode(!editMode);
		setEditPasswordMode(false);
		setDisplayErrors(false);
		setShowPassword(false);
	}
	function onCancelPassword() {
		setEditPasswordMode(!editPasswordMode);
		setEditMode(false);
		setDisplayErrors(false);
		setShowPassword(false);
	}
	function onEdit() {
		setEditPasswordMode(false);
		setEditMode(!editMode);
		setEditUser({
			...user,
			password: "",
		});
		set_confirm_password("");
	}
	function onEditPassword() {
		setEditMode(false);
		setEditPasswordMode(!editPasswordMode);
		setEditUser({
			...user,
			password: "",
		});
		set_confirm_password("");
	}

	function onSavePassword() {
		if (!isPasswordComplete) {
			setSubmitError(false);
			setDisplayErrors(true);
		} else {
			setSubmitError(false);
			setDisplayErrors(false);
			setEditMode(false);
			setEditPasswordMode(false);
			setShowPassword(false);
			setShowConfirmPassword(false);
			set_confirm_password("");
			update_password(editUser, onSuccess, onError);
		}
	}

	function onSave() {
		if (!isFormComplete) {
			setSubmitError(false);
			setDisplayErrors(true);
		} else {
			setSubmitError(false);
			setDisplayErrors(false);
			setEditMode(false);
			setEditPasswordMode(false);
			setShowPassword(false);
			setShowConfirmPassword(false);
			set_confirm_password("");
			updateUser(editUser, onSuccessUpdate, onError);
		}
	}
	function onError() {
		setSubmitError(true);
	}
	function onSuccessUpdate(data: any) {
		setUser(data.user);
	}
	function onSuccess() {}
	const handlePhoneChange = (event: any) => {
		const value = event.target.value;
		const newUser: User = {
			...editUser,
			phone_number: value,
		};
		setEditUser(newUser);
		if (validatePhone(value)) {
			setValidPhone(true);
		} else {
			setValidPhone(false);
		}
	};
	async function handleImageUpload(e: any, setImage: Function, setError: Function) {
		const selectedFile = e.target.files[0];
		const MAX_FILE_SIZE = 16384;

		const fileSizeKiloBytes = selectedFile.size / 1024;

		if (fileSizeKiloBytes > MAX_FILE_SIZE) {
			setError("File size is greater than maximum limit: 16MB");
			return;
		} else {
			setError("");
			setImage(await convertToBase64(selectedFile));
			//Set the image in the request
			setEditUser({
				...editUser,
				profile_picture: await convertToBase64(selectedFile),
			});
		}
	}

	const fetch_user_account_data = async () => {
		api.post("/fetch_account")
			.then((res) => {
				const data = res.data;
				if (data) {
					set_loading(false);
					if (data.organization) {
						setUserOrganization(data.organization);
					}
					return setUser(data.user);
				} else {
					reset();
					reset_accounting();
					remove_current_jwt();
					window.scrollTo(0, 0);
				}
			})
			.catch((err) => {
				reset();
				reset_accounting();
				remove_current_jwt();
				window.scrollTo(0, 0);
			});
	};

	useEffect(() => {
		window.scrollTo(0, 0);

		if (token && Object.keys(user).length === 0) {
			set_loading(true);
			fetch_user_account_data();
		}
	}, []);

	return (
		<div className={common_admin_root}>
			{loading ? (
				<Loader />
			) : (
				<div>
					<div className={styles.header}>
						<h1 style={{ margin: "0px" }}>Admin. Account</h1>
						{user.role && (
							<p className={styles.roleText}>
								<span className={"m-0 mr-[5px] font-bold text-dark-blue"}>Your Role: </span>
								Organization {editUser.role === "Root Admin" ? "Owner" : "Admin"}
							</p>
						)}
						<div className={styles.button}>
							<SmallButton
								onClick={() => {
									if (editMode) {
										onCancel();
									}
									if (!editMode) {
										onEdit();
									}
								}}
							>
								{editMode ? "Cancel" : "Edit Account Info"}
							</SmallButton>
						</div>
					</div>
					<div className={styles.accountInfo}>
						<div className={styles.accountInfoRow}>
							<div className={styles.accountInfoColumn}>
								<h3 style={{ marginBottom: "40px" }}>Personal Information</h3>
								<div className={styles.inputRow}>
									<p className={"m-0 mr-[5px] font-bold text-dark-blue"}>First Name:</p>
									<input
										readOnly={!editMode}
										className={!editMode ? default_input : focused_input}
										value={editUser.first_name}
										type={"text"}
										onChange={(event) => {
											const value = event.target.value;
											const newUser: User = {
												...editUser,
												first_name: value,
											};
											setEditUser(newUser);
										}}
									/>
									{!validateName(editUser.first_name) && displayErrors && (
										<p className={styles.errorMessage}>Not a valid name.</p>
									)}
								</div>
								<div className={styles.inputRow}>
									<p className={"m-0 mr-[5px] font-bold text-dark-blue"}>Last Name:</p>
									<input
										readOnly={!editMode}
										className={!editMode ? default_input : focused_input}
										value={editUser.last_name}
										type={"text"}
										onChange={(event) => {
											const value = event.target.value;
											const newUser: User = {
												...editUser,
												last_name: value,
											};
											setEditUser(newUser);
										}}
									/>
									{!validateName(editUser.last_name) && displayErrors && (
										<p className={styles.errorMessage}>Not a valid name.</p>
									)}
								</div>
							</div>
							<div className={styles.accountContactInfo}>
								<h3 style={{ marginBottom: "40px" }}>Contact Information</h3>
								<div className={styles.inputRow}>
									<p className={"m-0 mr-[5px] font-bold text-dark-blue"}>Phone Number:</p>
									<input
										readOnly={!editMode}
										placeholder={"None"}
										name="phone"
										className={!editMode ? default_input : focused_input}
										value={editUser.phone_number === undefined ? "" : editUser.phone_number}
										type={"text"}
										onChange={handlePhoneChange}
									/>
									{!validPhone && displayErrors && (
										<p className={styles.errorMessage}>Not a valid phone number.</p>
									)}
								</div>
								<div className={styles.inputRow}>
									<p className={"m-0 mr-[5px] font-bold text-dark-blue"}>Email:</p>
									<input
										style={{ width: "81%" }}
										readOnly={!editMode}
										className={!editMode ? default_input : focused_input}
										value={editUser.email}
										type={"text"}
										name="email"
										onChange={(event) => {
											const value = event.target.value;
											const newUser: User = {
												...editUser,
												email: value,
											};
											setEditUser(newUser);
										}}
									/>
									{!validateEmail(editUser.email) && displayErrors && (
										<p className={styles.errorMessage}>Not a valid email.</p>
									)}
								</div>
							</div>
						</div>
						{editMode ? (
							<div className={styles.passwordButton} style={{ position: "relative" }}>
								<SmallButton onClick={() => onSave()}>Save</SmallButton>
								{submitError && displayErrors && (
									<p className={styles.submitError}>An error occurred, please try again later!</p>
								)}
								{!isFormComplete && displayErrors && (
									<p className={styles.submitError}>Please fix your errors before saving.</p>
								)}
							</div>
						) : (
							<></>
						)}
						{!editMode && (
							<div className={styles.passwordButton}>
								<SmallButton
									onClick={() => {
										if (editPasswordMode) {
											onCancelPassword();
										}
										if (!editPasswordMode) {
											onEditPassword();
										}
									}}
								>
									{editPasswordMode ? "Cancel" : "Edit Password"}
								</SmallButton>
							</div>
						)}
						<div className={styles.accountInfoColumn}>
							<h3 style={{ marginBottom: "40px" }}>Login Information</h3>
							<div className={styles.loginRow}>
								<div className={styles.inputRow} style={{ marginRight: "40px" }}>
									<p className={"m-0 mr-[5px] font-bold text-dark-blue"}>Authentication Type: </p>
									<p style={{ margin: "0px" }}>Single Factor</p>
								</div>
								<div className={styles.inputRow}>
									<p className={"m-0 mr-[5px] font-bold text-dark-blue"}>Authentication Method: </p>
									<p style={{ margin: "0px" }}>Password</p>
								</div>
							</div>
							<div className={styles.loginRow}>
								<div
									className={!editPasswordMode ? styles.inputRow : styles.inputRowEdit}
									style={{ marginRight: "40px" }}
								>
									<div className={styles.nameColumn}>
										<div className={styles.inputRow}>
											{editPasswordMode && (
												<p className={"m-0 mr-[5px] font-bold text-dark-blue"}>New Password:</p>
											)}
											<div className={styles.password}>
												<input
													readOnly={!editPasswordMode}
													className={!editPasswordMode ? default_input : focused_input}
													value={editUser.password}
													style={{
														width: "237px",
													}}
													type={showPassword ? "text" : "password"}
													onChange={(event) => {
														const value = event.target.value;
														const newUser: User = {
															...editUser,
															password: value,
														};
														setEditUser(newUser);
													}}
												/>
											</div>
										</div>
										{editPasswordMode && (
											<div className={styles.nameColumn}>
												<div
													className={styles.inputRow}
													style={{
														marginBottom: "0px",
													}}
												>
													<p className={"m-0 mr-[5px] font-bold text-dark-blue"}>New Confirm Password:</p>
													<div className={styles.password}>
														<input
															type={showConfirmPassword ? "text" : "password"}
															readOnly={!editPasswordMode}
															value={confirm_password}
															className={!editPasswordMode ? default_input : focused_input}
															onChange={(event) => {
																const value = event.target.value;
																set_confirm_password(value);
															}}
														></input>
													</div>
												</div>
											</div>
										)}
										{validatePasswordLength
											? editPasswordMode && (
													<div className={styles.passwordMsg}>
														<img
															className={styles.passwordIcon}
															src={checkBoxIcon}
															alt={"Length good"}
														/>
														<p className={styles.passwordValid}>Is 8 to 16 characters long.</p>
													</div>
											  )
											: editPasswordMode && (
													<div className={styles.passwordMsg}>
														<img className={styles.passwordIcon} src={exitIcon} alt={"Length good"} />
														<p className={styles.passwordValid}>Must be 8 to 16 characters long.</p>
													</div>
											  )}
										{validatePasswordUpper
											? editPasswordMode && (
													<div className={styles.passwordMsg}>
														<img
															className={styles.passwordIcon}
															src={checkBoxIcon}
															alt={"Length good"}
														/>
														<p className={styles.passwordValid}>Has at least one uppercase letter.</p>
													</div>
											  )
											: editPasswordMode && (
													<div className={styles.passwordMsg}>
														<img className={styles.passwordIcon} src={exitIcon} alt={"Length good"} />
														<p className={styles.passwordValid}>
															Must have at least one uppercase letter.
														</p>
													</div>
											  )}
										{validatePasswordSpecial
											? editPasswordMode && (
													<div className={styles.passwordMsg}>
														<img
															className={styles.passwordIcon}
															src={checkBoxIcon}
															alt={"Length good"}
														/>
														<p className={styles.passwordValid}>Has at least one special character.</p>
													</div>
											  )
											: editPasswordMode && (
													<div className={styles.passwordMsg}>
														<img className={styles.passwordIcon} src={exitIcon} alt={"Length good"} />
														<p className={styles.passwordValid}>
															Must have at least one special character.
														</p>
													</div>
											  )}
										{validatePassword &&
											editPasswordMode &&
											(validatePasswordsMatch ? (
												<div className={styles.passwordMsg}>
													<img className={styles.passwordIcon} src={checkBoxIcon} alt={"Length good"} />
													<p className={styles.passwordValid}>Passwords match.</p>
												</div>
											) : (
												editPasswordMode && (
													<div className={styles.passwordMsg}>
														<img className={styles.passwordIcon} src={exitIcon} alt={"Length good"} />
														<p className={styles.passwordValid}>Passwords must match.</p>
													</div>
												)
											))}
									</div>
								</div>
							</div>
						</div>
						{editPasswordMode ? (
							<div style={{ position: "relative" }}>
								<SmallButton onClick={() => onSavePassword()}>Save</SmallButton>
								{submitError && displayErrors && (
									<p className={styles.submitError}>An error occurred, please try again later!</p>
								)}
								{!isPasswordComplete && displayErrors && (
									<p className={styles.submitError}>Please fix your errors before saving.</p>
								)}
							</div>
						) : (
							<></>
						)}
					</div>
					<div className={styles.profilePicture}>
						<h3>Profile Picture</h3>
						<div className={editMode ? styles.imageContainer : styles.imageUploaded}>
							{" "}
							{editMode && (
								<label htmlFor="search-image-upload" className={styles.uploadImageButton} onClick={() => {}}>
									Edit
								</label>
							)}
							<input
								type="file"
								id="search-image-upload"
								accept="image/*"
								onChange={(event) => handleImageUpload(event, set_profile_pic, set_profile_pic_error_msg)}
								className={styles.uploadImage}
							/>
							{profile_pic && (
								<img
									className={styles.image}
									alt={"Event Search "}
									src={profile_pic ? profile_pic : default_profile_picture}
								/>
							)}
						</div>
						{profile_pic && <p className={styles.imageError}>{profile_pic_error_msg}</p>}
					</div>
				</div>
			)}
		</div>
	);
};

export default Account;
