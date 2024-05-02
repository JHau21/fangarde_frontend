import { use_sign_up } from "state/use_sign_up";
import { SignUpStep } from "common";
import SmallButton from "components/small_button/small_button";

import styles from "./sign_up_info.module.css";

const SignUpInfo = () => {
	const set_sign_up_step = use_sign_up((state) => state.set_sign_up_step);

	return (
		<div className="mx-36 my-10 flex flex-col items-center">
			<div className={styles.column}>
				<h1 className="common_bold">We’re glad that you’re interested!</h1>
				<p className="common_light">
					We understand that hosting events can be a chaotic, frustrating, and complicated, even when the outcomes are
					incredible! That’s why we offer a variety of features to simplify the event hosting process!
				</p>
				<p className="common_light">Check out our features below or skip to the sign up section if you’re ready!</p>
				<div className={styles.enterprise}>
					<h1>Enterprise Features</h1>
				</div>
				<div className={styles.box}></div>
				<div className={styles.line}></div>
				<div className={styles.cardRow}>
					<div className={styles.card}>
						<div className={styles.cardTitle}>
							<h3>Event Management</h3>
						</div>
						<div className={styles.contentContainer}>
							<div className={styles.title}>
								<p className="common_bold">Event Creation</p>
							</div>
							<p className="common_light">
								The most important part of being an event-organizer is, of course, the ability to create events. Our
								platform not only allows creation of events, it makes the process easy.
							</p>
							<div className={styles.title}>
								<p className="common_bold">Display Formatting</p>
							</div>
							<p className="common_light">
								When you host an event, that event is yours and yours alone. We understand this and with that in
								mind, our platform allows you to customize how your event information is displayed.
							</p>
							<div className={styles.title}>
								<p className="common_bold">Event History</p>
							</div>
							<p className="common_light">
								Optimizing event planning is crucial and as such, we present you with a comprehensive history and
								information on all of your past events.
							</p>
						</div>
					</div>
					<div className={styles.card}>
						<div className={styles.cardTitle}>
							<h3>Terms and Conditions</h3>
						</div>
						<div className={styles.contentContainer}>
							<div className={styles.title}>
								<p className="common_bold">Rule Setting</p>
							</div>
							<p className="common_light">
								As an organizer, we know you want your attendees to have a wonderful experience that’ll inspire them
								to come back. Therefore, everything from event itself to the cost of tickets needs to be reasonable.
								As such, we allow you to set whatever regulation you desire for your tickets, whether that be pricing
								regulation, pre-sale rules, etc.
							</p>
							<div className={styles.title}>
								<p className="common_bold">Regulation</p>
							</div>
							<p className="common_light">
								We believe that every single rule you set should be heavily enforced. Not only that, we’ll make sure
								that all of the tickets you release are only bought, sold, and tracked on this platform to ensure
								that you recieve the profit and data from every ticket sold. On our platform you make rules and we
								enforce them.
							</p>
						</div>
					</div>
					<div className={styles.card}>
						<div className={styles.cardTitle}>
							<h3>Data Console</h3>
						</div>
						<div className={styles.contentContainer}>
							<div className={styles.title}>
								<p className="common_bold">Marketing and Advertising</p>
							</div>
							<p className="common_light">
								Marketing your venue is tough, so our data console will provide key analytics about your advertising
								and marketing strategies.
							</p>
							<div className={styles.title}>
								<p className="common_bold">Event Lifecycle Information</p>
							</div>
							<p className="common_light">
								We understand that you want to be able to easily plan events so our console will tell you who’s
								showing up to your events and how your attendee list changes over time.
							</p>
							<div className={styles.title}>
								<p className="common_bold">Ticket Lifecycle Information</p>
							</div>
							<p className="common_light">
								Finally, we want to help you set reasonable and justified terms and conditions, so we’ll provide you
								with crucial ticket lifecycle information.
							</p>
						</div>
					</div>
				</div>
			</div>
			<div className={styles.cost}>
				<h1>Cost</h1>
				<p>
					We will never a more than <span>10%</span> on any ticket transactions.
				</p>
				<p>If you’re new to the platform, everything is free for the three months!</p>
			</div>
			<h1>Let’s Get Started!</h1>
			<div className={styles.setUpText}>
				<p>
					Now we’ll walk you through getting everything set up! If you have any questions along the way, just select the
					“contact us” button.
				</p>
			</div>
			<SmallButton
				onClick={() => {
					set_sign_up_step(SignUpStep.SignUpOrg);
				}}
			>
				Next
			</SmallButton>
		</div>
	);
};

export default SignUpInfo;
