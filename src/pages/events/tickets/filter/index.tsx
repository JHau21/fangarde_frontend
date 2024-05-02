import React from "react";
import { useForm } from "react-hook-form";

import Dropdown from "components/dropdown";
import InputBox from "components/input_box";
import TextButton from "components/text_button";

import { default_filters, default_price_filters } from "./utils";

import color_palette from "common/types/colors";

import { Filters } from "../types";

type Props = {
	primary_color?: string;
	secondary_color?: string;
	onChange: Function;
	onReset: Function;
};

const TicketFilter: React.FC<Props> = ({ primary_color, secondary_color, onChange, onReset }) => {
	const { getValues, handleSubmit, register, reset, setValue } = useForm<Filters>({
		defaultValues: default_filters,
		mode: "onChange",
		reValidateMode: "onChange",
	});

	const clear = () => {
		reset();
		onReset();
	};

	const pass_submission = async () => {
		onChange(getValues());
	};

	const set_filters = (type: string, value: number) => {
		switch (type) {
			case "high": {
				if (getValues("low_price") > -1 && value < getValues("low_price")) {
					setValue("high_price", 500);

					break;
				}

				setValue("high_price", value);

				break;
			}
			case "low": {
				if (getValues("high_price") > -1 && value > getValues("high_price")) {
					setValue("low_price", 1);

					break;
				}

				setValue("low_price", value);

				break;
			}
		}
	};

	return (
		<div className="mb-[10px] flex w-full flex-col rounded-md">
			<form className={`flex w-full flex-col text-xl font-semibold`} onChange={handleSubmit(pass_submission)}>
				<div className="mb-4 h-[40px] w-full">
					<InputBox
						{...register("search")}
						type="text"
						value={getValues("search").toString()}
						placeholder="Search for specific seats or tickets..."
						onChange={(value: string) => setValue("search", value)}
						default_color={primary_color}
						hover_color={secondary_color}
						focus_color={secondary_color}
					/>
				</div>
				<div className="flex flex-row items-center justify-between space-x-4 md:flex-row">
					<div className={"flex w-1/3 flex-row items-center"}>
						<p
							className={"text-bold min-w-[60px] font-custom md:min-w-[105px]"}
							style={{ color: primary_color ?? color_palette.medium_blue }}
						>
							Low Price:{" "}
						</p>
						<Dropdown
							{...register("low_price")}
							options={default_price_filters}
							value={getValues("low_price").toString()}
							renderOption={(option: string, index: any) => {
								return (
									<option value={option} key={index}>
										{option}
									</option>
								);
							}}
							onChange={(value: string) => set_filters("low", Number(value))}
							default_color={primary_color}
							hover_color={secondary_color}
							focus_color={secondary_color}
						/>
					</div>
					<div className={"flex w-1/3 flex-row items-center"}>
						<p
							className={"text-bold min-w-[60px] font-custom md:min-w-[105px]"}
							style={{ color: primary_color ?? color_palette.medium_blue }}
						>
							High Price:{" "}
						</p>
						<Dropdown
							{...register("high_price")}
							options={default_price_filters}
							value={getValues("high_price").toString()}
							renderOption={(option: string, index: any) => {
								return (
									<option value={option} key={index}>
										{option}
									</option>
								);
							}}
							onChange={(value: string) => set_filters("high", Number(value))}
							default_color={primary_color}
							hover_color={secondary_color}
							focus_color={secondary_color}
						/>
					</div>
					<div className={"w-1/3 text-right"}>
						<TextButton
							label={"Reset Filters"}
							onClick={() => clear()}
							default_color={primary_color}
							hover_color={secondary_color}
							active_color={primary_color}
						/>
					</div>
				</div>
			</form>
		</div>
	);
};

export default TicketFilter;
