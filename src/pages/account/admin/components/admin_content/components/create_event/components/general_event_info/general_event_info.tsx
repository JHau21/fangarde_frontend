import { useState } from "react";

import Dropdown from "components/dropdown";
import ErrorMessage from "components/error_message";
import InputBox from "components/input_box";
import PhysicalLocationForm from "../physical_location_form";
import RadioComponent from "../radio_component/radio_component";
import SmallButton from "../../../../../../../../../components/small_button/small_button";
import TextAreaInputBox from "components/text_area";

import { convertToBase64 } from "../../../../../../../../../common/functions";

import styles from "./general_event_info.module.css";

import { GeneralEventErrors, EmptyGeneralEventErrors, Location_Type, EmptyAddress } from "../../../../../../types/types";
import { Genre } from "../../../../../../../../../common";

type GeneralEventInfoProps = {
	event: EventCreate;
	setEvent: Function;
	onContinue: Function;
	onBack: Function;
};

const GeneralEventInfo = ({ onBack, onContinue, setEvent, event }: GeneralEventInfoProps) => {
	const [bannerImage, setBannerImage] = useState<string>(event.banner ? event.banner : "");
	const [bannerErrorMsg, setBannerErrorMsg] = useState<string>("");
	const [searchImage, setSearchImage] = useState<string>(event.search_image ? event.search_image : "");
	const [searchImageError, setSearchImageError] = useState<string>("");
	const [displayErrors, setDisplayErrors] = useState<boolean>(false);
	const [errors, setErrors] = useState<GeneralEventErrors>(EmptyGeneralEventErrors);
	const location_type_options = [
		{
			value: Location_Type.Physical,
			id: "physical",
			handleChange: (value: string) => {
				setEvent({
					...event,
					location: {
						...location,
						type: value,
						name: "",
					},
				});
			},
			label: "Physical",
			checked: event.location?.type === "physical",
		},
		{
			value: Location_Type.Online,
			id: "online",
			handleChange: (value: string) => {
				setEvent({
					...event,
					location: {
						...location,
						type: value,
					},
				});
			},
			label: "Online",
			checked: event.location?.type === "online",
		},
		{
			value: Location_Type.TBA,
			id: "tba",
			handleChange: (value: string) => {
				setEvent({
					...event,
					location: {
						...location,
						type: value,
					},
				});
			},
			label: "To Be Announced",
			checked: event.location.type === "tba",
		},
	];
	const { location } = event;
	const { address, name, meeting_url, type } = location;
	const { street, zip, state, city } = address;

	const isFormComplete =
		event.name !== "" &&
		event.genre !== Genre.None &&
		((type === Location_Type.Physical &&
			event.location.name !== "" &&
			city !== "" &&
			street !== "" &&
			state !== "" &&
			zip !== "") ||
			(type === Location_Type.Online && meeting_url !== "") ||
			type === Location_Type.TBA);
	const noErrorsPresent =
		errors.genre === "" &&
		errors.name === "" &&
		((type === Location_Type.Physical &&
			errors.location_name === "" &&
			errors.city === "" &&
			errors.street === "" &&
			errors.state === "" &&
			errors.zip === "") ||
			(type === Location_Type.Online && errors.meeting_url === "") ||
			type === Location_Type.TBA);
	function renderErrors(header: keyof EventCreate, subHeader?: keyof EventLocation) {
		if (displayErrors && subHeader && event[header][subHeader] === "") {
			return <ErrorMessage message={"This field is required!"} />;
		} else if (displayErrors && (event[header] === "" || event[header] === Genre.None)) {
			return <ErrorMessage message={"This field is required!"} />;
		} else {
			return <div className="h-[24px]"></div>; // hacky way to even out spacing
		}
	}
	async function handleImageUpload(e: any, setImage: Function, setError: Function, header: keyof EventCreate) {
		const selectedFile = e.target.files[0];
		const MAX_FILE_SIZE = 7168;

		const fileSizeKiloBytes = selectedFile.size / 1024;
		if (fileSizeKiloBytes > MAX_FILE_SIZE) {
			setError("File size is greater than maximum limit: 7MB");
			return;
		} else {
			setError("");
			setImage(await convertToBase64(selectedFile));
			setEvent({
				...event,
				[header]: await convertToBase64(selectedFile),
			});
		}
	}
	function handleChange(
		value: any,
		header: keyof EventCreate,
		subHeader?: keyof EventLocation,
		subsubHeader?: keyof Address,
		prev?: any
	) {
		let newEvent: EventCreate;

		if (!subHeader) {
			newEvent = {
				...event,
				[header]: value,
			};
		} else if (subsubHeader) {
			newEvent = {
				...event,
				[header]: {
					...event[header],
					[subHeader]: {
						...event[header][subHeader],
						[subsubHeader]: value,
					},
				},
			};
		} else {
			newEvent = {
				...event,
				[header]: {
					...event[header],
					[subHeader]: value,
				},
			};
		}
		setEvent(newEvent);
	}
	function handleContinue() {
		if (isFormComplete && noErrorsPresent) {
			if (event.location.type === Location_Type.Physical) {
				setEvent({
					...event,
					location: {
						...location,
						meeting_url: "",
					},
				});
			} else if (event.location.type === Location_Type.Online) {
				setEvent({
					...event,
					location: {
						...location,
						name: "Virtual",
						address: {
							city: "",
							state: "",
							street: "",
							zip: "",
						},
					},
				});
			} else if (event.location.type === Location_Type.TBA) {
				setEvent({
					...event,
					location: {
						...location,
						name: "To Be Announced",
						meeting_url: "",
						address: EmptyAddress,
					},
				});
			}
			onContinue();
		} else {
			setDisplayErrors(true);
		}
	}
	return (
		<div className="mt-4 flex flex-col items-center">
			<div className={styles.column}>
				<h1>General Event Information</h1>
				<div className={styles.userInputRow}>
					<div className={styles.userInputColumn}>
						<h2 className={styles.inputTitle}>Event General Information</h2>
						<div className={styles.userInputRow}>
							<div className={styles.inputContainer}>
								<h3>Event Name:</h3>
								<InputBox
									value={event.name}
									maxLength={250}
									onChange={(value: string) => handleChange(value, "name")}
								/>
								{renderErrors("name")}
							</div>
							<div className={styles.inputContainer}>
								<h3>Event Type:</h3>
								<Dropdown
									options={Object.values(Genre)}
									value={event.genre}
									renderOption={(option: any, index: number) => {
										return (
											<option key={index} value={option}>
												{option}
											</option>
										);
									}}
									onChange={(value: string) => handleChange(value, "genre")}
								/>
								{renderErrors("genre")}
							</div>
						</div>
						<div className={"mb-[30px] flex w-full flex-col items-start"}>
							<h3>Event Subtitle (Optional): </h3>
							<InputBox
								value={event.subtitle}
								maxLength={250}
								onChange={(value: string) => handleChange(value, "subtitle")}
							/>
						</div>
						<h3>Event Description (Optional):</h3>
						<TextAreaInputBox
							value={event.description}
							maxLength={1245}
							onChange={(value: string) => handleChange(value, "description")}
							placeholder="Please enter a description for your event here. This will be seen in your event information page.  Max characters: 1245"
						/>
					</div>
					<div className={styles.userInputColumn}>
						<h2 className={styles.inputTitle}>Event Banner (Optional)</h2>
						<div className={!bannerImage ? styles.imageContainer : styles.imageUploaded}>
							<label htmlFor="banner-image-upload" className={styles.uploadImageButton} onClick={() => {}}>
								Edit
							</label>
							<input
								type="file"
								id="banner-image-upload"
								accept="image/*"
								onChange={(event) => handleImageUpload(event, setBannerImage, setBannerErrorMsg, "banner")}
								className={styles.uploadImage}
							/>
							{bannerImage && <img className={styles.banner} alt={"Event Search "} src={bannerImage} />}
						</div>
						{bannerErrorMsg && <ErrorMessage message={bannerErrorMsg} />}
					</div>
				</div>
				<div className={styles.userInputRow}>
					<div className={styles.userInputColumn}>
						<h2 className={styles.inputTitle}>Event Location Information</h2>
						<div className="align-center mb-[40px] flex flex-row justify-between self-center">
							<RadioComponent
								options={location_type_options}
								selected_value={event.location.type}
								custom_button_class="font-custom text-regular w-[120px] h-[80px] border-[3px] rounded-md"
								selected_button_class="border-[2px] bg-dark-blue font-custom text-regular w-[120px] h-[80px] rounded-md text-fangarde-white font-custom"
								row
							/>
						</div>
						{event.location.type === Location_Type.Physical && (
							<PhysicalLocationForm
								event={event}
								errors={errors}
								setErrors={setErrors}
								renderErrors={renderErrors}
								handleChange={handleChange}
								displayErrors={displayErrors}
							/>
						)}
						{event.location.type === Location_Type.Online && (
							<>
								<div className={"mb-[30px] flex w-full flex-col items-start"}>
									<h3>Meeting Link:</h3>
									<InputBox
										value={meeting_url}
										maxLength={200}
										onChange={(value: string) => handleChange(value, "location", "meeting_url")}
										placeholder="You can use your Zoom or any platform of your choice."
									/>
									{/* {Render errors} */}
								</div>
								<div className={"mb-[30px] flex w-full flex-col items-start"}>
									<h3>Additional Instructions(Optional):</h3>
									<TextAreaInputBox
										value={event.location.additional_location_info}
										maxLength={1245}
										placeholder="Please enter any additional instructions for the meeting link here. Max characters: 1245"
										onChange={(value: string) => handleChange(value, "location", "additional_location_info")}
									/>
									{/* {Render errors} */}
								</div>
							</>
						)}
					</div>
					<div className={styles.userInputColumn}>
						<h2 className={styles.inputTitle}>Event Search Image (Optional)</h2>
						<div className={!searchImage ? styles.imageContainer : styles.imageUploaded}>
							<label htmlFor="search-image-upload" className={styles.uploadImageButton} onClick={() => {}}>
								Edit
							</label>
							<input
								type="file"
								id="search-image-upload"
								accept="image/*"
								onChange={(event) => handleImageUpload(event, setSearchImage, setSearchImageError, "search_image")}
								className={styles.uploadImage}
							/>
							{searchImage && <img className={styles.banner} alt={"Event Search "} src={searchImage} />}
						</div>
						{searchImageError && <ErrorMessage message={searchImageError} />}
					</div>
				</div>
				<div className={styles.buttonRow}>
					<SmallButton
						onClick={() => {
							onBack();
						}}
					>
						Back
					</SmallButton>
					<div className={styles.continue}>
						<SmallButton
							onClick={() => {
								handleContinue();
							}}
						>
							Continue
						</SmallButton>
						{!isFormComplete && displayErrors && (
							<p className={styles.errorMessageSubmit}>{"Please fix your errors before submitting!"}</p>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default GeneralEventInfo;
