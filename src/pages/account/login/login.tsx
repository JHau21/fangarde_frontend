import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import SmallButton from "components/small_button/small_button";
import InputBox from "components/input_box";

import { AxiosResponse } from "axios";
import { api } from "axiosClients/client";
import { useUser } from "state/useUser";
import { get_current_jwt, set_current_jwt } from "utils/user";

import styles from "pages/account/login/login.module.css";
import { use_sign_up } from "state/use_sign_up";

const Login = () => {
	const [show_password, set_show_password] = useState<boolean>(false);

	const {
		clearErrors,
		register,
		handleSubmit,
		setError,
		setValue,
		formState: { errors },
	} = useForm({
		defaultValues: {
			authFail: "",
			email: "",
			password: "",
		},
		mode: "onSubmit",
		reValidateMode: "onSubmit",
	});

	const init_sign_up = use_sign_up((state) => state.init);
	const navigate = useNavigate();
	let location = useLocation();

	//State
	const setJwt = useUser((state) => state.setJwt);
	const setUser = useUser((state) => state.setUser);
	const setUserOrganization = useUser((state) => state.setUserOrganization);
	const setUpcomingEvents = useUser((state) => state.setUpcomingEvents);
	const setPastEvents = useUser((state) => state.setPastEvents);

	//Reroute if logged in
	const token = get_current_jwt();

	if (token) {
		return <Navigate to="/account/info" state={{ from: location }} replace />;
	}

	async function onSubmit(vals: FieldValues) {
		if (errors.email || errors.password) return;

		try {
			const loginData: AxiosResponse = await api.post("/login_admin", vals);

			setUser(loginData.data.user);
			setJwt(loginData.data.auth);
			set_current_jwt(loginData.data.auth);
			navigate("/account/info");
			window.scrollTo(0, 0);

			if (loginData.data.organization) {
				setUserOrganization(loginData.data.organization);

				const res = await api.post("/get_events");
				if (res?.data?.upcoming_events) {
					setUpcomingEvents(res.data.upcoming_events);
				}
				if (res.data.past_events !== undefined) {
					setPastEvents(res.data.past_events);
				}
			}
		} catch (error: any) {
			const errMessage = error?.response?.data?.message;

			return setError("authFail", {
				type: "custom",
				message: errMessage ?? "There was an error logging you in, please try again",
			});
		}
	}

	return (
		<div className="common_root">
			<form className={styles.column} onSubmit={handleSubmit(onSubmit)}>
				<h1 className="common_bold">Sign In!</h1>
				<div className={`${styles.userInput} mb-4`}>
					<p className="common_bold mb-2">Email:</p>
					<InputBox
						{...register("email", {
							required: "Email is required",
							pattern: {
								value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
								message: "Please enter a valid email",
							},
						})}
						onChange={(value: string) => {
							setValue("email", value); // handles browser autofill
							clearErrors("authFail");
						}}
					/>
					{errors["email"] && <p className={styles.errorMessage}>{errors["email"].message}</p>}
				</div>
				<div className={`${styles.userInput} mb-4`}>
					<p className="common_bold mb-2">Password:</p>
					<div className={`relative ${styles.password}`}>
						<InputBox
							{...register("password", {
								required: "Password is required",
							})}
							onChange={(value: string) => {
								setValue("password", value); // handles browser autofill
								clearErrors("authFail");
							}}
							type={show_password ? "text" : "password"}
						/>
						<p
							className={"absolute right-[3%] top-[15%] cursor-pointer font-bold text-dark-blue"}
							onClick={() => set_show_password(!show_password)}
						>
							{show_password ? "Hide" : "Show"}
						</p>
					</div>
					{errors["password"] && <p className={styles.errorMessage}>{errors["password"].message}</p>}
				</div>
				<div className={styles.buttonRow}>
					<div className={styles.submitError}>
						<SmallButton>Continue</SmallButton>
						{errors["authFail"] && (
							<p className={styles.errorMessage} style={{ marginTop: "10px" }}>
								{errors["authFail"].message}
							</p>
						)}
					</div>
				</div>
			</form>
			<h3 className="common_bold">Don't have an account? Create one!</h3>
			<div className={styles.submitError}>
				<SmallButton
					onClick={() => {
						navigate("/account/sign_up");
						init_sign_up();
					}}
				>
					Sign Up
				</SmallButton>
			</div>
		</div>
	);
};

export default Login;
