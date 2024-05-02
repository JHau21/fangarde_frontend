/** @type {import('tailwindcss').Config} */

module.exports = {
	content: ["./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				"dark-blue": "#008FD5",
				"medium-blue": "#00AEFF",
				"light-blue": "#7EE5F4",
				"light-brown": "#BDB5B2",
				"medium-brown": "#9E8E81",
				"fangarde-white": "#F7F7F9",
				"fangarde-black": "#141617",
				"fangarde-gray": "#808080",
				"fangarde-light-gray": "#EEEEEE",
				"fangarde-disable-gray": "#BEBEBE",
				"fangarde-dark-red": "#DC1A21",
				"fangarde-medium-red": "#CC3D42",
				"fangarde-light-red": "#C45559",
			},
			fontSize: {
				regular: "16px",
				"sm-header": "20px",
				"md-header": "24px",
				"lg-header": "32px",
			},
			fontFamily: {
				custom: ["Arial", "Helvetica", "sans-serif"],
			},
			backgroundImage: {
				"search-icon": "url('/src/common/icons/search_glass_icon.svg')",
			},
		},
	},
	plugins: [],
};
