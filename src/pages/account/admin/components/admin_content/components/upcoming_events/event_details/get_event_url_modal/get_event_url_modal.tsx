import styles from "./get_event_url_modal.module.css";
import SmallButton from "../../../../../../../../../components/small_button/small_button";
import clipboardIcon from "../../../../../../../../../common/icons/clipboardIcon.svg";
import Modal from "../../../../../../../../../components/modal/modal";
import ObjectID from "bson-objectid";

interface URLModalProps {
	onExit: Function;
	event_id: ObjectID | undefined;
}

const URLModal = ({ onExit, event_id }: URLModalProps) => {
	var lastPart = event_id;

	async function copyToClipboard() {
		await navigator.clipboard.writeText(`${process.env.REACT_APP_URL}/event/${lastPart}`);
		alert("Copied the text: " + `${process.env.REACT_APP_URL}/event/${lastPart}`);
	}

	return (
		<Modal onExit={() => onExit()}>
			<h1>Event URL</h1>
			<p className={styles.description}>Here is your event URL! Share it with everyone so they can get tickets!</p>
			<div style={{ position: "relative" }}>
				<input className={styles.inputThin} readOnly={true} value={`${process.env.REACT_APP_URL}/event/${lastPart}`} />
				<div
					className={styles.clipboard}
					onClick={() => {
						copyToClipboard();
					}}
				>
					<img className={styles.image} alt={"Copy to clipboard"} src={clipboardIcon} />
				</div>
			</div>
			<div style={{ marginBottom: "20px" }}>
				<SmallButton
					onClick={() => {
						copyToClipboard();
					}}
				>
					Copy to Clipboard
				</SmallButton>
			</div>
			<div>
				<SmallButton
					onClick={() => {
						onExit();
					}}
				>
					Done
				</SmallButton>
			</div>
		</Modal>
	);
};

export default URLModal;
