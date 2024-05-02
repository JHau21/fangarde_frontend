import axios, { AxiosInstance } from "axios";
import config from "config/index";
import { get_current_jwt } from "utils/user";

export const api: AxiosInstance = axios.create({
	baseURL: config.api_gateway,
	headers: {
		"Content-Type": "application/json",
	},
});

api.interceptors.request.use(
	(config) => {
		const token = get_current_jwt();

		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}

		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

api.interceptors.response.use(
	(response) => {
		// one day we'll be cool enough to put handling here... one day...
		return response;
	},
	(error) => {
		// too bad we're not cool enough yet :(
		throw error;
	}
);
