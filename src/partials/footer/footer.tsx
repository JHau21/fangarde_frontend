import { Link } from "react-router-dom";

import { use_ticket_order } from "state/events/use_ticket_order";

function Footer() {
	const { selected_event } = use_ticket_order();

	const href = window.location.href;

	if (selected_event?.color_scheme && href.includes("/event")) {
		return null;
	}

	return (
		<div className="mt-4 flex w-full flex-col items-center space-y-8 bg-gradient-to-t from-dark-blue to-light-blue px-[5%] pb-[50px] pt-[50px] text-center text-fangarde-white md:flex-row md:justify-around md:space-y-0 md:text-left">
			<div className={"flex flex-col md:items-start"}>
				<p className="mb-3 text-lg-header">Contact</p>
				<div className="flex flex-col md:items-start">
					<Link to="/contact#contact_form">Contact Page</Link>
					<a href="/contact">FAQS</a>
				</div>
			</div>
			<div className={"flex flex-col md:items-start"}>
				<p className="mb-3 text-lg-header">About</p>
				<a href="/about">About Page</a>
				<Link to="/about#founders">Meet the Founders</Link>
			</div>
			<div className={"flex flex-col md:items-start"}>
				<p className="mb-3 text-lg-header">Social Media</p>
				<div className={"flex flex-row items-center"}>
					<div className="mr-5 flex flex-col md:items-start">
						<Link to="https://www.linkedin.com/company/fangarde/?viewAsMember=true">LinkedIn</Link>
						<Link to="https://www.instagram.com/fangardeticketing/">Instagram</Link>
					</div>
					<div className="flex flex-col md:items-start">
						<Link to="https://twitter.com/i/flow/login?redirect_after_login=%2FFanGardeTicket">X</Link>
						<Link to="https://www.facebook.com/people/FanGarde/100089594965532/">Facebook</Link>
					</div>
				</div>
			</div>
			<div className={"flex flex-col md:items-start"}>
				<p> General Inquiries - contact@fangarde.com</p>
				<p>Partnerships and Business Inquiries - david@fangarde.com</p>
			</div>
		</div>
	);
}

export default Footer;
