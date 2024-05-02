export type DeleteTerminalRequest = {
	terminal_id: string;
	org_id: string;
};

export type NewTerminalRequest = {
	registration_code: string;
	label: string;
	location_id: string;
	org_id: string;
};

export type UpdateTerminalRequest = {
	label: string;
	terminal_id: string;
	org_id: string;
};
