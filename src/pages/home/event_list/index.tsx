import React from "react";

import EventCard from "./event_card";

type Props = {
	events: Array<EventCreate>;
	onClick: Function;
};

const EventList: React.FC<Props> = ({ events, onClick }) => {
	return (
		<div className="flex flex-col space-y-4 text-center md:w-full">
			<div className="grid grid-cols-1 flex-col items-center gap-4 text-left sm:grid-cols-2 md:grid-cols-3">
				{events.length > 0 ? (
					events.map((event: any, key: number) => {
						const { _id } = event;

						return (
							<div key={key}>
								<EventCard
									key={key}
									event_date={event.event_start_time}
									event_image={event.search_image}
									event_location={event.location}
									event_name={event.name}
									event_subtitle={event.subtitle}
									onClick={() => onClick(_id)}
								/>
							</div>
						);
					})
				) : (
					<h3 className={" text-center font-custom font-custom text-sm-header font-bold md:whitespace-nowrap"}>
						No events found. Please check back later for upcoming events or try refining your search.
					</h3>
				)}
			</div>
		</div>
	);
};

export default EventList;
