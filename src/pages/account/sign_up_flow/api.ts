import { Stripe } from "@stripe/stripe-js";
import { api } from "axiosClients/client";
import { emptyOwner } from "pages/account/sign_up_flow/types/types";
import { use_stripe } from "state/use_stripe";

// no need to look at this function, just go look somewhere else
export const upload_stripe_org = async (
	user_identity: UploadRepresentative,
	files: Array<StripeFile>,
	newOwner: Owner,
	newAdmin: AdminSignUp,
	newOrganization: OrganizationSignUp,
	stripe: Stripe
) => {
	let owner_token: any | undefined = undefined;

	// create Stripe files
	let res = await api.post("/create_stripe_files", {
		files,
	});

	const payload = res.data.payload;

	if (payload) {
		const { file_ids } = payload;

		const rep_token = await stripe.createToken("person", {
			person: {
				...user_identity,
				first_name: newAdmin.first_name,
				last_name: newAdmin.last_name,
				maiden_name: newAdmin.last_name,
				email: newAdmin.email,
				phone: newAdmin.phone_number,
				relationship: {
					director: false,
					executive: true,
					owner: true,
					representative: true,
					title: "Event Coordinator",
				},
				verification: {
					document: {
						back: file_ids.back_id,
						front: file_ids.front_id,
					},
				},
			},
		} as any);

		if (!rep_token || !rep_token.token) {
			return {
				message: "Failed to create Stripe connected account representative.",
			};
		}

		// if an owner is provided then we need to generate a token for that, too
		if (newOwner !== emptyOwner) {
			owner_token = await stripe.createToken("person", {
				person: {
					...newOwner,
					relationship: {
						director: false,
						executive: true,
						owner: true,
						representative: false,
						title: "Owner",
					},
				},
			} as any);

			if (!owner_token || !owner_token.token) {
				return {
					message: "Failed to create Stripe connected account owner.",
				};
			}
		}

		const company_phone_number: string | undefined =
			newAdmin.phone_number === "" ? (newOwner.phone === "" ? undefined : newOwner.phone) : newAdmin.phone_number;

		const organization_token = await stripe.createToken("account", {
			business_type: newOrganization.business_type,
			company: {
				...newOrganization.company,
				phone: company_phone_number,
				name: newOrganization.name,
				executives_provided: true,
				directors_provided: false,
				owners_provided: owner_token ? true : false,
			},
			tos_acceptance: {
				...newOrganization.tos_acceptance,
			},
			tos_shown_and_accepted: true,
		} as any);

		if (!organization_token || !organization_token.token) {
			return {
				message: "Failed to create Stripe connected account.",
			};
		}

		res = await api.post("/create_customer_stripe_account", {
			rep_token: rep_token.token.id,
			owner_token: owner_token ? owner_token.token.id : undefined,
			organization_token: organization_token.token.id,
			remaining_org_info: {
				mcc: newOrganization.mcc,
				url: newOrganization.url,
			},
			tax_id: newOrganization?.company?.tax_id,
		});
		if (res.data.error) {
			return res.data.error;
		} else {
			const acc_id = res.data.payload.acc_id;
			const person_ids = res.data.payload.person_ids;

			return { acc_id: acc_id, person_ids };
		}

		return res;
	} else {
		const { error } = res.data;
		return error;
	}
};
