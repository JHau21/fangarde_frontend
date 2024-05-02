import React from "react";

import { format_time, format_date_location } from "./utils";

type Props = {
	event_date: any;
	event_name: string;
	event_image: any;
	event_location: EventLocation;
	onClick: Function;
	event_subtitle?: string;
};

const EventCard: React.FC<Props> = ({ event_date, event_name, event_image, event_location, onClick, event_subtitle }) => {
	return (
		<div className={"m-0 flex h-[415px] w-[350px] flex-col items-start font-custom text-regular text-fangarde-black"}>
			<p className={"m-0 inline h-[25px] w-full truncate whitespace-nowrap font-bold text-dark-blue"}>
				{format_time(event_date)}
			</p>
			<div
				className="flex cursor-pointer items-center justify-center self-center overflow-hidden rounded-lg bg-[#808080] md:h-[270px] md:w-[350px]"
				onClick={() => onClick()}
			>
				<img src={event_image} alt="Event Pic" className=" cursor-pointer md:w-[350px]" onClick={() => onClick()} />
			</div>
			<p className={"m-0 inline h-[25px] w-full truncate whitespace-nowrap font-bold"}>{event_name}</p>
			{event_subtitle && (
				<p className={"m-0 inline h-[25px] w-full truncate whitespace-nowrap font-medium text-fangarde-gray"}>
					{event_subtitle}
				</p>
			)}
			<p className={"m-0 inline h-[25px] w-full truncate whitespace-nowrap font-medium text-fangarde-gray"}>
				{format_date_location(event_date, event_location)}
			</p>
		</div>
	);
};

export default EventCard;
