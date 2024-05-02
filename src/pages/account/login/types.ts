export interface UserLogin {
	email: string;
	password: string;
}

export const EmptyUserLogin: UserLogin = {
	email: "",
	password: "",
};

export const InitialUserError: UserLogin = {
	email: "Email cannot be empty!",
	password: "Password cannot be empty!",
};
