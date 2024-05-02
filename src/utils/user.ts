import Cookies from "universal-cookie";

const cookies = new Cookies();

export function get_current_jwt(): string | null {
	const token = localStorage.getItem("jwtToken") as string;

	if (token) {
		set_current_jwt(token);
		localStorage.removeItem("jwtToken");
		return token;
	}

	return cookies.get("jwtToken");
}

export function set_current_jwt(jwt: string): void {
	cookies.set("jwtToken", jwt, { path: "/" });
}

export function remove_current_jwt(): void {
	cookies.remove("jwtToken", { path: "/" });
}
