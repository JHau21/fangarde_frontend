import { useState, useEffect } from "react";
import Papa from "papaparse";

import ErrorMessage from "components/error_message";
import InputForm from "pages/account/sign_up_flow/components/input_form/input_form";
import InputBox from "components/input_box";
import Loader from "partials/loader/loader";
import RadioButton from "components/radio_button";
import SmallButton from "components/small_button/small_button";
import TextAreaInputBox from "components/text_area";
import TextButton from "components/text_button";

import { api } from "axiosClients/client";

import { useUser } from "state/useUser";
import { remove_current_jwt } from "utils/user";

import { convertToBase64, validateUrl } from "common/functions/index";
import { format_address } from "utils/common_methods";

import color_palette from "common/types/colors";

import styles from "pages/account/admin/components/admin_content/components/organization/organization.module.css";
import common_style from "common/css/common.module.css";
import arrow from "common/icons/dropdown_arrow.svg";
import { common_admin_root } from "common/styles/admin";

import { AdminRoles, CustomEmailImage, Genre } from "common";

interface Organization_Warning {
	name: boolean;
	description: boolean;
	genre: boolean;
	locations: boolean;
	website: boolean;
}

const Organization = () => {
	//State Variables
	const userOrganization = useUser((state) => state.userOrganization);
	const setUserOrganization = useUser((state) => state.setUserOrganization);
	const setUser = useUser((state) => state.setUser);
	const [adminMode, setAdminMode] = useState<boolean>(false);
	const [editMode, setEditMode] = useState<boolean>(false);

	const [currentOrg, setCurrentOrg] = useState(userOrganization);
	const [currentAdmins, setCurrentAdmins] = useState<Admin[]>(userOrganization.admins);
	const [banner_error_msg, set_banner_error_msg] = useState<string>("");
	const [submitAttempts, setSubmitAttempts] = useState<number>(0);
	const [submitError, setSubmitError] = useState<string>("");
	const [loading, set_loading] = useState<boolean>(false);
	const [delete_error, set_delete_error] = useState<string>("");
	const [delete_load, set_delete_load] = useState<boolean>(false);
	const [warning, set_warning] = useState<Organization_Warning>({
		name: false,
		description: false,
		genre: false,
		locations: false,
		website: false,
	});
	const warning_exists = warning.description || warning.name || warning.website || warning.genre || warning.locations;

	function set_current_org_and_warning(updated_organization: any) {
		setCurrentOrg(updated_organization);
		set_warning({
			name: updated_organization.name === "",
			description: updated_organization.description === "",
			genre: updated_organization.genre === Genre.None || updated_organization.genre === "",
			locations: updated_organization.locations[0] === "",
			website:
				!validateUrl(updated_organization.website) &&
				updated_organization.website !== "" &&
				updated_organization.website !== undefined,
		});
	}
	const emptyError: UserError = {
		first_name: false,
		last_name: false,
		email: false,
		confirm_email: false,
		phone_number: false,
	};
	const [errors, setErrors] = useState<UserError[]>(new Array(userOrganization?.length).fill(emptyError));
	//Logic for rendering Admin Cards
	const emptyUser: Admin = {
		first_name: "",
		last_name: "",
		email: "",
		confirm_email: "",
		phone_number: "",
		role: AdminRoles.General,
	};
	const setCurrentAdmin = (index: any, tempUser: any) => {
		let tempAdmins = currentAdmins.slice(0);
		tempAdmins[index] = tempUser;
		setCurrentAdmins(tempAdmins);
	};
	const setCurrentError = (index: any, tempError: any) => {
		let tempErrors = errors.slice(0);
		tempErrors[index] = tempError;
		setErrors(tempErrors);
	};
	function renderAdmins() {
		return currentAdmins.map((admin, idx) => {
			return (
				<div className={styles.adminColumn} key={idx}>
					<InputForm
						editMode={editMode}
						user={admin}
						setUser={(tempAdmin: any) => {
							setCurrentAdmin(idx, tempAdmin);
							setSubmitError("");
						}}
						error={errors[idx]}
						setError={(tempError: any) => setCurrentError(idx, tempError)}
						displayErrors={submitAttempts > 0}
						confirmEmail={
							!userOrganization.admins.find(
								(existAdmin: Admin) => existAdmin._id.toString() === admin?._id?.toString()
							)
						}
					/>
					{editMode && (
						<>
							{!(admin.role === AdminRoles.Root) && (
								<div
									onClick={() => {
										removeAdminAtIndex(idx);
									}}
									className={styles.removeAdmin}
								>
									Delete Administrator
								</div>
							)}
						</>
					)}
				</div>
			);
		});
	}
	function addAdmin() {
		let tempAdmins: Admin[] = currentAdmins.slice(0);
		tempAdmins.push(emptyUser);
		setCurrentAdmins(tempAdmins);

		let tempErrors = errors.slice(0);
		tempErrors.push(emptyError);
		setErrors(tempErrors);
	}
	function removeEmptyCards() {
		let tempAdmins: Admin[] = [];
		tempAdmins = currentAdmins.slice(0);
		for (let i = currentAdmins.length - 1; i >= 0; i--) {
			if (JSON.stringify(currentAdmins[i]) === JSON.stringify(emptyUser)) {
				tempAdmins.splice(i, 1);
			}
		}
		setCurrentAdmins(tempAdmins);

		let tempErrors: UserError[] = [];
		tempErrors = errors.slice(0);
		for (let i = currentAdmins.length - 1; i >= 0; i--) {
			if (JSON.stringify(currentAdmins[i]) === JSON.stringify(emptyUser)) {
				tempErrors.splice(i, 1);
			}
		}
		setErrors(tempErrors);
	}
	function removeAdminAtIndex(index: number) {
		let tempAdmins: Admin[] = [];
		tempAdmins = currentAdmins.slice(0);
		tempAdmins.splice(index, 1);
		setCurrentAdmins(tempAdmins);

		let tempErrors: UserError[] = [];
		tempErrors = errors.slice(0);
		tempErrors.splice(index, 1);
		setErrors(tempErrors);
	}
	function errorExists() {
		let errorExists = false;
		errors.map((error) => {
			if (error.first_name || error.last_name || error.email || error.confirm_email) {
				errorExists = true;
				return errorExists;
			}
			return error;
		});
		return errorExists;
	}
	function isFormIncomplete() {
		let formIncomplete = false;
		currentAdmins.map((admin) => {
			if (
				admin.first_name === "" ||
				admin.last_name === "" ||
				admin.email === "" ||
				(admin.confirm_email === "" && admin.role !== AdminRoles.Root)
			) {
				formIncomplete = true;
				return formIncomplete;
			}
			return admin;
		});
		return formIncomplete;
	}
	//Click Handlers
	function handleClickAdminMode() {
		if (editMode) {
			resetEditMode();
		} else {
			setEditMode(true);
		}
	}
	function handleClickBack() {
		resetEditMode();
		setAdminMode(false);
	}
	function resetEditMode() {
		removeEmptyCards();
		setEditMode(false);
		setSubmitAttempts(0);
		setCurrentAdmins(userOrganization.admins);
		setSubmitError("");
	}
	//Organization Updates
	async function onSaveOrganization() {
		if (!warning_exists) {
			setSubmitError("");
			setEditMode(false);
			try {
				const res = await api.post("/update_organization", {
					organization: currentOrg,
				});

				if (res.data.error) {
					set_current_org_and_warning(userOrganization);
					setSubmitError("An error occurred, please try again later.");
				} else {
					setUserOrganization(currentOrg);
				}
			} catch (error) {
				set_current_org_and_warning(userOrganization);
				setSubmitError("An error occurred, please try again later.");
			}
		} else {
			setSubmitError("Please fix the errors before submitting.");
		}
	}
	//Admin Updates
	async function onSaveAdmins() {
		if (!errorExists() && !isFormIncomplete()) {
			api.post("/update_admins", {
				admins: currentAdmins,
			})
				.then((res: any) => {
					if (res.status === 200) {
						removeEmptyCards();
						setEditMode(false);
						setSubmitAttempts(0);
						setUserOrganization(res.data.organization);
						setCurrentAdmins(res.data.organization.admins);
						setUser(res.data.user);
						setSubmitError("");
					}
				})
				.catch((err: any) => {
					setCurrentAdmins(userOrganization.admins);
					setSubmitError(err.response.data.message);
				});
		} else {
			setSubmitAttempts(submitAttempts + 1);
		}
	}
	function delete_location(location: EventLocation) {
		set_delete_error("");
		set_delete_load(true);
		api.post("/delete_location", {
			location_to_delete: location,
		})
			.then((res) => {
				set_delete_load(false);
				const { data } = res;
				setUserOrganization(data);
			})
			.catch((err) => {
				set_delete_load(false);
				if (err?.response?.data) {
					const { error } = err?.response?.data;
					set_delete_error(error);
				} else {
					set_delete_error("An error occurred, please try again later.");
				}
			});
	}
	const LocationsMap = () => {
		if (userOrganization.locations === undefined) return <p>No saved locations</p>;
		else
			return (
				<div
					className={
						"mb-[30px] flex max-h-[400] flex-col items-center overflow-y-scroll rounded-md border-2 border-medium-blue"
					}
				>
					<ErrorMessage
						message={delete_error}
						className="mt-[20px] self-center whitespace-normal font-custom text-regular font-bold text-fangarde-medium-red"
					/>
					{userOrganization.locations.map((location: EventLocation) => {
						return (
							<div className="relative m-[20px] flex w-[385px] flex-col rounded-md border-2 border-medium-blue p-[10px]">
								<div className="absolute right-[10px]">
									<SmallButton
										onClick={() => {
											delete_location(location);
										}}
										width={140}
										loading={delete_load}
									>
										Delete Location
									</SmallButton>
								</div>
								<h4 className={`m-0 mr-[5px] inline whitespace-nowrap ${common_style.common_bold}`}>
									Location Name
								</h4>
								<p>{location.name}</p>
								<h4 className={`m-0 mr-[5px] inline whitespace-nowrap ${common_style.common_bold}`}>
									Location Address
								</h4>
								<p>{format_address(location.address)}</p>
							</div>
						);
					})}
				</div>
			);
	};

	const fetch_user_account_data = async () => {
		api.post("/fetch_account")
			.then((res: any) => {
				if (res.status === 200) {
					set_loading(false);
					const { data } = res;
					if (data.organization) {
						setUserOrganization(data.organization);
						setCurrentOrg(data.organization);
					}
					setUser(data.user);
				} else {
					setSubmitError("An error occurred, please try again later.");
					remove_current_jwt();
					window.scrollTo(0, 0);
				}
			})
			.catch((err: any) => {
				setSubmitError("An error occurred, please try again later.");
				remove_current_jwt();
				window.scrollTo(0, 0);
			});
	};

	const export_pdf = () => {
		const formatted_data: Array<{ "Email Address": string }> = [];

		// populate the email_address property of formatted_data with the organization's mailing list
		const mailing_list = userOrganization?.mailing_list ? userOrganization.mailing_list : [];

		mailing_list.map((email_address: string) => {
			formatted_data.push({
				"Email Address": email_address,
			});
		});

		const csv = Papa.unparse(formatted_data);
		const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.setAttribute("href", url);
		const now = new Date().toLocaleString();
		link.setAttribute("download", `Mailing List - ${now}.csv`);
		link.click();
	};

	useEffect(() => {
		if (!userOrganization) {
			set_loading(true);
			fetch_user_account_data();
		}
	}, []);

	async function handleImageUpload(e: any) {
		const selectedFile = e.target.files[0];
		const MAX_FILE_SIZE = 16384;

		const fileSizeKiloBytes = selectedFile.size / 1024;

		if (fileSizeKiloBytes > MAX_FILE_SIZE) {
			set_banner_error_msg("File size is greater than maximum limit: 16MB");
			return;
		} else {
			set_banner_error_msg("");
			set_current_org_and_warning({
				...currentOrg,
				banner: await convertToBase64(selectedFile),
			});
		}
	}
	return (
		<div className={common_admin_root}>
			{loading && <Loader />}
			{!loading && (
				<>
					<div className={styles.header}>
						<h1 style={{ margin: "0px" }}>Organization</h1>
						{!adminMode ? (
							<div className={styles.row}>
								<div className={styles.button}>
									<SmallButton
										onClick={() => {
											if (!editMode) {
												setEditMode(!editMode);
												setSubmitError("");
											} else {
												setEditMode(!editMode);
												setSubmitError("");
												set_current_org_and_warning(userOrganization);
											}
										}}
									>
										{editMode ? "Cancel" : "Edit Account Info"}
									</SmallButton>
								</div>
								<div className={styles.button}>
									<SmallButton
										disabled={adminMode}
										onClick={() => {
											setAdminMode(true);
											setEditMode(false);
											setSubmitError("");
											setSubmitAttempts(0);
										}}
									>
										Add/Remove Administrators
									</SmallButton>
								</div>
							</div>
						) : (
							<div className={styles.row}>
								<div className={styles.button}>
									<SmallButton onClick={() => handleClickAdminMode()}>
										{editMode ? "Cancel" : "Edit Administrator Information"}
									</SmallButton>
								</div>
								<div className={styles.button}>
									<SmallButton
										onClick={() => {
											handleClickBack();
										}}
									>
										Go Back
									</SmallButton>
								</div>
							</div>
						)}
					</div>
					{!adminMode ? (
						<div className={styles.account_info_wrapper}>
							<div className={`${styles.custom_email_message} ${common_style.common_bold}`}>
								<h2
									style={{
										margin: "0px",
										marginBottom: "15px",
									}}
								>
									Custom Email Message/Image
								</h2>
								<p className={common_style.common_medium}>
									If you'd like to customize the emails that your customers recieve, you can do that below!
								</p>
								<div className={styles.custom_email_inputs}>
									<div className={styles.input_wrapper}>
										<p
											style={{
												margin: "0px",
												marginBottom: "15px",
											}}
										>
											Thank You Message
										</p>
										<InputBox
											disabled={!editMode}
											type="text"
											placeholder={"e.g. Thank you for your support!"}
											value={
												currentOrg?.custom_email_message?.thank_you_message
													? currentOrg.custom_email_message.thank_you_message
													: editMode
													? currentOrg?.custom_email_message?.thank_you_message
													: "None"
											}
											onChange={(value: string) => {
												set_current_org_and_warning({
													...currentOrg,
													custom_email_message: {
														...currentOrg.custom_email_message,
														thank_you_message: value,
													},
												});
											}}
											maxLength={50}
										/>
									</div>
									<div className={styles.input_wrapper}>
										<p
											style={{
												margin: "0px",
												marginBottom: "15px",
											}}
										>
											Image
										</p>
										<div className={styles.radio_options}>
											<RadioButton
												checked={
													currentOrg?.custom_email_message?.image_option
														? currentOrg?.custom_email_message?.image_option ===
														  CustomEmailImage.OrgBanner
														: false
												}
												disabled={!editMode}
												label={"Organization Banner Image"}
												value={CustomEmailImage.OrgBanner}
												onChange={(value: string) => {
													set_current_org_and_warning({
														...currentOrg,
														custom_email_message: {
															...currentOrg.custom_email_message,
															image_option: value,
														},
													});
												}}
											/>
											<RadioButton
												checked={
													currentOrg?.custom_email_message?.image_option
														? currentOrg?.custom_email_message?.image_option ===
														  CustomEmailImage.EventSearchImage
														: false
												}
												disabled={!editMode}
												label={"Event Search Image"}
												value={CustomEmailImage.EventSearchImage}
												onChange={(value: string) => {
													set_current_org_and_warning({
														...currentOrg,
														custom_email_message: {
															...currentOrg.custom_email_message,
															image_option: value,
														},
													});
												}}
											/>
											<RadioButton
												checked={
													currentOrg?.custom_email_message?.image_option
														? currentOrg?.custom_email_message?.image_option ===
														  CustomEmailImage.EventBannerImage
														: false
												}
												disabled={!editMode}
												label={"Event Banner Image"}
												value={CustomEmailImage.EventBannerImage}
												onChange={(value: string) => {
													set_current_org_and_warning({
														...currentOrg,
														custom_email_message: {
															...currentOrg.custom_email_message,
															image_option: value,
														},
													});
												}}
											/>
											<RadioButton
												checked={!currentOrg?.custom_email_message?.image_option}
												disabled={!editMode}
												label={"None"}
												value={CustomEmailImage.None}
												onChange={() => {
													set_current_org_and_warning({
														...currentOrg,
														custom_email_message: {
															...currentOrg.custom_email_message,
															image_option: "",
														},
													});
												}}
											/>
										</div>
									</div>
								</div>
								<div className={styles.email_message_input_wrapper}>
									<p
										style={{
											margin: "0px",
											marginBottom: "15px",
										}}
									>
										Additional Message
									</p>
									<TextAreaInputBox
										disabled={!editMode}
										rows={4}
										maxLength={400}
										value={
											currentOrg?.custom_email_message?.additional_details_message
												? currentOrg.custom_email_message.additional_details_message
												: editMode
												? currentOrg?.custom_email_message?.additional_details_message
												: "None"
										}
										placeholder={
											"e.g. When you arrive at the complex, make sure to follow the parking guides in the..."
										}
										onChange={(value: string) => {
											set_current_org_and_warning({
												...currentOrg,
												custom_email_message: {
													...currentOrg.custom_email_message,
													additional_details_message: value,
												},
											});
										}}
									/>
								</div>
							</div>
							<div className={`${styles.custom_email_message} ${common_style.common_bold}`}>
								<div className={styles.marketing_comm_header_section}>
									<h2
										style={{
											margin: "0px",
											padding: "0px",
										}}
									>
										Email Marketing Communications
									</h2>
									<TextButton
										className={"m-0 w-[18.5%] text-left font-custom text-regular font-bold hover:cursor-pointer"}
										onClick={() => export_pdf()}
										label={"Download Email List"}
									/>
								</div>
								<p className={common_style.common_medium}>
									If you'd like to add a field in your customers' ticket purchasing flow that asks if they'd like
									to opt into your marketing communications, you can do that here!
								</p>

								<div className={styles.custom_email_inputs}>
									<div className={styles.input_wrapper}>
										<p
											style={{
												margin: "0px",
												marginBottom: "15px",
											}}
										>
											Add Marketing Communications Opt-In Prompt
										</p>
										<div className={styles.radio_options}>
											<RadioButton
												checked={currentOrg?.request_marketing_communications?.requested}
												disabled={!editMode}
												label={"Yes"}
												onChange={() => {
													set_current_org_and_warning({
														...currentOrg,
														request_marketing_communications: {
															...currentOrg.request_marketing_communications,
															requested: true,
														},
													});
												}}
											/>
											<RadioButton
												checked={!currentOrg?.request_marketing_communications?.requested}
												disabled={!editMode}
												label={"No"}
												onChange={() => {
													set_current_org_and_warning({
														...currentOrg,
														request_marketing_communications: {
															...currentOrg.request_marketing_communications,
															requested: false,
														},
													});
												}}
											/>
										</div>
									</div>
									<div className={styles.input_wrapper}>
										<p
											style={{
												margin: "0px",
												marginBottom: "15px",
											}}
										>
											Opt-In Prompt
										</p>
										<InputBox
											disabled={!editMode}
											type="text"
											placeholder={`e.g. I would like to receive email communications from ${userOrganization.name}.`}
											value={
												currentOrg?.request_marketing_communications?.custom_message
													? currentOrg?.request_marketing_communications?.custom_message
													: editMode
													? currentOrg?.request_marketing_communications?.custom_message
													: "None"
											}
											onChange={(value: string) => {
												set_current_org_and_warning({
													...currentOrg,
													request_marketing_communications: {
														...currentOrg.request_marketing_communications,
														custom_message: value,
													},
												});
											}}
											maxLength={100}
										/>
									</div>
								</div>
							</div>
							<div className={styles.accountInfo}>
								<div className={styles.left_column}>
									<h2 style={{ margin: "0px" }}>Organization Information</h2>
									<div className={styles.inputColumn}>
										<div className={styles.inputRow}>
											<p className={"m-0 mr-[5px] inline whitespace-nowrap font-bold text-dark-blue"}>
												Website:
											</p>
											<input
												readOnly={!editMode}
												maxLength={100}
												className={!editMode ? styles.inputInfo : styles.inputInfoEdit}
												value={currentOrg.website ? currentOrg.website : ""}
												placeholder={currentOrg.website ? currentOrg.website : "None"}
												type={"text"}
												onChange={(event) => {
													const value = event.target.value;
													set_current_org_and_warning({
														...currentOrg,
														website: value,
													});
												}}
											/>
											{warning.website && (
												<div className={styles.error_message}>
													<p
														className={`${common_style.common_bold}`}
														style={{ color: color_palette.red, margin: "0px" }}
													>
														Please enter a valid URL. Ex. https://www.example.com
													</p>
												</div>
											)}
										</div>
										<div className={styles.inputRow}>
											<p className={"m-0 mr-[5px] inline whitespace-nowrap font-bold text-dark-blue"}>Type:</p>
											{editMode ? (
												<select
													className={styles.inputInfoEdit}
													style={{
														paddingLeft: "0px",
														borderTop: "1px solid white",
													}}
													value={currentOrg.genre ? currentOrg.genre : ""}
													onChange={(event) => {
														const value = event.target.value;
														set_current_org_and_warning({
															...currentOrg,
															genre: value,
														});
													}}
												>
													{Object.values(Genre).map((genre, i) => (
														<option key={genre} value={genre}>
															{Object.keys(Genre)[i]}
														</option>
													))}
												</select>
											) : (
												<input
													readOnly={!editMode}
													className={!editMode ? styles.inputInfo : styles.inputInfoEdit}
													value={currentOrg.genre ? currentOrg.genre : "None"}
													type={"text"}
												/>
											)}
											{warning.genre && (
												<div className={styles.error_message}>
													<p
														className={`${common_style.common_bold}`}
														style={{ color: color_palette.red, margin: "0px" }}
													>
														Please enter a genre.
													</p>
												</div>
											)}
										</div>
										<div className={styles.inputRow}>
											<p className={"m-0 mr-[5px] inline whitespace-nowrap font-bold text-dark-blue"}>
												{" "}
												Name:
											</p>
											<input
												maxLength={100}
												readOnly={!editMode}
												className={!editMode ? styles.inputInfo : styles.inputInfoEdit}
												value={currentOrg.name ? currentOrg.name : ""}
												type={"text"}
												onChange={(event) => {
													const value = event.target.value;
													set_current_org_and_warning({
														...currentOrg,
														name: value,
													});
												}}
											/>
											{warning.name && (
												<div className={styles.error_message}>
													<p
														className={`${common_style.common_bold}`}
														style={{ color: color_palette.red, margin: "0px" }}
													>
														Please enter a name.
													</p>
												</div>
											)}
										</div>
									</div>
									<p className={"m-0 mr-[5px] inline whitespace-nowrap font-bold text-dark-blue"}> Locations:</p>
									<LocationsMap />
									{warning.locations && (
										<div className={styles.error_message}>
											<p
												className={`${common_style.common_bold}`}
												style={{ color: color_palette.red, margin: "0px" }}
											>
												Please enter a location.
											</p>
										</div>
									)}
									<div className={styles.inputRow}>
										<p className={"m-0 mr-[5px] inline whitespace-nowrap font-bold text-dark-blue"}>
											Description:{" "}
										</p>
									</div>
									<div
										style={{
											position: "relative",
											width: "100%",
											height: "220px",
											marginBottom: "30px",
										}}
									>
										<TextAreaInputBox
											maxLength={1000}
											readOnly={!editMode}
											rows={11}
											value={currentOrg.description ? currentOrg.description : ""}
											placeholder={!currentOrg.description ? "None" : ""}
											onChange={(value: string) => {
												set_current_org_and_warning({
													...currentOrg,
													description: value,
												});
											}}
										/>
										{warning.description && (
											<div className={styles.error_message}>
												<p
													className={`${common_style.common_bold}`}
													style={{ color: color_palette.red, margin: "0px" }}
												>
													Please enter a description.
												</p>
											</div>
										)}
									</div>
									{submitError && (
										<div className={styles.error_message}>
											<p
												className={`${common_style.common_bold}`}
												style={{ color: color_palette.red, margin: "0px" }}
											>
												{submitError}
											</p>
										</div>
									)}
									{editMode ? <SmallButton onClick={() => onSaveOrganization()}>Save</SmallButton> : <></>}
								</div>
								<div className={styles.right_column}>
									<h2
										style={{
											marginTop: "0px",
											marginBottom: "40px",
										}}
									>
										Banner
									</h2>
									<div className={!editMode ? styles.imageContainer : styles.imageUploaded}>
										{" "}
										{editMode && (
											<label
												htmlFor="search-image-upload"
												className={styles.uploadImageButton}
												onClick={() => {}}
											>
												Edit
											</label>
										)}
										<input
											type="file"
											id="search-image-upload"
											accept="image/*"
											onChange={(event) => handleImageUpload(event)}
											className={styles.uploadImage}
										/>
										{currentOrg.banner && (
											<img
												className={styles.image}
												alt={"Organization Banner"}
												src={currentOrg ? (currentOrg?.banner ? currentOrg.banner : "") : "none"}
											/>
										)}
									</div>
									{currentOrg.banner && <p className={styles.imageError}>{banner_error_msg}</p>}
								</div>
							</div>
						</div>
					) : (
						<div className={styles.admins}>
							<h3 style={{ margin: "0px" }}>Manage Administrators</h3>
							{submitError && <p className={styles.adminErrorMessage}>{submitError}</p>}
							<div className={styles.scrollRow} style={editMode ? {} : { marginBottom: "35px" }}>
								{currentAdmins.length > 0 && <div className={styles.adminRow}>{renderAdmins()}</div>}
								{currentAdmins.length > 1 && (
									<>
										<div className={styles.scrollBar}></div>
										<img className={styles.scrollArrow} src={arrow} alt={"scroll"} />
									</>
								)}
							</div>
							{editMode && (
								<div className={styles.row}>
									<div style={{ marginRight: "40px" }}>
										<SmallButton
											onClick={() => {
												addAdmin();
												setSubmitAttempts(0);
											}}
										>
											Add Administrator
										</SmallButton>
									</div>
									<div className="flex-column relative items-center justify-center">
										<SmallButton
											onClick={() => {
												onSaveAdmins();
											}}
										>
											Save
										</SmallButton>
										{submitAttempts > 0 && (errorExists() || isFormIncomplete()) && (
											<div className="absolute">
												<ErrorMessage message="Please fix your errors before saving." />
											</div>
										)}
									</div>
								</div>
							)}
						</div>
					)}
				</>
			)}
		</div>
	);
};

export default Organization;
