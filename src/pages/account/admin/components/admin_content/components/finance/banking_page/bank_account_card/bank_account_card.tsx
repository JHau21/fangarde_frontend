import bank_account_icon from "../../../../../../../../../common/icons/bank_account_icon.svg";

type Props = {
	bank_account: BankAccount;
	num_bank_accounts: number;
	payout_destination: boolean;
	onDelete: Function;
};

const BankAccountCard = ({ bank_account, num_bank_accounts, payout_destination, onDelete }: Props) => {
	return (
		<div
			className={
				"mt-[10px] flex h-[88px] w-full flex-row items-center justify-between rounded-xl border-2 border-medium-blue p-[5px] text-left font-custom text-regular font-normal text-fangarde-black"
			}
		>
			<div className={"flex h-full w-[35vw] flex-row items-start"}>
				<img src={bank_account_icon} alt={"Bank Account Icon"} className={"h-[70px] w-[70px]"} />
				<div className={"ml-[10px] flex h-full w-full flex-col items-start justify-evenly"}>
					<p className={"text-ellipsis font-bold"}>{bank_account.bank_name}</p>
					<p className={"text-ellipsis"}>{bank_account.account_type ? bank_account.account_type : "Bank Account"}</p>
					<p className={"text-ellipsis"}>{"********" + bank_account.last4}</p>
				</div>
			</div>
			<div className={"relative mr-[5px] flex h-full w-[11vw] flex-row items-end justify-between font-bold"}>
				{payout_destination && (
					<p className={"absolute right-0 top-0 w-full text-right text-dark-blue"}>Payout Destination</p>
				)}
				{num_bank_accounts === 1 ? (
					<></>
				) : (
					<p
						className={
							"w-full text-right font-bold text-fangarde-light-red hover:cursor-pointer hover:text-fangarde-dark-red active:text-fangarde-medium-red"
						}
						onClick={() => {
							onDelete(bank_account.id);
						}}
					>
						Remove
					</p>
				)}
			</div>
		</div>
	);
};

export default BankAccountCard;
