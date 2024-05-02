import { Filters } from "../types";

export const default_filters: Filters = {
	search: "",
	high_price: -1,
	low_price: -1,
};

export const default_price_filters: Array<number> = [0, 1, 5, 10, 15, 20, 25, 35, 45, 55, 65, 75, 85, 100, 200, 300, 400, 500];
