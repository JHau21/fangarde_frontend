import React from "react";
import styles from "./modal.module.css";
import exit from "../../common/icons/exit_dark.svg";

interface ModalProps {
	hide_x?: boolean;
	onExit: Function;
	children: React.ReactNode;
}

const Modal = ({ hide_x, onExit, children }: ModalProps) => {
	return (
		<div className={styles.modal}>
			<div className={styles.modalContent}>
				{!hide_x && <img className={styles.exit} src={exit} onClick={() => onExit()} alt={"exit"} />}
				{children}
			</div>
		</div>
	);
};

export default Modal;
