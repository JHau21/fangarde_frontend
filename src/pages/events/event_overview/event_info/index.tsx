import React from "react";

import EventOverviewText from "./header_and_text";

import { format_date, format_time } from "./utils";
import { format_address } from "utils/common_methods";

import color_palette from "common/types/colors";

type Props = {
	primary_color?: string;
	selected_event?: EventCreate;
};

const EventInfo: React.FC<Props> = ({ primary_color, selected_event }) => {
	if (!selected_event) {
		return null;
	}

	return (
		<div
			className={
				"flex w-full max-w-[300px] flex-col justify-evenly p-2 text-left font-custom text-regular font-normal text-fangarde-black md:ml-4 md:w-1/2 md:max-w-[800px]"
			}
		>
			<h1 className="mb-4 truncate text-center text-lg-header font-semibold md:text-left">{selected_event?.name}</h1>
			<p className={"m-0 mb-[10px] w-full truncate p-0 text-sm-header font-bold"} style={{ color: color_palette.gray }}>
				{selected_event.subtitle}
			</p>
			<p className={"m-0 mb-[10px] w-full truncate p-0 text-sm-header"} style={{ color: color_palette.gray }}>
				@{selected_event.location.name}
			</p>
			<EventOverviewText header={"Date"} header_color={primary_color} text={format_date(selected_event.event_start_time)} />
			<EventOverviewText header={"Time"} header_color={primary_color} text={format_time(selected_event.event_start_time)} />
			<EventOverviewText
				header={"Address"}
				header_color={primary_color}
				text={format_address(selected_event.location.address)}
			/>
			<EventOverviewText
				header={"Extra Instructions"}
				header_color={primary_color}
				text={selected_event.extra_info ?? "None"}
			/>
			<EventOverviewText
				header={"Description"}
				header_color={primary_color}
				text={selected_event.description ?? "None"}
				wrap={true}
			/>
		</div>
	);
};

export default EventInfo;
