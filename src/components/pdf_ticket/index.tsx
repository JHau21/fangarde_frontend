import { View, Page, Text, Image, Document, StyleSheet, Font } from "@react-pdf/renderer";
import { format_date } from "../../pages/account/admin/components/admin_content/components/finance/books_page/books";
import fangarde_text from "../../common/logos/fangarde_logo_without_shield.png";
import Helvetica from "../../common/fonts/Helvetica.ttf";
import HelveticaBold from "../../common/fonts/Helvetica-Bold.ttf";

Font.register({
	family: "Helvetica",
	src: `url(${Helvetica})`,
});
Font.register({
	family: "Helvetica-Bold",
	src: `url(${HelveticaBold})`,
});

const text_styles = StyleSheet.create({
	normal: {
		fontFamily: "Helvetica",
		fontSize: 20,
		fontWeight: "light",
	},
	bold: {
		fontFamily: "Helvetica-Bold",
		fontSize: 24,
		fontWeight: "bold",
	},
	small_bold: {
		fontFamily: "Helvetica-Bold",
		fontSize: 20,
		fontWeight: "bold",
	},
	small_normal: {
		fontFamily: "Helvetica",
		fontSize: 16,
		fontWeight: "light",
		marginTop: "30px",
	},
	large_bold: {
		fontFamily: "Helvetica-Bold",
		fontSize: 32,
		fontWeight: "bold",
	},
	large_normal: {
		fontFamily: "Helvetica",
		fontSize: 24,
		fontWeight: "light",
	},
});

const pdfstyles = StyleSheet.create({
	page: {
		backgroundColor: "#E4E4E4",
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
	},
	header: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#3450ea",
		height: "100%",
		width: "150px",
	},
	footer: {
		height: "100%",
		width: "15%",
		backgroundColor: "#4363ae",
		justifyContent: "center",
		alignItems: "center",
	},
	ticket_content: {
		display: "flex",
		flexDirection: "column",
		width: "670px",
		justifyContent: "space-between",
		height: "80%",
		padding: "10px",
	},
	column: {
		height: "90%",
		width: "90%",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "flex-start",
	},
	row: {
		height: "275px",
		width: "100px",
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
	},
	sideways_text: {
		transform: "rotate(-90deg)",
		width: "275px",
		textAlign: "center",
		flexDirection: "row",
	},
	text_wrapper: {
		justifyContent: "center",
		alignItems: "center",
		height: "100%",
	},
});

const image_styles = StyleSheet.create({
	image_wrapper: {
		height: "200px",
		width: "100px",
		alignItems: "center",
		justifyContent: "center",
	},
	small_image_wrapper: {
		height: "50px",
		width: "50px",
		alignItems: "center",
	},
	image_row: {
		height: "270px",
		width: "100px",
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "space-between",
	},
	image: {
		height: "50px",
		width: "200px",
		transform: "rotate(-90deg)",
	},
	small_image: {
		width: "50px",
		height: "50px",
		transform: "rotate(-90deg)",
	},
});
interface TicketProps {
	event: EventCreate;
	transaction: Transaction;
	user_organization: Organization;
}
export const PDFTicket = ({ event, transaction, user_organization }: TicketProps) => {
	return (
		<Document>
			{transaction.order.map((order: any, index: number) => {
				const ticket = order.ticket_type_id;
				const tickets = Array.from({ length: order.quantity }, (_, index) => index + 1);
				return tickets.map((ticket_number: any) => {
					return (
						<Page key={index} size={[961.2, 360]} style={pdfstyles.page}>
							<div style={pdfstyles.header}>
								<div style={pdfstyles.column}>
									<View
										break={false}
										style={{
											...pdfstyles.text_wrapper,
											width: "25%",
										}}
									>
										<Text
											break={false}
											style={{
												...text_styles.small_bold,
												...pdfstyles.sideways_text,
											}}
										>
											{user_organization.name}
										</Text>
									</View>
									<View
										style={{
											...pdfstyles.text_wrapper,
											width: "24px",
										}}
									>
										<Text
											break={false}
											style={{
												...text_styles.normal,
												...pdfstyles.sideways_text,
											}}
										>
											{event.location.address.street}
										</Text>
									</View>
									<View
										style={{
											...pdfstyles.text_wrapper,
											width: "24px",
										}}
									>
										<Text
											break={false}
											style={{
												...text_styles.normal,
												...pdfstyles.sideways_text,
											}}
										>
											{event.location.address.city}, {event.location.address.state}{" "}
											{event.location.address.zip}
										</Text>
									</View>
									<View
										style={{
											...pdfstyles.text_wrapper,
											width: "24px",
											marginLeft: "10px",
										}}
									>
										{transaction.first_name && (
											<Text
												break={false}
												style={{
													...text_styles.normal,
													...pdfstyles.sideways_text,
												}}
											>
												<Text style={text_styles.small_bold}>For: </Text> {transaction.first_name}{" "}
												{transaction.last_name}
											</Text>
										)}
									</View>
								</div>
							</div>

							<div style={pdfstyles.ticket_content}>
								<Text
									style={{
										...text_styles.bold,
										marginBottom: "10px",
									}}
								>
									{event.name}
								</Text>
								<Text
									style={{
										...text_styles.normal,
										marginBottom: "10px",
									}}
								>
									{format_date(event.event_start_time)}
								</Text>
								<Text
									style={{
										...text_styles.normal,
										marginBottom: "10px",
									}}
								>
									${ticket?.price.toString() ?? 0}
								</Text>
								{ticket?.custom_ticket_message && (
									<View
										style={{
											maxWidth: "700px",
											maxHeight: "100px",
											marginBottom: "10px",
										}}
									>
										<Text
											style={{
												...text_styles.small_bold,
												marginBottom: "10px",
											}}
										>
											{ticket?.custom_ticket_message?.title ? ticket?.custom_ticket_message?.title : ""}
										</Text>
										<Text style={text_styles.normal}>
											{ticket?.custom_ticket_message?.title ? ticket?.custom_ticket_message?.content : ""}
										</Text>
									</View>
								)}
								<Text style={text_styles.small_normal}>Order #: {transaction._id}</Text>
							</div>
							<div style={pdfstyles.footer}>
								<div style={image_styles.image_row}>
									<div style={image_styles.image_wrapper}>
										<Image style={image_styles.image} src={fangarde_text} />
									</div>
									<div style={image_styles.small_image_wrapper}>
										<Image style={image_styles.small_image} src="/images/fangarde_shield_only_logo.png" />
									</div>
								</div>
							</div>
						</Page>
					);
				});
			})}
		</Document>
	);
};

export default PDFTicket;
