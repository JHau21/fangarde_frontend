import React from "react";
import { useForm } from "react-hook-form";

import ErrorMessage from "components/error_message";
import InputBox from "components/input_box";
import SmallButton from "components/small_button/small_button";

type Props = {
	disallow_promo: boolean;
	primary_color?: string;
	secondary_color?: string;
	submit_promo_code: Function;
	disabled: boolean;
};

const PromoCodeSection: React.FC<Props> = ({ disallow_promo, primary_color, secondary_color, submit_promo_code, disabled }) => {
	const {
		clearErrors,
		formState: { errors },
		getValues,
		handleSubmit,
		register,
		setValue,
	} = useForm<{ promo_code: string }>({
		defaultValues: { promo_code: "" },
		mode: "onSubmit",
		reValidateMode: "onSubmit",
	});

	const on_submit = () => {
		const error_list: Array<any> = Object.keys(errors);

		if (!error_list.length) {
			const value: { promo_code: string } = getValues();

			clearErrors();

			submit_promo_code(value.promo_code);
		}
	};

	return (
		<form className={"my-[10px] flex w-full flex-col items-start"} onSubmit={handleSubmit(on_submit)}>
			<h3 className={"m-0 mb-[10px] h-[20px] w-full"}>Promo Code</h3>
			<div className={"flex w-full flex-row items-center"}>
				<div className={"w-9/12"}>
					<InputBox
						{...register("promo_code", {
							minLength: { value: 1, message: "Please enter a promo code!" },
						})}
						placeholder={disallow_promo ? "No promo code allowed for this event!" : "Get your discount now!"}
						disabled={disabled}
						onChange={(value: string) => setValue("promo_code", value)}
						maxLength={25}
						default_color={primary_color}
						hover_color={secondary_color}
						focus_color={secondary_color}
					/>
				</div>
				<SmallButton
					className="h-9 w-36 rounded-md border-[3px] bg-transparent font-custom text-regular "
					disabled={disabled}
					default_color={primary_color}
					hover_color={secondary_color}
					active_color={primary_color}
				>
					Apply
				</SmallButton>
			</div>
			{errors?.promo_code && <ErrorMessage message={errors.promo_code.toString()} />}
		</form>
	);
};

export default PromoCodeSection;
