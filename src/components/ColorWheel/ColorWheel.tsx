import { useState } from "react";
import { SketchPicker } from "react-color";

import ErrorMessage from "components/error_message";

import { api } from "axiosClients/client";
import SmallButton from "../small_button/small_button";
import styles from "./ColorWheel.module.css";
import { useOutletContext } from "react-router-dom";
import { EventContext } from "../../pages/account/admin/types/types";

const ColorWheel = () => {
	const context: EventContext = useOutletContext();
	const [render_color_wheel, set_render_color_wheel] = useState<boolean>(false);
	const [primary_color, set_primary_color] = useState("#FFFFFF");
	const [secondary_color, set_secondary_color] = useState("#FFFFFF");
	const [err, set_err] = useState<string>("");
	const [success, set_success] = useState<string>("");

	const handle_submit = async () => {
		try {
			await api.post("/update_event", {
				event: {
					_id: context?.selected_event?._id,
					color_scheme: {
						primary_color,
						secondary_color,
					},
				},
			});
		} catch (error) {
			set_err("There was an error setting your color scheme, please try again");
		}

		set_success("Event color scheme updated successfully!");
		set_render_color_wheel(false);
	};

	return (
		<div className={"relative"}>
			{!render_color_wheel && (
				<SmallButton
					onClick={() => {
						set_err("");
						set_success("");
						set_render_color_wheel(!render_color_wheel);
					}}
				>
					Set Color Scheme
				</SmallButton>
			)}
			{err && (
				<ErrorMessage
					message={err}
					className="absolute right-[40%] top-[100%] w-full whitespace-nowrap font-custom text-regular font-bold text-fangarde-medium-red "
				/>
			)}
			{success && (
				<ErrorMessage
					message={success}
					className="absolute right-[40%] top-[100%] w-full whitespace-nowrap font-custom text-regular font-bold text-green-400 "
				/>
			)}
			{render_color_wheel && (
				<div className="relative flex w-[500px] flex-col items-center justify-between">
					<div className={"flex w-[500px] flex-row items-center justify-between"}>
						<SmallButton
							onClick={() => {
								set_err("");
								set_success("");
								set_render_color_wheel(!render_color_wheel);
							}}
						>
							Cancel
						</SmallButton>
						{render_color_wheel && <SmallButton onClick={handle_submit}>Done</SmallButton>}
					</div>
					<div
						className={
							"absolute left-0 top-[350%] z-50 flex h-[230px] w-full flex-row items-center justify-between text-center"
						}
					>
						<div>
							<p>Main Color</p>
							<SketchPicker color={primary_color} onChange={({ hex }) => set_primary_color(hex)} />
						</div>
						<div>
							<p>Secondary Color</p>
							<SketchPicker color={secondary_color} onChange={({ hex }) => set_secondary_color(hex)} />
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default ColorWheel;
