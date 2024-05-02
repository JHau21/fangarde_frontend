import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";

import BillingSummaryBox from "components/billing_summary_components/billing_summary_box";
import CommonBarSmall from "components/bars/common_bar_small";
import SmallButton from "components/small_button/small_button";

import { use_ticket_order } from "state/events/use_ticket_order";

import { format_confirmation_date, format_day_time } from "utils/common_methods";

import color_palette from "common/types/colors";

import { DonationType } from "common";

const Confirmation = () => {
	const { selected_tickets, selected_event, promo_discount, donation, reset } = use_ticket_order();
	const navigate = useNavigate();

	const { primary_color, secondary_color } = selected_event?.color_scheme ?? {
		primary_color: undefined,
		secondary_color: undefined,
	};

	const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 });

	const handleLoadMap = () => {
		if (window.google && window.google.maps) {
			const geocoder = new window.google.maps.Geocoder();

			console.log("execute", geocoder);

			if (selected_event && selected_event.location) {
				const { address } = selected_event.location;
				const formatted_address: string = address.street + ", " + address.city + ", " + address.state;

				geocoder.geocode({ address: formatted_address }, (results, status) => {
					if (status === "OK" && results && results[0]) {
						const { lat, lng } = results[0].geometry.location;

						setMapCenter({ lat: lat(), lng: lng() });

						console.log("execution completed");
					}
				});
			}
		} else {
			console.error("Google Maps script not loaded");
		}
	};

	const go_forward = () => {
		reset();
		navigate("/");
	};

	if (selected_event && selected_tickets) {
		return (
			<div className="my-4 w-full text-center md:my-8">
				<div className="my-4 flex flex-col items-center text-center">
					<h1 className="max-w-300 md:max-w-1000 m-0 my-20 truncate p-0 text-lg-header font-bold">
						{selected_event?.name}
					</h1>
					<div className="h-50 m-0 flex flex-row items-center p-0">
						<h2
							className="text-left font-custom text-md-header font-bold "
							style={{ color: primary_color ?? color_palette.medium_blue }}
						>
							{format_confirmation_date(new Date(selected_event.event_start_time))}
						</h2>
						<CommonBarSmall className="text-left font-custom text-md-header text-fangarde-gray" />
						<h2 className="text-left font-custom text-md-header text-fangarde-gray">
							{format_day_time(new Date(selected_event.event_start_time))}
						</h2>
					</div>
				</div>
				<div className="map-container mb-4 flex h-[300px] w-[300px] flex-col items-center justify-center border-4 border-red-500">
					<GoogleMap
						mapContainerStyle={{ height: "100%", width: "100%" }}
						center={mapCenter}
						zoom={15}
						onLoad={handleLoadMap}
					>
						<Marker position={mapCenter} />
					</GoogleMap>
				</div>
				<div className="mx-auto flex w-11/12 flex-col md:w-4/12">
					<h2 className="m-0 mb-10 p-0 text-md-header font-bold">Order Details</h2>
					<BillingSummaryBox
						selected_tickets={selected_tickets}
						donation_amount={donation ? Number(donation.amount) : 0}
						donation_type={
							selected_event?.donation_type === DonationType.Flat ||
							selected_event?.donation_type === DonationType.Percentage
								? selected_event?.donation_type
								: undefined
						}
						promo_discount={promo_discount}
					/>
				</div>
				<SmallButton
					default_color={primary_color}
					hover_color={secondary_color}
					active_color={primary_color}
					className="my-[10px] h-8 w-[235px] rounded-md bg-transparent font-custom text-regular md:w-1/3"
					onClick={() => go_forward()}
				>
					Exit
				</SmallButton>
			</div>
		);
	} else return null;
};

export default Confirmation;
