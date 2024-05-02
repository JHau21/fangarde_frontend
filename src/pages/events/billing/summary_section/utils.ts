import { api } from "axiosClients/client";

import { error_handler } from "utils/api_error_handles";

import { PromoCodePayload } from "./types";

export const handle_promo_verification = async (
	payload: PromoCodePayload
): Promise<{ success: boolean; message: string; promo_code_doc: PromoCode | undefined }> => {
	try {
		const response = await api.post("/verify_promo_code", payload);

		const { status } = response;

		if (status === 200) {
			const { promo_code_doc } = response.data;

			return { success: true, message: "Successfully applied promo code!", promo_code_doc: promo_code_doc };
		} else {
			return { success: false, message: "Something unexpected occurred!", promo_code_doc: undefined };
		}
	} catch (err) {
		return { ...error_handler(err), promo_code_doc: undefined };
	}
};
