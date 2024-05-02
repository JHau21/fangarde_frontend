import { useState } from "react";

import { api } from "axiosClients/client";

function ExportPdf({
	selected_accounting_event_option,
	transaction,
}: {
	selected_accounting_event_option: SelectedEvent;
	transaction: Transaction;
}) {
	const [load, set_load] = useState<boolean>(false);
	const [error, set_error] = useState<boolean>(false);
	const [downloadUrl, setDownloadUrl] = useState<any>(undefined);

	const fetch_pdf = async () => {
		api({
			url: "/get_ticket_pdf",
			method: "POST",
			responseType: "blob",
			data: {
				selected_option: selected_accounting_event_option,
				transaction_id: transaction._id,
			},
		})
			.then((res) => {
				if (res.status === 200) {
					set_load(false);
					set_error(false);
					const blob = new Blob([res.data], { type: "application/pdf" });
					const url = URL.createObjectURL(blob);
					window.open(url);

					setDownloadUrl(url);
				} else {
					set_error(true);
					set_load(false);
				}
			})
			.catch((err) => {
				set_error(true);
				set_load(false);
			});
	};

	return (
		<>
			{downloadUrl && !error ? (
				<a
					className={
						"m-0 h-full w-full font-custom text-regular font-bold text-medium-blue no-underline hover:cursor-pointer hover:text-dark-blue active:text-light-blue"
					}
					href={downloadUrl}
					download={`ticket_${transaction._id}.pdf`}
				>
					Download PDF
				</a>
			) : (
				<p
					className={
						"m-0 h-full w-full font-custom text-regular font-bold text-medium-blue no-underline hover:cursor-pointer hover:text-dark-blue active:text-light-blue"
					}
					onClick={() => {
						if (!load) {
							set_load(true);
							fetch_pdf();
						}
					}}
				>
					{load ? "Loading document..." : "Download PDF"}
				</p>
			)}
		</>
	);
}

export default ExportPdf;
