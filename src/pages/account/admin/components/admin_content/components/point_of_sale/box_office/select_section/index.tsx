import Dropdown from "components/dropdown";

import { useUser, UseUserState } from "state/useUser";

import { format_date } from "../../../finance/books_page/books";

type Props = {
	all_events: Array<EventCreate>;
	on_set_terminal: Function;
	on_set_event: Function;
};

const SelectSection = ({ all_events, on_set_terminal, on_set_event }: Props) => {
	const user_organization = useUser((state: UseUserState) => state.userOrganization);

	const { terminals } = user_organization;

	const terminal_options: Array<Terminal | string> = ["None"].concat(terminals ?? []);
	return (
		<div className={"my-[20px] flex flex-row items-center justify-between"}>
			<div className={"flex w-[48%] flex-col items-start"}>
				<h3 className={"m-0 my-[10px] text-sm-header"}>Card Reader:</h3>
				<Dropdown
					options={terminal_options}
					onChange={(value: number) => on_set_terminal(value)}
					renderOption={(option: Terminal | string, index: any) => {
						if (typeof option === "string") {
							return (
								<option value={-1} key={-1}>
									{option}
								</option>
							);
						} else {
							const { name, terminal_id, registration_code } = option;

							return (
								<option value={index - 1} key={index - 1}>
									{name + " - " + registration_code + " - " + terminal_id}
								</option>
							);
						}
					}}
				/>
			</div>
			<div className={"flex w-[48%] flex-col items-start"}>
				<h3 className={"m-0 my-[10px] text-sm-header"}>Event:</h3>
				<Dropdown
					options={all_events}
					onChange={(value: number) => on_set_event(value)}
					renderOption={(option: EventCreate, index: any) => {
						return (
							<option value={index} key={option + index}>
								{option.name + " / " + option.location.name + " / " + format_date(option.event_start_time)}
							</option>
						);
					}}
				/>
			</div>
		</div>
	);
};
export default SelectSection;
