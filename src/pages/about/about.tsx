import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Founders from "./founder";

import color_palette from "common/types/colors";

import FangardeLogo from "common/logos/blue_shield_logo.svg";

function About() {
	const location = useLocation();

	useEffect(() => {
		if (location.hash === "#founders") {
			const element = document.getElementById("founders");
			if (element) {
				element.scrollIntoView({ behavior: "smooth" });
			}
		}
	}, [location.hash]);

	return (
		<div className={"relative mx-36 my-16 flex flex-col font-custom text-regular font-normal text-fangarde-black"}>
			<h1 className={"mb-6 text-center text-lg-header font-bold"}>Delightful Event Creation Meets Powerful Performance</h1>
			<div className="mb-6 mt-6 w-[400px]">
				<h1 className={"mb-2"}>Our Vision.</h1>
				<div>
					<p>
						Through{" "}
						<span className={"font-bold"} style={{ color: color_palette.dark_blue }}>
							100s
						</span>{" "}
						of industry interviews in the live entertainment space, we've learned that existing event management is{" "}
						<span className={"font-bold"} style={{ color: color_palette.dark_blue }}>
							timed-consuming and expensive
						</span>
						. There exist{" "}
						<span className={"font-bold"} style={{ color: color_palette.dark_blue }}>
							no reliable platforms
						</span>{" "}
						that can tackle every need. With existing solutions, you need one platform to handle marketing. Another
						platform to manage donations. An additional platform to sell tickets. Possibly even MORE platforms to sell
						merchandise, connect with entertainment performers, view crucial data analytics, etc.{" "}
						<span className={"font-bold"} style={{ color: color_palette.dark_blue }}>
							Fangarde
						</span>{" "}
						aims to solve this by providing a performant{" "}
						<span className={"font-bold"} style={{ color: color_palette.dark_blue }}>
							all-in-one
						</span>{" "}
						solution!
					</p>
				</div>
			</div>
			<div className={"relative mb-6 mt-6 h-[400px]"}>
				<h1 className={"mb-10 text-center"}>Our Product.</h1>
				<img className={"absolute left-[37%]"} alt="shield graphic" src={FangardeLogo} />
				<div
					className={
						"absolute left-[10%] top-[15%] flex w-[225px] flex-col items-center rounded-lg bg-gradient-to-tr from-dark-blue to-fuchsia-400 p-[15px] text-white"
					}
				>
					<h2 className={"m-0 p-0 text-center"}>Ticketing</h2>
					<p className={"text-center"}>Simple and intuitive system to create events and sell tickets.</p>
				</div>
				<div
					className={
						"absolute right-[10%] top-[40%] flex w-[225px] flex-col items-center rounded-lg bg-gradient-to-tl from-lime-400 to-medium-blue p-[15px] text-white"
					}
				>
					<h2 className={"m-0 p-0 text-center"}>Marketing</h2>
					<p className={"text-center"}>
						Minimal marketing page to easily collect the email addresses of interested customers.
					</p>
				</div>
				<div
					className={
						"absolute left-[13%] top-[75%] flex w-[225px] flex-col items-center rounded-lg bg-gradient-to-br from-violet-500 to-light-blue p-[15px] text-white"
					}
				>
					<h2 className={"m-0 p-0 text-center"}>Donations</h2>
					<p className={"text-center"}>Seamless controls to gather donations from your events.</p>
				</div>
			</div>
			<div className={"mb-6 mt-6"}>
				<h1 className={"text-center"}>Our Values.</h1>
				<div className={"flex flex-col items-center"}>
					<div className={"flex flex-row items-center justify-between"}>
						<div className={"relative my-4 h-[120px] w-[45%] border-[3px] border-dark-blue px-2"}>
							<h2 className={"absolute left-[20%] top-[-50%] w-[300px] bg-white text-center"}>Simplicity</h2>
							<p className={"px-2 pt-6 text-center"}>
								Simple solutions are optimal solutions. When event management is simple, it's faster, more
								cost-effective, and less error prone.
							</p>
						</div>
						<div className={"relative my-4 h-[120px] w-[45%] border-[3px] border-dark-blue px-2"}>
							<h2 className={"absolute left-[20%] top-[-50%] w-[300px] bg-white text-center"}>Excellence</h2>
							<p className={"px-2 pt-6 text-center"}>
								Excellent performance and quality always beat pure function. High quality software is efficient,
								reliable, and pain-free.
							</p>
						</div>
					</div>
				</div>
				<div className={"flex flex-col items-center"}>
					<div className={"flex flex-row items-center justify-between"}>
						<div className={"relative my-4 h-[120px] w-[45%] border-[3px] border-dark-blue px-2"}>
							<h2 className={"absolute left-[20%] top-[-50%] w-[300px] bg-white text-center"}>Candor</h2>
							<p className={"px-2 pt-6 text-center"}>
								Honesty trumps everything. When mistakes are made or deadlines are missed, you're affected too. You
								deserve to know everything.
							</p>
						</div>
						<div className={"relative my-4 h-[120px] w-[45%] border-[3px] border-dark-blue px-2"}>
							<h2 className={"absolute left-[20%] top-[-50%] w-[300px] bg-white text-center"}>Growth</h2>
							<p className={"px-2 pt-6 text-center"}>
								Learning and growth matter in individuals and in businesses. You deserve a business that's dynamic
								and grows with your organization and its needs.
							</p>
						</div>
					</div>
				</div>
				<div className={"flex flex-col items-center"}>
					<div className={"flex flex-row items-center justify-between"}>
						<div className={"relative my-4 h-[120px] w-[45%] border-[3px] border-dark-blue px-2"}>
							<h2 className={"absolute left-[20%] top-[-50%] w-[300px] bg-white text-center"}>Ownership</h2>
							<p className={"px-2 pt-6 text-center"}>
								Taking ownership means personally investing ourselves in your organization and needs. When something
								goes wrong, we take responsibilty and when you need something, we need something.
							</p>
						</div>
						<div className={"relative my-4 h-[120px] w-[45%] border-[3px] border-dark-blue px-2"}>
							<h2 className={"absolute left-[20%] top-[-50%] w-[300px] bg-white text-center"}>Care</h2>
							<p className={"px-2 pt-6 text-center"}>
								To provide an incredible solution to serve your needs, we need to care. That's why we care about you
								and your organization, problems, satisfaction, etc... we care... a lot.
							</p>
						</div>
					</div>
				</div>
			</div>
			<h1 id="founders" className={"text-center"}>
				Our Founders.
			</h1>
			<Founders />
		</div>
	);
}

export default About;
