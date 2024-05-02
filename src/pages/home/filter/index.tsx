import { useForm } from "react-hook-form";

import Dropdown from "components/dropdown";
import InputBox from "components/input_box";
import SearchInputBox from "components/search_input_box";
import SmallButton from "components/small_button/small_button";

import React from "react";

import { custom_general_input_style, custom_search_input_style } from "./styles";

import color_palette from "common/types/colors";

import { FormValues } from "./types";

import { ButtonTypes, Genre } from "common";

const Filter: React.FC<{ onSubmit: Function }> = ({ onSubmit }) => {
	const default_values: FormValues = {
		name: "",
		location: "",
		genre: "",
	};

	const { getValues, handleSubmit, register, setValue } = useForm<FormValues>({
		defaultValues: default_values,
		mode: "onSubmit",
		reValidateMode: "onSubmit",
	});

	const pass_submission = () => {
		onSubmit(getValues());
	};

	return (
		<div className="mt-4 flex w-full flex-col items-center space-y-2 md:my-14">
			<p className="text-center text-3xl md:mb-8">Know what you're looking for? Search below!</p>
			<form
				className="flex w-full flex-col items-center rounded-md border-2 border-medium-blue py-4 md:w-5/12"
				onSubmit={handleSubmit(pass_submission)}
			>
				<SearchInputBox
					{...register("name")}
					className={custom_search_input_style}
					type={"text"}
					placeholder={"Search by venue, event name, etc..."}
					onChange={(value: string) => setValue("name", value)}
					maxLength={35}
					default_color={"transparent"}
					hover_color={color_palette.medium_blue}
				/>
				<InputBox
					{...register("location")}
					className={custom_general_input_style}
					type={"text"}
					placeholder={"Filter by city or zip code..."}
					onChange={(value: string) => setValue("location", value)}
					maxLength={35}
					default_color={"transparent"}
					hover_color={color_palette.medium_blue}
				/>
				<Dropdown
					{...register("genre")}
					className={custom_general_input_style}
					placeholder={"Filter by genre of entertainment..."}
					options={Object.values(Genre)}
					onChange={(value: string) => {
						setValue("genre", value);
					}}
					renderOption={(option: any, index: number) => {
						return (
							<option value={option} key={index}>
								{option}
							</option>
						);
					}}
					default_color={"transparent"}
					hover_color={color_palette.medium_blue}
				/>
				<SmallButton type={ButtonTypes.Submit}>Search</SmallButton>
			</form>
		</div>
	);
};

export default Filter;
