import { useState } from "react";
import { useForm } from "react-hook-form";

import ErrorMessage from "components/error_message";
import InputBox from "components/input_box";
import Loader from "partials/loader/loader";
import Modal from "components/modal/modal";
import SmallButton from "components/small_button/small_button";

import { ButtonTypes } from "common";

import ShieldCheckIcon from "common/icons/shield_logo.svg";

type Props = {
	success: boolean;
	warning?: string;
	on_add: Function;
	on_exit: Function;
};

const AddTerminalModal = ({ success, warning, on_add, on_exit }: Props) => {
	const {
		clearErrors,
		formState: { errors },
		getValues,
		handleSubmit,
		register,
		reset,
		setValue,
	} = useForm<{ registration_code: string; name: string }>({
		defaultValues: {
			registration_code: "",
			name: "",
		},
		mode: "onSubmit",
		reValidateMode: "onSubmit",
	});

	const [loading, set_loading] = useState<boolean>(false);

	const handle_add = () => {
		set_loading(true);

		on_add(getValues());
	};

	const handle_exit = () => {
		if (loading) set_loading(false);

		reset();
		clearErrors();
		on_exit();
	};

	if (success) {
		return (
			<Modal onExit={handle_exit}>
				<div className={"flex w-[470px] flex-col items-center px-6"}>
					<img className={"w-[450px]"} src={ShieldCheckIcon} alt={"Shield logo with checkmark"} />
					<h2>Successfully added a new terminal!</h2>
					<SmallButton onClick={handle_exit}>Exit</SmallButton>
				</div>
			</Modal>
		);
	}

	if (loading && !warning) {
		return (
			<Modal onExit={handle_exit}>
				<div
					style={{
						height: "235px",
						width: "470px",
						marginTop: "75px",
					}}
				>
					<Loader />
				</div>
			</Modal>
		);
	} else if (loading && warning) {
		set_loading(false);
	}

	return (
		<Modal onExit={handle_exit}>
			<form className={"mb-[10px] flex w-[470px] flex-col items-center px-[10px]"} onSubmit={handleSubmit(handle_add)}>
				<h1 className={"my-[15px]"}>Add Terminal</h1>
				<div className={"mb-[15px] flex w-full flex-col items-start"}>
					<h3 className={"text-sm-header"}>Terminal Name</h3>
					<InputBox
						{...register("name", {
							required: "Please enter a nickname for your terminal!",
							maxLength: { value: 125, message: "Keep names under 125 characters!" },
							minLength: { value: 1, message: "Please enter a name that is more than 1 character!" },
						})}
						placeholder={"Enter a name for your terminal e.g. Terminal #1..."}
						onChange={(value: string) => setValue("name", value)}
					/>
					{errors?.name?.message && <ErrorMessage message={errors.name.message} />}
				</div>
				<div className={"mb-[30px] flex w-full flex-col items-start "}>
					<h3 className={"text-sm-header"}>Registration Code</h3>
					<InputBox
						{...register("registration_code", {
							required: "Please input the registration code on your terminal!",
							maxLength: { value: 125, message: "Registration code should be less than 125 characters" },
							minLength: { value: 1, message: "Registration code should be more than 1 character!" },
						})}
						placeholder={"Enter the registration code attached to your Stripe terminal..."}
						onChange={(value: string) => setValue("registration_code", value)}
					/>
					{errors?.registration_code?.message && <ErrorMessage message={errors.registration_code.message} />}
				</div>
				<SmallButton type={ButtonTypes.Submit}>Submit</SmallButton>
			</form>
			{warning && <ErrorMessage message={warning} />}
		</Modal>
	);
};

export default AddTerminalModal;
