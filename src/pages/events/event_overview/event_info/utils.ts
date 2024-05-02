export const format_date = (date: Date) => {
	const js_date = new Date(date);

	return js_date.getMonth() + 1 + "/" + (js_date.getDate() + 1) + "/" + js_date.getFullYear();
};

export const format_time = (date: Date) => {
	const js_date = new Date(date);

	return js_date.toLocaleTimeString("en-US", {
		hour: "numeric",
		minute: "numeric",
		hour12: true,
	});
};
