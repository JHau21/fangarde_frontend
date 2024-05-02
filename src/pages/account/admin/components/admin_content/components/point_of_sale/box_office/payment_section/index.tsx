import BillingSummaryBox from "components/billing_summary_components/billing_summary_box";
import SmallButton from "components/small_button/small_button";

import color_palette from "common/types/colors";

import { TransactionType } from "common";

type Props = {
	selected_tickets: Array<SelectedTicket>;
	transaction_type: TransactionType;
	set_transaction_type: Function;
	card_disabled: boolean;
};

const PaymentType = ({ selected_tickets, transaction_type, set_transaction_type, card_disabled }: Props) => {
	return (
		<div className={"my-[20px] flex flex-row items-start justify-between rounded-md border-2 border-medium-blue p-4"}>
			<div className={"flex w-[40%] flex-col items-start"}>
				<h2 className={"m-0 mb-[10px] text-md-header"}>Payment</h2>
				<div className={"flex h-[150px] flex-col items-start justify-between"}>
					<SmallButton
						selected={transaction_type === TransactionType.Card}
						disabled={card_disabled}
						active_color={color_palette.dark_blue}
						onClick={() => set_transaction_type(TransactionType.Card)}
					>
						Card
					</SmallButton>
					<SmallButton
						selected={transaction_type === TransactionType.Cash}
						active_color={color_palette.dark_blue}
						onClick={() => set_transaction_type(TransactionType.Cash)}
					>
						Cash
					</SmallButton>
					<SmallButton
						selected={transaction_type === TransactionType.Free}
						active_color={color_palette.dark_blue}
						onClick={() => set_transaction_type(TransactionType.Free)}
					>
						In Kind
					</SmallButton>
				</div>
			</div>
			<div className={"w-[60%]"}>
				<BillingSummaryBox
					selected_tickets={selected_tickets}
					donation_amount={0}
					promo_discount={undefined}
					transaction_type={transaction_type}
				/>
			</div>
		</div>
	);
};

export default PaymentType;
