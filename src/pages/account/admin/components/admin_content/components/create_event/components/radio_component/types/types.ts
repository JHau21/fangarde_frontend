export interface RadioOptions {
	value: string | number | readonly string[] | boolean;
	id: string;
	checked: boolean;
	handleChange: Function;
	label: string;
}
