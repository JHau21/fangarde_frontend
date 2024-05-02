import { DonationType, TransactionType } from "common";

export type CalculationsInput = {
	selected_tickets: any[];
	donation_amount: number;
	donation_type?: DonationType;
	promo_discount: number | undefined;
	transaction_type?: TransactionType;
};

export type CalculationsOutput = {
	ticket_items: Array<JSX.Element>;
	service_fee: number;
	processing_fee: number;
	order_total_w_fees: number;
	donation_total: number;
};
