import { api } from "axiosClients/client";

import { error_handler } from "utils/api_error_handles";

import { OrderPayload } from "./types";

export const handle_order = async (payload: OrderPayload): Promise<{ success: boolean; message: string }> => {
	try {
		const response = await api.post("/online_sale", payload);

		const { status } = response;

		if (status === 201) {
			return { success: true, message: "Successfully purchased tickets!" };
		} else {
			return { success: false, message: "Something unexpected occurred!" };
		}
	} catch (err) {
		return error_handler(err);
	}
};
