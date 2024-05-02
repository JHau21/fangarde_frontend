import { TransactionType } from "common";

export type CashOrFreeRequest = {
	transaction_type: TransactionType;
	event_id: string;
	org_id: string;
	order: Array<SelectedTicket>;
};

export type CardRequest = {
	transaction_type: TransactionType;
	event_id: string;
	org_id: string;
	order: Array<SelectedTicket>;
	payment_intent_id: string;
};
