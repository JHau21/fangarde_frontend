//Validation Functions
export const validateEmail = (input: string) => {
	const emailRegex =
		/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return emailRegex.test(input);
};

export const validateName = (input: string) => {
	const nameRegex = /^[a-zA-Z]+$/;
	return nameRegex.test(input);
};

export const validatePhone = (input: string) => {
	const nameRegex = /^(?:\+?[1-9]\d{9,10}|)$/;
	return nameRegex.test(input);
};
