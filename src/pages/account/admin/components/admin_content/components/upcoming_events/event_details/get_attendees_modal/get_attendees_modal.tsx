import { useState } from "react";
import Papa from "papaparse";

import CheckBox from "components/check_box";
import Dropdown from "components/dropdown";
import Modal from "../../../../../../../../../components/modal/modal";
import SmallButton from "components/small_button/small_button";

import { EmptySpreadsheetOptions, SpreadsheetMap } from "../../../../../../types/types";

type FormattedData = {
	Cost: string;
	"Email Address": string | undefined;
	"First Name": string;
	"Last Name": string;
	Purchased: string;
	Quantity: number;
	"Transaction ID": string;
};

interface SpreadsheetModalProps {
	onExit: Function;
	data: Array<Transaction>;
	event?: EventModel;
	ticket_types: TicketType[];
}

const SpreadsheetModal = ({ onExit, data, event, ticket_types }: SpreadsheetModalProps) => {
	const order_by_options = ["Transaction ID", "First Name", "Last Name", "Email Address", "Purchased", "Quantity", "Cost"];
	const [order, set_order] = useState<string>(order_by_options[0]);
	const [selected_options, set_selected_options] = useState<SpreadsheetOptions>(EmptySpreadsheetOptions);

	const HandleGenerateCSV = () => {
		let spreadsheet_rows_data: Array<FormattedData> = [];

		data.map((doc: Transaction, i) => {
			const order = doc.order;

			let single_row_data: FormattedData = {
				Cost: `$${parseFloat(doc.consumer_cost.toFixed(2))}`,
				"Email Address": doc.email,
				"First Name": doc.first_name,
				"Last Name": doc.last_name,
				Purchased: "|",
				Quantity: 0,
				"Transaction ID": doc._id,
			};

			order.map((order: OrderItem) => {
				let ticket_type = ticket_types.find((ticket_type: TicketType) => ticket_type._id === order.ticket_type_id);

				if (ticket_type !== undefined) {
					single_row_data["Quantity"] += order.quantity;
					single_row_data["Purchased"] += order.quantity + "x " + order.ticket_name + " | ";
				}

				return order;
			});

			spreadsheet_rows_data.push(single_row_data);

			return doc;
		});

		const sorted_spreadsheet_rows_data = spreadsheet_rows_data.sort((a: any, b: any) => {
			if (SpreadsheetMap[order] === "email") {
				if (a.email === undefined) {
					return 1; // undefined email is considered greater than defined email
				} else if (b.email === undefined) {
					return -1; // defined email is considered smaller than undefined email
				}
			}
			if (SpreadsheetMap[order] === "cost") {
				if (Number(a[SpreadsheetMap[order]].replace("$ ", "")) < Number(b[SpreadsheetMap[order]].replace("$ ", ""))) {
					return -1;
				} else {
					return 1;
				}
			}
			if (a[SpreadsheetMap[order]] < b[SpreadsheetMap[order]]) {
				return -1;
			} else if (a[SpreadsheetMap[order]] > b[SpreadsheetMap[order]]) {
				return 1;
			}
			return 0;
		});

		const filtered_fields: Array<string> = Object.keys(selected_options).filter((key) => selected_options[key]);
		const formattedData: Array<FormattedData> = sorted_spreadsheet_rows_data.map((item: any) => {
			let formatted_item: any = {};

			for (let field of filtered_fields) {
				formatted_item[field] = item[field];
			}

			return formatted_item;
		});

		const csv = Papa.unparse(formattedData);

		const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

		const url = URL.createObjectURL(blob);

		const link = document.createElement("a");
		link.setAttribute("href", url);
		const now = new Date().toLocaleString();
		link.setAttribute("download", `${event?.name} Attendee List - ${now}.csv`);
		link.click();
	};

	return (
		<Modal onExit={() => onExit()}>
			<div className={"flex w-[500px] flex-col items-start px-8 font-custom text-regular text-fangarde-black"}>
				<h1 className={"my-[15px]"}>Attendee Information</h1>
				<div className={"my-[15px] flex flex w-full flex-row flex-col items-start justify-between hover:cursor-pointer"}>
					<h3 className={"mb-[10px]"}>Transaction Order:</h3>
					<Dropdown
						options={order_by_options}
						renderOption={(option: any, index: number) => {
							return (
								<option value={option} key={index}>
									{option}
								</option>
							);
						}}
						onChange={(value: string) => set_order(value)}
					/>
				</div>
				<p className={"my-[15px] w-full"}>
					What do you want to include in the Spreadsheet? Selected and de-select options below.
				</p>
				<div className={"flex w-full flex-col items-center justify-between"}>
					<div className={"my-[10px] flex w-full flex-row items-center"}>
						<div className={"w-1/3"}>
							<CheckBox
								label={"Transaction ID"}
								checked={selected_options["Transaction ID"]}
								onClick={(value: boolean) =>
									set_selected_options({
										...selected_options,
										"Transaction ID": !selected_options["Transaction ID"],
									})
								}
							/>
						</div>
						<div className={"w-1/3"}>
							<CheckBox
								label={"First Name"}
								checked={selected_options["First Name"]}
								onClick={(value: boolean) =>
									set_selected_options({
										...selected_options,
										"First Name": !selected_options["First Name"],
									})
								}
							/>
						</div>
						<div className={"w-1/3"}>
							<CheckBox
								label={"Last Name"}
								checked={selected_options["Last Name"]}
								onClick={(value: boolean) =>
									set_selected_options({
										...selected_options,
										"Last Name": !selected_options["Last Name"],
									})
								}
							/>
						</div>
					</div>
					<div className={"my-[10px] flex w-full flex-row items-center justify-between"}>
						<div className={"w-1/3"}>
							<CheckBox
								label={"Email Address"}
								checked={selected_options["Email Address"]}
								onClick={(value: boolean) =>
									set_selected_options({
										...selected_options,
										"Email Address": !selected_options["Email Address"],
									})
								}
							/>
						</div>
						<div className={"w-1/3"}>
							<CheckBox
								label={"Purchased"}
								checked={selected_options["Purchased"]}
								onClick={(value: boolean) =>
									set_selected_options({
										...selected_options,
										Purchased: !selected_options["Purchased"],
									})
								}
							/>
						</div>
						<div className={"w-1/3"}>
							<CheckBox
								label={"Cost"}
								checked={selected_options["Cost"]}
								onClick={(value: boolean) =>
									set_selected_options({
										...selected_options,
										Cost: !selected_options["Cost"],
									})
								}
							/>
						</div>
					</div>
					<div className={"my-[10px] flex w-full flex-row items-center justify-between"}>
						<div className={"w-1/3"}>
							<CheckBox
								label={"Quantity"}
								checked={selected_options["Quantity"]}
								onClick={(value: boolean) =>
									set_selected_options({
										...selected_options,
										Quantity: !selected_options["Quantity"],
									})
								}
							/>
						</div>
					</div>
					<div className={"my-[15px]"}>
						<SmallButton
							onClick={() => {
								HandleGenerateCSV();
							}}
						>
							Download List
						</SmallButton>
					</div>
				</div>
			</div>
		</Modal>
	);
};

export default SpreadsheetModal;
