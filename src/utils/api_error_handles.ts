export const error_handler = (err: any) => {
	if (err.response) {
		const { response } = err;
		const { status } = err.response;

		let message: string = `Server returned: ${response?.data?.message ?? "no message!"}`;

		switch (status) {
			case 400: {
				return {
					success: false,
					message: `Invalid request body sent by the client. ${message}`,
				};
			}
			case 404: {
				return {
					success: false,
					message: `Failed to find a requested resource due to a client mistake. ${message}`,
				};
			}
			case 502: {
				return {
					success: false,
					message: `The server received an invalid response from a required resource. ${message}`,
				};
			}
			case 503: {
				return {
					success: false,
					message: `A requested service, resource, or device is unavailable at this time. ${message}`,
				};
			}
			case 504: {
				return {
					success: false,
					message: `The server failed to connect to a required resource before timing out. ${message}`,
				};
			}
			case 500: {
				return {
					success: false,
					message: `One of the server's resources failed to fulfill a request. ${message}`,
				};
			}
			default: {
				return {
					success: false,
					message: `An unhandled error occured on the server. ${message}`,
				};
			}
		}
	} else {
		console.error(err);

		return {
			success: false,
			message: "No response was sent by the server!",
		};
	}
};
