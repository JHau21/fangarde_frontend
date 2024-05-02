import React, { useEffect, useState } from "react";
import { FieldValues } from "react-hook-form";
import { useLocation } from "react-router-dom";
import axios from "axios";

import CommonBarSmall from "components/bars/common_bar_small";
import ErrorMessage from "components/error_message";
import Form from "./contact_form";
import Loader from "../../partials/loader/loader";
import { QaButton } from "./qa_button";
import SearchInputBox from "components/search_input_box";
import TextButton from "components/text_button";
import { ToggleBar } from "./toggle_bar";

import { api } from "axiosClients/client";

import { IDictionary, dictionary } from "./i_dictionary";

import contact_style from "./contact.module.css";

import email_sent from "../../common/icons/email_sent.png";

enum EmailStatus {
	Success,
	Failure,
	Pending,
	None,
}

function Contact(): React.ReactElement {
	const [active_btn, set_active_btn] = useState<number>(1);
	const [error_message, set_error_message] = useState<string>("");
	const [search, set_search] = useState("");
	const [email_status, set_email_status] = useState<EmailStatus>(EmailStatus.None);

	const location = useLocation();

	// Dependency variables
	function filter_by_category(dictionary: IDictionary, category: number): IDictionary {
		const filteredDictionary: IDictionary = {};
		for (const question in dictionary) {
			if (dictionary[question].category === category) {
				filteredDictionary[question] = dictionary[question];
			}
		}
		return filteredDictionary;
	}

	function convert_to_array(dict: IDictionary): { question: string; answer: string }[] {
		return Object.entries(dict).map(([question, { answer }]) => ({
			question,
			answer,
		}));
	}

	// React hook variables
	const filteredDict: { question: string; answer: string }[] = convert_to_array(filter_by_category(dictionary, active_btn));
	const questionAnswerArray: { question: string; answer: string }[] = Object.entries(dictionary).map(([question, { answer }]) => ({
		question,
		answer,
	}));

	// JS/TS variables and methods
	function question_include_search(question: string, searchTerm: string) {
		const term = searchTerm.toLowerCase();
		const lowercasedQuestion = question.toLowerCase();
		return lowercasedQuestion.includes(term);
	}

	// JS/TS Functions
	function SearchResult() {
		if (search === "") {
			return (
				<div className={"my-[15px] flex w-full flex-col items-center text-center"}>
					<h2 className={"m-0 my-[10px] p-0 text-lg-header"}>FAQs</h2>
					<h3 className={"m-0 my-[5px] p-0 text-sm-header"}>Browse the FAQ Categories.</h3>
					<ToggleBar set_active_btn={set_active_btn} active_btn={active_btn} />
					<div className={"w-full"}>
						{filteredDict.map((item, index) => (
							<div key={index}>
								<QaButton question={item.question} answer={item.answer} />
							</div>
						))}
					</div>
				</div>
			);
		}

		return (
			<div className="flex w-full flex-col items-center text-center">
				<h2 className={contact_style.contact_headers}>Search Result</h2>
				<div className="mx-auto flex flex-col">
					{questionAnswerArray
						.filter((item) => question_include_search(item.question, search))
						.map((item, index) => (
							<div key={index}>
								<QaButton question={item.question} answer={item.answer} />
							</div>
						))}
					{questionAnswerArray.filter((item) => question_include_search(item.question, search)).length === 0 && (
						<p>Sorry, we couldn't find any results matching this search. Please fill out our contact form below!</p>
					)}
				</div>
			</div>
		);
	}

	// Function to fetch the user's IP address
	async function fetch_user_ip() {
		try {
			const response = await axios.get(`https://geolocation-db.com/json/${process.env.REACT_APP_DB_LOCATION}`);

			return response.data.IPv4;
		} catch (error) {
			console.error("Error fetching user IP:", error);
		}
	}

	async function handle_form_submit(vals: FieldValues) {
		set_email_status(EmailStatus.Pending);
		set_error_message("");

		const user_ip = await fetch_user_ip();

		try {
			const response = await api.post("/contact_form", {
				...vals,
				ip: user_ip, // Include the user's IP in the form data
			});

			if (response.status === 200) {
				if (response.data.repeat_submission) {
					set_error_message(
						"You have recently submitted an inquiry. Please wait at least one hour before submitting another. If your concern is urgent, use one of our contact lines below."
					);

					set_email_status(EmailStatus.Failure);
				} else {
					set_email_status(EmailStatus.Success);
				}
			} else {
				set_error_message(`Error sending email. ${response.data.error}`);

				console.error("Error sending email:", response.data.error);
				set_email_status(EmailStatus.Failure);
			}
		} catch (error) {
			set_error_message(`Error sending email. ${error}`);

			console.error("Error sending email:", error);
			set_email_status(EmailStatus.Failure);
		}
	}

	function EmailSent() {
		switch (email_status) {
			case EmailStatus.Pending:
				return (
					<div className={contact_style.loader}>
						<Loader />
					</div>
				);
			case EmailStatus.Success:
				return (
					<div className={"my-[15px] w-full"}>
						<img src={email_sent} alt="Email Icon" />
						<p className={contact_style.email_sent}>
							Thanks for reaching out, we’ll get back to you as soon as possible!
						</p>
					</div>
				);
			case EmailStatus.Failure:
				return <Form onSubmit={handle_form_submit} />;
			case EmailStatus.None:
				return <Form onSubmit={handle_form_submit} />;
		}
	}

	useEffect(() => {
		if (location.hash === "#contact_form") {
			const element = document.getElementById("contact_form");
			if (element) {
				element.scrollIntoView({ behavior: "smooth" });
			}
		}
	}, [location.hash]);

	return (
		<div className="my-16 flex w-full flex-col items-center px-[300px] font-custom text-regular font-normal text-fangarde-black">
			<div className={"mb-[15px] flex w-[70%] flex-col items-center"}>
				<h1 className="mb-[10px] text-lg-header">Have a question? Search below.</h1>
				<SearchInputBox
					placeholder={"Search by writing your question..."}
					onChange={(value: string) => set_search(value)}
					value={search}
				/>
				<TextButton label={"Reset Search"} onClick={() => set_search("")} />
			</div>
			<SearchResult />
			<div id="contact_form" className="my-[15px] flex w-5/6 flex-col text-center">
				<h1 className="mb-[10px] text-lg-header">Contact Form</h1>
				<p className="text-regular">
					We’re sorry that you couldn’t find a relevant answer for your question! Fill out the form below and we’ll reach
					out to you as soon as possible!
				</p>
			</div>
			<EmailSent />
			<div className={"flex w-5/6 flex-col items-center"}>
				{email_status === EmailStatus.Failure && <ErrorMessage message={error_message} />}
			</div>
			<div className={"my-[15px] flex w-full flex-col items-center"}>
				<h1 className={"mb-[10px] text-lg-header"}>Support</h1>
				<p className={"mb-[10px] text-regular"}>Is your concern urgent? Don't hesitate to reach out!</p>
				<div className={"flex flex-row items-center justify-between"}>
					<p className={"font-bold"}>
						Our Email: <span className={"font-medium text-medium-blue"}>contact@fangarde.com</span>
					</p>
					<CommonBarSmall />
					<p className={"font-bold"}>
						Phone Number: <span className={"font-medium text-medium-blue"}>(303) 859-4840</span>
					</p>
				</div>
			</div>
		</div>
	);
}

export default Contact;
