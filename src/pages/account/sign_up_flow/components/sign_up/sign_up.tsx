import { useNavigate } from "react-router-dom";

import SmallButton from "components/small_button/small_button";

import { use_sign_up } from "state/use_sign_up";

import styles from "./sign_up.module.css";

import { SignUpStep, SignUpType } from "common";

const SignUp = () => {
	const { set_sign_up_step, set_sign_up_type } = use_sign_up((state) => ({
		set_sign_up_step: state.set_sign_up_step,
		set_sign_up_type: state.set_sign_up_type,
	}));

	const navigate = useNavigate();

	return (
		<div className="mx-36 my-5 flex flex-col items-center font-custom">
			<div className={styles.column}>
				<div className="mx-36 my-5 flex flex-col items-center">
					<h1 className="font-bold">Welcome!</h1>
					<p className="font-normal">
						Whether you’re an organization coordinating and hosting an event or a just an event goer, we have something
						for you!
					</p>
				</div>
				<div className="mx-36 my-5 flex flex-col items-center">
					<h1 className="font-bold">Event Goer</h1>
					<p className="font-normal">
						If you’re an event goer, signing up is simple! Just use the “Sign Up” button below and fill out some
						authentication information then you’ll be good to go!
					</p>
					<div className="mx-36 mt-5 flex flex-col items-center">
						<SmallButton
							onClick={() => {
								set_sign_up_type(SignUpType.EventGoer);
								set_sign_up_step(SignUpStep.SignUpUser);
							}}
						>
							Sign Up
						</SmallButton>
					</div>
				</div>
				<div className="mx-36 my-5 flex flex-col items-center">
					<h1 className="font-bold">Event Creator</h1>
					<p className="font-normal">
						If you’re an event creator, we’d love the opportunity to talk to you first! As such, we don’t include any
						sign-up flow for event creators. Instead, we’ll get to know you, implement new features on your behalf, and
						then create an entire account for you! Once everything is finished, we’ll provide you with your login
						credentials and set you up for your first event with us! To get in contact with us and use our platform, send
						a message to
						<a className="text-medium-blue" href="mailto:david@fangarde.com">
							{" "}
							david@fangarde.com{" "}
						</a>
						and express your interest!
					</p>
				</div>
				<div className="mx-36 my-5 flex flex-col items-center">
					<h1 className="font-bold">Questions?</h1>
					<p className="font-normal">Unsure about anything? Reach out to us!</p>
					<div className="mx-36 mt-5 flex flex-col items-center">
						<SmallButton onClick={() => navigate("/contact")}>Contact</SmallButton>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SignUp;
