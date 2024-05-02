import { useEffect, useState } from "react";

import Dropdown from "components/dropdown";
import ErrorMessage from "components/error_message";
import InputBox from "components/input_box";
import SmallButton from "components/small_button/small_button";

import { api } from "axiosClients/client";

import { useUser } from "state/useUser";

import { format_address } from "utils/common_methods";
import states from "pages/account/sign_up_flow/components/sign_up_org_location/states";

import { EmptyLocation, GeneralEventErrors } from "pages/account/admin/types/types";

type PhysicalLocationFormProps = {
	event: EventCreate;
	handleChange: (
		value: any,
		header: keyof EventCreate,
		subHeader?: keyof EventLocation,
		subsubHeader?: keyof Address,
		prev?: any
	) => void;
	renderErrors: (header: keyof EventCreate, subHeader: keyof EventLocation) => JSX.Element;
	displayErrors: boolean;
	setErrors: (errors: GeneralEventErrors) => void;
	errors: GeneralEventErrors;
};

const PhysicalLocationForm = ({
	event,
	handleChange,
	renderErrors,
	displayErrors,
	setErrors,
	errors,
}: PhysicalLocationFormProps) => {
	const { location } = event;
	const { address } = location;
	const { street, city, state, zip } = address;
	const organization = useUser((state) => state.userOrganization);
	const set_organization = useUser((state) => state.setUserOrganization);
	const [location_value, set_location_value] = useState(-1);
	const [loading, set_loading] = useState(false);
	const [location_result, set_location_result] = useState<string>("");

	function on_save_location() {
		set_location_result("");
		if (location_value === -1) {
			set_loading(true);
			api.post("/save_location", {
				new_location: event.location,
				organization: organization,
			})
				.then((res) => {
					const { data } = res;
					const { message, organization, new_location_id } = data;
					set_location_value(
						organization.locations.findIndex((location: any) => location._id.toString() === new_location_id.toString())
					);
					set_organization(organization);
					set_loading(false);
					set_location_result(message);
				})
				.catch((err) => {
					set_loading(false);
					console.log(err);
					if (err?.response?.data?.message) {
						set_location_result(err.response.data.message);
					} else {
						set_location_result("An error occurred. Please try again later.");
					}
				});
		}
	}

	function validate_zip_code(zipCode: string) {
		const zipCodeRegex = /^\d{5}(?:[-\s]\d{4})?$/;
		if (!zipCodeRegex.test(zipCode)) {
			setErrors({
				...errors,
				zip: "Please enter a valid zip code!",
			});
		} else {
			setErrors({
				...errors,
				zip: "",
			});
		}
	}
	function render_address_errors(header: keyof Address) {
		if (displayErrors && errors[header]) {
			return <ErrorMessage message={errors[header]} />;
		} else if (displayErrors && address[header] === "") {
			return <ErrorMessage message={"This field is required!"} />;
		} else {
			return <div className="h-[24px]"></div>; // hacky way to even out spacing
		}
	}
	useEffect(() => {
		set_location_result("");
	}, [location_value]);
	return (
		<>
			<h3>Saved Locations:</h3>
			<Dropdown
				options={organization?.locations !== undefined ? organization?.locations : [EmptyLocation]}
				default_option={<option value={-1}>Please select an option.</option>}
				value={location_value}
				renderOption={(option: EventLocation, index: number) => {
					return (
						<option key={index} value={index}>
							{`${option.name}, ${format_address(option.address)}`}
						</option>
					);
				}}
				onChange={(index: number) => {
					if (Number(index) === -1) {
						handleChange(EmptyLocation, "location");
						set_location_value(Number(index));
					} else {
						handleChange(organization.locations[index], "location");
						set_location_value(Number(index));
					}
				}}
			/>
			<div className={`${"mb-[10px] flex w-full flex-row justify-between"} mt-[40px]`}>
				<div className={"relative flex w-[206px] flex-col items-start self-center"}>
					<h3>Location Name:</h3>
					<InputBox
						value={event.location.name}
						maxLength={250}
						onChange={(value: string) => handleChange(value, "location", "name")}
					/>
					{renderErrors("location", "name")}
				</div>
				<div className={"relative flex w-[206px] flex-col items-start self-center"}>
					<h3>Street Address:</h3>
					<InputBox
						value={street}
						maxLength={200}
						onChange={(value: string) => handleChange(value, "location", "address", "street")}
						autocomplete="street-address"
					/>
					{render_address_errors("street")}
				</div>
			</div>
			<div className={"mb-[10px] flex w-full flex-row justify-between"}>
				<div className={"relative flex w-[206px] flex-col items-start self-center"}>
					<h3>City:</h3>
					<InputBox
						value={city}
						maxLength={100}
						onChange={(value: string) => handleChange(value, "location", "address", "city")}
						autocomplete="address-level2"
					/>
					{render_address_errors("city")}
				</div>
				<div className={"relative flex w-[206px] flex-col items-start self-center"}>
					<h3>State:</h3>
					<Dropdown
						options={states}
						value={state}
						renderOption={(option: any, index: number) => {
							const { name, abbreviation } = option;

							return (
								<option key={index} value={name}>
									{abbreviation} - {name}
								</option>
							);
						}}
						onChange={(value: string) => handleChange(value, "location", "address", "state")}
						autocomplete="address-level1"
					/>
					{render_address_errors("state")}
				</div>
			</div>
			<div className={"relative self-center"}>
				<h3>Zip Code:</h3>
				<InputBox
					value={zip}
					maxLength={5}
					onChange={(value: string) => {
						validate_zip_code(value);
						handleChange(value, "location", "address", "zip");
					}}
					autocomplete="postal-code"
				/>
				{render_address_errors("zip")}
			</div>
			<div className={"mb-[10px] flex w-full flex-row justify-between"}>
				<div>
					<SmallButton
						width={200}
						onClick={() => {
							on_save_location();
							set_location_value(-1);
						}}
						loading={loading}
						disabled={location_value !== -1}
					>
						Save Location
					</SmallButton>
					<ErrorMessage message={location_result} style={{ position: "absolute" }} />
				</div>
				<SmallButton
					onClick={() => {
						handleChange({ ...EmptyLocation, address: { ...EmptyLocation.address, state: "" } }, "location");
						set_location_value(-1);
						set_location_result("");
					}}
					width={200}
				>
					Clear Location
				</SmallButton>
			</div>
		</>
	);
};

export default PhysicalLocationForm;
