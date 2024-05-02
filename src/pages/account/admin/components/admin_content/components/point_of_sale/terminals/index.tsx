import { useState } from "react";

import AddTerminalModal from "./add_terminal_flow";
import TerminalCard from "./terminal_card";

import { useUser, UseUserState } from "state/useUser";

import { add_terminal, remove_terminal, update_terminal } from "./utils";

import { DeleteTerminalRequest, NewTerminalRequest, UpdateTerminalRequest } from "./types";

import AddButton from "common/icons/add_button.svg";
import ErrorMessage from "components/error_message";
import EditTerminalModal from "./edit_terminal_flow";

const CardReaders = () => {
	const { user_organization, set_user_organization } = useUser((state: UseUserState) => ({
		user_organization: state.userOrganization,
		set_user_organization: state.setUserOrganization,
	}));

	const [add, set_add] = useState<boolean>(false);
	const [edit_terminal, set_edit_terminal] = useState<Terminal | undefined>(undefined);
	const [success, set_success] = useState<boolean>(false);
	const [terminals, set_terminals] = useState<Array<Terminal>>(user_organization?.terminals ?? []);
	const [add_edit_error, set_add_edit_error] = useState<string | undefined>(undefined);
	const [remove_error, set_remove_error] = useState<string | undefined>(undefined);

	const handle_add = async (registration_code: string, name: string) => {
		if (add_edit_error) set_add_edit_error(undefined);

		const { location_id, _id } = user_organization;

		const body: NewTerminalRequest = {
			registration_code: registration_code,
			label: name,
			location_id: location_id,
			org_id: _id,
		};

		const { success, new_terminal, message } = await add_terminal(body);

		if (success && new_terminal) {
			let terminals: Array<Terminal> = new Array(...user_organization.terminals);

			terminals.push(new_terminal);

			set_terminals(terminals);

			set_user_organization({
				...user_organization,
				terminals: terminals,
			});
		} else set_add_edit_error(message);

		set_success(success);
	};

	const handle_delete = async (id: string) => {
		if (remove_error) set_remove_error(undefined);

		const { _id } = user_organization;

		const body: DeleteTerminalRequest = {
			terminal_id: id,
			org_id: _id,
		};

		const { success, message } = await remove_terminal(body);

		if (success) {
			let terminals: Array<Terminal> = new Array(...user_organization.terminals);

			terminals = terminals.filter(({ terminal_id }: Terminal) => terminal_id !== id);

			set_terminals(terminals);

			set_user_organization({
				...user_organization,
				terminals: terminals,
			});
		} else set_remove_error(message);
	};

	const handle_edit = async (name: string) => {
		if (add_edit_error) set_add_edit_error(undefined);

		if (edit_terminal) {
			const { _id } = user_organization;
			const { terminal_id } = edit_terminal;

			const body: UpdateTerminalRequest = {
				label: name,
				terminal_id: terminal_id,
				org_id: _id,
			};

			const { success, message } = await update_terminal(body);

			if (success) {
				let terminals: Array<Terminal> = new Array(...user_organization.terminals);

				terminals = terminals.map((terminal: Terminal) => {
					const { terminal_id } = terminal;

					if (terminal_id === edit_terminal.terminal_id) {
						return {
							...terminal,
							name: name,
						};
					} else {
						return terminal;
					}
				});

				set_terminals(terminals);

				set_user_organization({
					...user_organization,
					terminals: terminals,
				});
			} else set_add_edit_error(message);

			set_success(success);
		} else {
			set_add_edit_error("Something went wrong!");
		}
	};

	return (
		<div className={"flex flex-col items-start font-custom text-regular font-medium text-fangarde-black"}>
			<h1 className={"m-0 mb-[10px] text-lg-header"}>Card Readers</h1>
			<div className={"flex h-full w-full flex-col items-start"}>
				<div className={" flex h-[45px] w-full flex-row items-start justify-between"}>
					<h2 className={"m-0 text-md-header"}>Your Reader(s)</h2>
					<img
						className={"h-[35px] w-[35px] hover:cursor-pointer"}
						alt="Add Icon"
						src={AddButton}
						onClick={() => {
							if (success) set_success(false);

							set_add(true);
						}}
					/>
				</div>
				<div className={"flex w-full flex-col items-start"}>
					{terminals && terminals.length ? (
						terminals.map((terminal: Terminal) => {
							const { name, terminal_id } = terminal;

							return (
								<TerminalCard
									name={name}
									terminal_id={terminal_id}
									on_delete={(id: string) => handle_delete(id)}
									on_edit={() => {
										if (success) set_success(false);

										set_edit_terminal(terminal);
									}}
								/>
							);
						})
					) : (
						<p className={"text-sm-header font-bold"}>
							You haven't added any terminals yet! Use the plus button above to add some.
						</p>
					)}
				</div>
				{remove_error && <ErrorMessage message={remove_error} />}
			</div>
			{add && (
				<AddTerminalModal
					success={success}
					warning={add_edit_error}
					on_add={({ registration_code, name }: { registration_code: string; name: string }) =>
						handle_add(registration_code, name)
					}
					on_exit={() => set_add(false)}
				/>
			)}
			{edit_terminal && (
				<EditTerminalModal
					terminal={edit_terminal}
					success={success}
					warning={add_edit_error}
					on_edit={(name: string) => handle_edit(name)}
					on_exit={() => set_edit_terminal(undefined)}
				/>
			)}
		</div>
	);
};

export default CardReaders;
