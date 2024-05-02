import { StateCreator, create } from "zustand";
import { PersistOptions, createJSONStorage, persist } from "zustand/middleware";

export interface UseAccountingState {
	accounting_events: undefined | Array<EventCreate>;
	selected_accounting_event: undefined | SelectedEvent;
	bank_accounts: undefined | Array<BankAccount>;
	payouts_schedule: undefined | PayoutObject;
	statement_interval: undefined | AccountingStatement;

	set_accounting_events: (accounting_events: undefined | Array<EventCreate>) => void;
	set_selected_accounting_event: (selected_accounting_event: undefined | SelectedEvent) => void;
	set_bank_accounts: (bank_accounts: undefined | Array<BankAccount>) => void;
	set_payout_settings: (payouts_schedule: undefined | PayoutObject) => void;
	set_statement_interval: (statement_interval: undefined | AccountingStatement) => void;
	reset: () => void;
}

type UseAccountingStatePersist = (
	config: StateCreator<UseAccountingState>,
	options: PersistOptions<UseAccountingState>
) => StateCreator<UseAccountingState>;

const intialState = {
	accounting_events: undefined,
	selected_accounting_event: undefined,
	bank_accounts: undefined,
	payouts_schedule: undefined,
	statement_interval: undefined,
};

export const use_accounting = create<UseAccountingState>(
	(persist as UseAccountingStatePersist)(
		(set) => ({
			...intialState,
			set_accounting_events: (accounting_events: undefined | Array<EventCreate>) => set({ accounting_events }),
			set_selected_accounting_event: (selected_accounting_event: undefined | SelectedEvent) =>
				set({ selected_accounting_event }),
			set_bank_accounts: (bank_accounts: undefined | Array<BankAccount>) => set({ bank_accounts }),
			set_payout_settings: (payouts_schedule: undefined | PayoutObject) => set({ payouts_schedule }),
			set_statement_interval: (statement_interval: undefined | AccountingStatement) => set({ statement_interval }),
			reset: () => set(intialState),
		}),
		{
			name: "accounting",
			storage: createJSONStorage(() => sessionStorage),
		}
	)
);
