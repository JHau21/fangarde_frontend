import { api } from "axiosClients/client";
import { Filters } from "../../types/types";

export async function search_events(filters: Filters, order: number, collection: string, onSuccess: Function, onError: Function) {
	const res = await api.post("/search_events", {
		filters,
		order,
		collection,
	});

	if (res.status === 200) {
		if (res.data.error) {
			//Handle Error
			onError(res.data);
		} else {
			//Handle Success
			onSuccess(res.data);
		}
	}
}
