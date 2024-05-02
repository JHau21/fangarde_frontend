export interface IDictionary {
	[question: string]: { answer: string; category: number };
}

export const dictionary: IDictionary = {
	"I tried searching my question and couldn’t get an answer, what should I do now?": {
		answer: "If your question is not urgent, you should go ahead and fill out the contact form below and enter your question. If this is an urgent matter, proceed to the bottom of this page and call or email us. Sorry you were unable to find an answer for your question, but we promise to get back to you as soon as possible!",
		category: 1,
	},
	"I’m interested in your ticketing platform, how can I get in touch?": {
		answer: "Send us an email via the form below. We will then contact you to begin the steps of onboarding you onto our platform.",
		category: 1,
	},
	"How can I find events close to where I live?": {
		answer: "Navigate to the events page. There, you will see a widget to filter events by location.",
		category: 1,
	},
	"How can I find events for my school and purchase tickets?": {
		answer: "Navigate to the events page. Then, locate the search bar where you will be able to filter events by venue.",
		category: 1,
	},
	"Where can I see my ticket after I’ve purchased it?": {
		answer: "When you purchase a ticket, it will be sent to your email. For every ticket, there will be a PDF for it.",
		category: 1,
	},
	"How do I get into my event now that I have my ticket?": {
		answer: "Present the QR code emailed to you to the ticketing attendant at the venue.",
		category: 1,
	},
	"I’ve purchased a ticket but I have a poor WiFi connection at the game, how can I get in?": {
		answer: "We recommend keeping a local copy of your ticket to use when you arrive at the venue. If you are unable to access your ticket, find a ticket office to help troubleshoot your issue in person.",
		category: 1,
	},
	"Why is there a fee added on to my tickets?": {
		answer: "Fangarde is proud to be a platform that assesses no hidden fees on our tickets. The only additional fee you will pay beyond the listed price is sales tax.",
		category: 2,
	},
	"Can I download my tickets once I have them?": {
		answer: "Yes, we recommend downloading your tickets off your email as a PDF or screenshotting the QR code with your smartphone.",
		category: 2,
	},
	"Can I add my tickets to my Apple Wallet?": {
		answer: "Currently, you cannot add tickets to your Apple Wallet. However, this is not necessary as long as you possess the QR code associated with your ticket.",
		category: 2,
	},
	"Can I get tickets for multiple people?": {
		answer: "Yes, all tickets purchased at the same time will be available in the same email sent at the point of purchase.",
		category: 2,
	},
	"If I can’t go to an event, what is your policy for selling that ticket?": {
		answer: "Currently, the validity of tickets sold on the secondary market is up to the discretion of the venue.",
		category: 2,
	},
	"What are ticket 'Terms and Conditions'?": {
		answer: "Terms and Conditions are rules imposed by the venue to ensure a simple and equitable experience for all customers.",
		category: 2,
	},
	"Why is there a tax added to my ticket?": {
		answer: "If a tax is levied, it is because of local sales taxes on the end of the venue.",
		category: 2,
	},
	"Why wasn’t I able to get into my event with my ticket?": {
		answer: "If you were unable to get into an event, it is probably because you bought your ticket on an unverified secondary platform. The validity of tickets purchased from third-party websites is up to the discretion of the venue. If you were denied entry for another reason, please contact us via the form below so we can help make things right.",
		category: 2,
	},
	"How do I get into an event?": {
		answer: "Present your QR code(s) to the attendant at the entrance.",
		category: 3,
	},
	"How do I find events for a specific venue?": {
		answer: "On the events page, type the name of the venue you are looking for in the search bar to see a list of all scheduled events at that venue.",
		category: 3,
	},
	"How can I find where an event is located?": {
		answer: "Addresses of venues are visible in your cart as well as in the email containing your tickets.",
		category: 3,
	},
	"How can I find where I am sitting?": {
		answer: "Seating information will be visible on the tickets themselves.",
		category: 3,
	},
	"Who can register and buy tickets for an event?": {
		answer: "Age restrictions for certain events may be applied at the discretion of the venue. Fangarde is not responsible for denied entry due to underage purchase.",
		category: 3,
	},
	"How do I know if my ticket is for accessibility seating?": {
		answer: "Accessibility information will be visible on all accessible tickets.",
		category: 4,
	},
	"How do I know if a ticket I’m going to buy is for accessible seating?": {
		answer: "Accessible tickets will be visible as a potential option on our purchasing interface for all venues that offer accessible seating.",
		category: 4,
	},
	"Do I need to verify my need for accessibility seating to purchase those tickets?": {
		answer: "Fangarde will not verify disability to purchase accessible seats. The validity of accessibility status for accessible seating will be at the discretion of the venue.",
		category: 4,
	},
	"Can I buy accessible seating tickets for someone else?": {
		answer: "Yes, you can purchase accessible seats for someone else.",
		category: 4,
	},
	"How do I know if a venue has accessibility seating?": {
		answer: "If a venue offers accessible seating, accessible options will be visible on the purchasing interface for that event.",
		category: 4,
	},
	"How can I get in touch with you all if I’m interested in your software?": {
		answer: "If you are interested in our platform, reach out to us via the form below, and we will contact you regarding next steps.",
		category: 5,
	},
	"If I need urgent support, who can I reach out to?": {
		answer: "If your needs are urgent, call (303) 859-4840 to receive support.",
		category: 5,
	},
	"What is the fee that will be taken from my ticket sales?": {
		answer: "Fangarde pricing is tier-based with fees corresponding to the volume of tickets sold. Reach out via the form below for exact information.",
		category: 5,
	},
	"How much does it cost to use your software?": {
		answer: "Fangarde currently requires no upfront payments to use our software.",
		category: 5,
	},
	"What are some of the features of your software?": {
		answer: "Our current features offer total control of the event-creation process to our clients without levying hidden fees on customers. We offer a simple interface for creating events and tickets. We also provide a simple marketplace for customers to purchase tickets to the events you create.",
		category: 5,
	},
	"Can I restrict who can buy tickets to my events?": {
		answer: "Currently, Fangarde offers the ability to set age restrictions for your events.",
		category: 5,
	},
	"What regulations can I set for my tickets?": {
		answer: "Currently, Fangarde offers regulations on pricing. We are working on adding more customizable regulations soon.",
		category: 5,
	},
	"What is your ticket pricing policy?": {
		answer: "Ticket pricing is up to each individual venue.",
		category: 6,
	},
	"What is your refund policy?": {
		answer: "Refunds are issued on a case-by-case basis. If you feel you deserve a refund, reach out to us via the form below.",
		category: 6,
	},
	"What is the policy if I am scammed after buying a ticket?": {
		answer: "Fangarde takes great care to ensure our customers avoid scams. Tickets purchased on a third-party website are not guaranteed, and it is up to each individual venue whether or not to honor a ticket purchased on a third-party site. Refer to the refund policy for more information.",
		category: 6,
	},
};
