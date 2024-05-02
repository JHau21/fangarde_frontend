import { SignUpStep, SignUpType } from "common";
import { emptyOrganizationSignUp, emptyOwner, emptyRootAdminSignUp, emptyUserSignUp } from "pages/account/sign_up_flow/types/types";
import { create } from "zustand";

type UseSignUpState = {
	new_admin: AdminSignUp;
	new_organization: OrganizationSignUp;
	new_owner: Owner;
	new_user: UserSignUp;
	sign_up_step?: SignUpStep;
	sign_up_type?: SignUpType;

	init: () => void;
	set_new_admin: (new_admin: AdminSignUp) => void;
	set_new_organization: (new_organization: OrganizationSignUp) => void;
	set_new_owner: (new_owner: Owner) => void;
	set_new_user: (new_user: UserSignUp) => void;
	set_sign_up_step: (sign_up_step: SignUpStep) => void;
	set_sign_up_type: (sign_up_type: SignUpType) => void;
	teardown: () => void;
	update_new_organization: (newValue: any) => void;
};

const defaultState = {
	new_admin: emptyRootAdminSignUp,
	new_owner: emptyOwner,
	new_organization: emptyOrganizationSignUp,
	new_user: emptyUserSignUp,
	sign_up_step: SignUpStep.SignUpInit,
	sign_up_type: SignUpType.None,
};

export const use_sign_up = create<UseSignUpState>((set, get) => ({
	...defaultState,

	init: () => {
		window.scrollTo(0, 0);
		set(defaultState);
	},
	set_new_admin: (new_admin: AdminSignUp) => set({ new_admin }),
	set_new_organization: (new_organization) => set({ new_organization }),
	set_new_owner: (new_owner) => set({ new_owner }),
	set_new_user: (new_user) => set({ new_user }),
	set_sign_up_step: (sign_up_step) => {
		window.scrollTo(0, 0);
		set({ sign_up_step });
	},
	set_sign_up_type: (sign_up_type) => set({ sign_up_type }),

	update_new_organization: (newValue) => set({ ...get().new_organization, ...newValue }),

	teardown: () => set(defaultState),
}));
