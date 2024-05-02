import { useState } from "react";
import { Outlet } from "react-router-dom";
import { EventContext } from "../../../../../types/types";
import styles from "./upcoming_events_root.module.css";
import { EmptyFullEvent } from "../../../../../../../../common/types/event_types";

const UpcomingEventsRoot = () => {
	const [selected_event, set_selected_event] = useState<FullEvent>(
		EmptyFullEvent as any
	);
	const context: EventContext = {
		selected_event: selected_event,
		set_selected_event: set_selected_event,
	};
	return (
		<div className={styles.adminContent}>
			<Outlet context={context} />
		</div>
	);
};

export default UpcomingEventsRoot;
