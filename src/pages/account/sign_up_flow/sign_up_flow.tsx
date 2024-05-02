import { Navigate, useLocation } from "react-router-dom";

import { api } from "axiosClients/client";
import { SignUpStep, SignUpType } from "common";
import { upload_stripe_org } from "pages/account/sign_up_flow/api";
import SignUp from "pages/account/sign_up_flow/components/sign_up/sign_up";
import SignUpInfo from "pages/account/sign_up_flow/components/sign_up_info/sign_up_info";
import SignUpUser from "pages/account/sign_up_flow/components/sign_up_user/sign_up_user";
import SignUpOrg from "pages/account/sign_up_flow/components/sign_up_organization/sign_up_organization";
import SignUpDone from "pages/account/sign_up_flow/components/sign_up_done/sign_up_done";
import SignUpEventCreator from "pages/account/sign_up_flow/components/sign_up_event_creator/sign_up_event_creator";
import SignUpDisclaimer from "pages/account/sign_up_flow/components/sign_up_disclaimer/sign_up_disclaimer";
import SignUpOrgLocation from "pages/account/sign_up_flow/components/sign_up_org_location/sign_up_org_location";
import SignUpOwner from "pages/account/sign_up_flow/components/sign_up_owner/sign_up_owner/sign_up_owner";
import SignUpRepIdentity from "pages/account/sign_up_flow/components/sign_up_rep_identity/sign_up_rep_identity";
import SignUpError from "pages/account/sign_up_flow/components/sign_up_error/sign_up_error";
import SignUpOrgIdentity from "pages/account/sign_up_flow/components/sign_up_org_identity/sign_up_org_identity";
import { useUser } from "state/useUser";
import { get_current_jwt, set_current_jwt } from "utils/user";
import { use_stripe } from "state/use_stripe";
import { use_sign_up } from "state/use_sign_up";

const SignUpFlow = () => {
	let location = useLocation();

	const { new_admin, new_organization, new_owner, set_sign_up_step, sign_up_step, sign_up_type } = use_sign_up((state) => ({
		new_admin: state.new_admin,
		new_organization: state.new_organization,
		new_owner: state.new_owner,
		set_sign_up_step: state.set_sign_up_step,
		sign_up_step: state.sign_up_step,
		sign_up_type: state.sign_up_type,
	}));

	const { setJwt, setUser, setUserOrganization } = useUser((state) => ({
		setJwt: state.setJwt,
		setUser: state.setUser,
		setUserOrganization: state.setUserOrganization,
	}));

	const stripe = use_stripe((state) => state.get_stripe_instance());

	//Reroute if logged in
	const token = get_current_jwt();
	if (token) {
		return <Navigate to="/account/info" state={{ from: location }} replace />;
	}

	function onSuccess(data: any) {
		if (data.organization) {
			setUserOrganization(data.organization);
		}
		setUser(data.user);
		setJwt(data.auth);
		set_current_jwt(data.auth);
		set_sign_up_step(SignUpStep.SignUpDone);
		window.scrollTo(0, 0);
	}

	async function onSubmit(user: AdminSignUp | UserSignUp, acc_id?: string, person_ids?: Array<string>) {
		if (sign_up_type === SignUpType.EventCreator) {
			const body = {
				admin: user,
				organization: new_organization,
				acc_id: acc_id ? acc_id : undefined,
				person_ids: person_ids ? person_ids : undefined,
			};

			const res = await api.post("/register_admin", body);

			if (res.data.error) {
				set_sign_up_step(SignUpStep.Error);
			} else {
				onSuccess(res.data);
			}
		} else {
			const res = await api.post("/register_user", user);
			if (res.data.error) {
				set_sign_up_step(SignUpStep.Error);
			} else {
				onSuccess(res.data);
			}
		}
	}

	function RenderSignUpStep() {
		switch (sign_up_step) {
			case SignUpStep.SignUpInit:
				return <SignUp />;

			case SignUpStep.SignUpUser:
				if (sign_up_type === SignUpType.EventGoer) {
					return <SignUpUser onSubmit={onSubmit} />;
				}
				// sign_up_type === SignUpType.EventCreator
				return (
					<SignUpEventCreator
						paidEvents={new_organization.paid_events}
						// if we are doing paid events, then user should be routed to another page, instead of just submitting
						onSubmit={
							new_organization.paid_events
								? () => set_sign_up_step(SignUpStep.SignUpRepIdentity)
								: (user: AdminSignUp | UserSignUp) => onSubmit(user)
						}
					/>
				);

			case SignUpStep.SignUpInfo:
				return <SignUpInfo />;

			case SignUpStep.SignUpOrg:
				return <SignUpOrg />;

			case SignUpStep.SignUpDisclaimer:
				return <SignUpDisclaimer />;

			case SignUpStep.SignUpOrgLocation:
				return <SignUpOrgLocation />;

			case SignUpStep.SignUpOrgIdentity:
				return <SignUpOrgIdentity />;

			case SignUpStep.SignUpOwner:
				return <SignUpOwner />;

			case SignUpStep.SignUpRepIdentity:
				return (
					<SignUpRepIdentity
						upload_stripe_org={(user_identity: UploadRepresentative, files: Array<StripeFile>) =>
							upload_stripe_org(user_identity, files, new_owner, new_admin, new_organization, stripe)
						}
						onSubmit={({ acc_id, person_ids }: { acc_id: string; person_ids: Array<string> }) =>
							onSubmit(new_admin, acc_id, person_ids)
						}
					/>
				);

			case SignUpStep.SignUpDone:
				return <SignUpDone />;

			case SignUpStep.Error:
				return <SignUpError />;

			default:
				return <>error</>;
		}
	}

	return <RenderSignUpStep />;
};

export default SignUpFlow;
