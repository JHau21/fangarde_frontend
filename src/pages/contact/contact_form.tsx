import React from "react";
import { FieldValues, useForm } from "react-hook-form";

import ErrorMessage from "components/error_message";
import InputBox from "components/input_box";
import SmallButton from "components/small_button/small_button";

import { ButtonTypes } from "common";

interface Props {
	onSubmit: Function;
}

const Form = ({ onSubmit }: Props): React.ReactElement => {
	const {
		clearErrors,
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm({
		defaultValues: {
			first_name: "",
			last_name: "",
			email: "",
			message: "",
		},
		mode: "onSubmit",
		reValidateMode: "onSubmit",
	});

	const handle_form_submit = (data: FieldValues) => {
		onSubmit(data);
	};

	return (
		<form className="mx-auto my-[15px] flex w-5/6 flex-col items-center" onSubmit={handleSubmit(handle_form_submit)}>
			<div className={"my-[5px] flex w-full flex-row items-center justify-between"}>
				<div className={"flex w-[48%] flex-col items-start"}>
					<h3>First Name:</h3>
					<InputBox
						{...register("first_name", {
							required: "First name is required",
							maxLength: { value: 80, message: "First name exceeds 80 characters" },
						})}
						onChange={(value: string) => {
							setValue("first_name", value);
							clearErrors("first_name");
						}}
					/>
					{errors?.first_name?.message && <ErrorMessage message={errors.first_name.message} />}
				</div>
				<div className={"flex w-[48%] flex-col items-start"}>
					<h3>Last Name:</h3>
					<InputBox
						{...register("last_name", {
							required: "Last name is required",
							maxLength: { value: 80, message: "Last name exceeds 80 characters" },
						})}
						onChange={(value: string) => {
							setValue("last_name", value);
							clearErrors("last_name");
						}}
					/>
					{errors?.last_name?.message && <ErrorMessage message={errors.last_name.message} />}
				</div>
			</div>
			<div className={"my-[5px] flex w-full flex-col items-start"}>
				<h3>Email Address:</h3>
				<InputBox
					{...register("email", {
						required: "Email is required",
						pattern: {
							value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i,
							message: "Please enter a valid email address",
						},
						maxLength: { value: 80, message: "Email exceeds 80 characters" },
					})}
					onChange={(value: string) => {
						setValue("email", value);
						clearErrors("email");
					}}
				/>
				{errors?.email?.message && <ErrorMessage message={errors.email.message} />}
			</div>
			<div className={"my-[5px] flex w-full flex-col items-start"}>
				<h3>Question/Concern:</h3>
				<InputBox
					{...register("message", {
						required: "Question/Concern is required",
						maxLength: { value: 500, message: "Question/Concern exceeds 500 characters" },
					})}
					onChange={(value: string) => {
						setValue("message", value);
						clearErrors("message");
					}}
				/>
				{errors?.message?.message && <ErrorMessage message={errors.message.message} />}
			</div>
			<div className={"my-[15px]"}>
				<SmallButton type={ButtonTypes.Submit}>Submit</SmallButton>
			</div>
		</form>
	);
};

export default Form;
