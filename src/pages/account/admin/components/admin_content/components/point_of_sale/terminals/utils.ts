import { api } from "axiosClients/client";

import { error_handler } from "utils/api_error_handles";

import { NewTerminalRequest, DeleteTerminalRequest, UpdateTerminalRequest } from "./types";

export const add_terminal = async (
	params: NewTerminalRequest
): Promise<{ success: boolean; message: string; new_terminal: Terminal | undefined }> => {
	try {
		const response = await api.post("/create_new_terminal", params);

		const { new_terminal } = response.data;

		if (new_terminal && new_terminal.id) {
			return { success: true, new_terminal: new_terminal, message: "Successfully added new terminal!" };
		} else {
			return {
				success: false,
				message: "Something unexpected occurred!",
				new_terminal: undefined,
			};
		}
	} catch (err) {
		return { ...error_handler(err), new_terminal: undefined };
	}
};

export const remove_terminal = async (params: DeleteTerminalRequest): Promise<{ success: boolean; message: string }> => {
	try {
		await api.post("/delete_existing_terminal", params);

		return { success: true, message: "Successfully deleted terminal!" };
	} catch (err) {
		return error_handler(err);
	}
};

export const update_terminal = async (params: UpdateTerminalRequest): Promise<{ success: boolean; message: string }> => {
	try {
		await api.post("/update_existing_terminal", params);

		return { success: true, message: "Successfully updated terminal!" };
	} catch (err) {
		return error_handler(err);
	}
};
