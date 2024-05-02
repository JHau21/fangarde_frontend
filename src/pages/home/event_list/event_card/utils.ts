export const format_time = (date: Date) => {
	const today: Date = new Date();

	const js_date: Date = new Date(date);

	const curr_month: number = today.getMonth() + 1;
	const event_month: number = js_date.getMonth() + 1;
	const curr_year: number = today.getFullYear();
	const event_year: number = js_date.getFullYear();

	if (event_month - curr_month === 0) {
		const diff: number = js_date.getDate() - today.getDate();

		switch (diff) {
			case 0: {
				return "Today!";
			}
			case 1: {
				return "Tomorrow!";
			}
			default: {
				return diff + " days away!";
			}
		}
	} else if (event_year - curr_year === 0) {
		const diff: number = event_month - curr_month;

		switch (diff) {
			case 1: {
				return "Next month!";
			}
			default: {
				return diff + " months away!";
			}
		}
	} else {
		const diff: number = event_year - curr_year;

		switch (diff) {
			case 1: {
				return "Next year!";
			}
			default: {
				return diff + " years away!";
			}
		}
	}
};

export const format_date_location = (date: Date, location: EventLocation) => {
	const { name } = location;

	if (name) {
		const date_mapper: Array<string> = [
			"Jan.",
			"Feb.",
			"March",
			"April",
			"May",
			"June",
			"July",
			"Aug.",
			"Sep.",
			"Oct.",
			"Nov.",
			"Dec.",
		];
		const js_date: Date = new Date(date);
		const day: string = js_date.getDate().toString();
		const month: string = date_mapper[js_date.getMonth()];

		switch (day[day.length - 1]) {
			case "1": {
				return month + " " + day + "st @ " + name;
			}
			case "2": {
				return month + " " + day + "nd @ " + name;
			}
			case "3": {
				return month + " " + day + "rd @ " + name;
			}
			default: {
				return month + " " + day + "th @ " + name;
			}
		}
	}
};
