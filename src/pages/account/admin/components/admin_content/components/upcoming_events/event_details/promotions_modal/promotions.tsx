import React, { useState } from "react";
import styles from "./promotions_modal.module.css";
import Modal from "../../../../../../../../../components/modal/modal";
import SmallButton from "../../../../../../../../../components/small_button/small_button";
import { api } from "axiosClients/client";
import ObjectID from "bson-objectid";

interface PromotionsProps {
	onExit: Function;
	promo_codes: PromoCode[];
	event_id: ObjectID | undefined;
	set_promo_codes: Function;
}

const PromotionsModal = ({ onExit, promo_codes, event_id, set_promo_codes }: PromotionsProps) => {
	const [temp_promo_codes, set_temp_promo_codes] = React.useState<PromoCode[]>(promo_codes);
	const [selected_promo_codes, set_selected_promo_codes] = useState<number[]>([]);
	const [edit_promo_codes, set_edit_promo_codes] = useState<boolean>(false);
	const [error, set_error] = useState<string>("");

	function add_promo_code() {
		let temp_codes: PromoCode[] = temp_promo_codes.slice(0);
		temp_codes.push({
			...emptyPromoCode,
			name: `Promo Code ${temp_codes.length + 1}`,
		});

		set_temp_promo_codes(temp_codes);
	}

	const handle_promo_code_discount = (value: string, index: number) => {
		const parsedValue = parseInt(value);

		if (value === "" || (Number.isInteger(parsedValue) && parsedValue >= 1 && parsedValue <= 100)) {
			let temp_codes: PromoCode[] = temp_promo_codes.slice(0);
			if (value === "") {
				temp_codes[index].discount = 0;
				// delete temp_codes[index].discount; // Remove the 'discount' property if the input is empty
			} else {
				temp_codes[index].discount = parsedValue;
			}
			set_temp_promo_codes(temp_codes);
		}
	};

	function delete_promo_codes() {
		const filtered_codes = temp_promo_codes.filter((item, index) => selected_promo_codes.includes(index));
		const ids_to_delete = filtered_codes.map((promo) => promo._id);
		api.post("/delete_promo_codes", {
			ids: ids_to_delete,
		})
			.then((res) => {
				if (res.status === 201) {
					let temp_codes: PromoCode[] = temp_promo_codes.slice(0);
					temp_codes = temp_codes.filter((item, index) => !selected_promo_codes.includes(index));
					set_selected_promo_codes([]);
					set_temp_promo_codes(temp_codes);
					set_promo_codes(temp_codes);
					set_error("");
				} else {
					set_error("Error deleting promo codes. Try again later.");
				}
			})
			.catch((err) => {
				set_error("Error deleting promo codes. Try again later.");
			});
	}

	function save_promo_codes() {
		api.post("/create_promo_code", {
			promo_codes: temp_promo_codes,
		})
			.then((res) => {
				if (res.data.results) {
					set_temp_promo_codes(res.data.results);
					set_promo_codes(res.data.results);
					set_error("");
				} else {
					set_temp_promo_codes(promo_codes);
					set_error("Error saving promo codes. Try again later.");
				}
			})
			.catch((err) => {
				set_temp_promo_codes(promo_codes);
				set_error("Error saving promo codes. Try again later.");
			});
	}

	function generatePromoCode(length: number) {
		const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
		let promoCode = "";

		for (let i = 0; i < length; i++) {
			const randomIndex = Math.floor(Math.random() * characters.length);
			promoCode += characters.charAt(randomIndex);
		}

		return promoCode;
	}

	const emptyPromoCode: PromoCode = {
		name: "",
		discount: 0,
		code: generatePromoCode(8),
		event_id: event_id ? event_id : new ObjectID(),
	};
	return (
		<Modal onExit={() => onExit()}>
			<h1>Promotions</h1>
			<SmallButton
				onClick={() => {
					if (edit_promo_codes) {
						save_promo_codes();
						set_edit_promo_codes(false);
					} else {
						set_edit_promo_codes(true);
					}
				}}
			>
				{edit_promo_codes ? "Save" : "Edit Promo Codes"}
			</SmallButton>
			<div className={styles.error}>{error}</div>
			<div className={styles.promoCodeHeader}>
				<div className={styles.promoCodeName}>Name</div>
				<div className={styles.promoCodeDiscount}>Discount</div>
				<div className={styles.promoCodeCode}>Code</div>
			</div>
			<div className={styles.promoCodesDisplay}>
				{temp_promo_codes.length !== 0 &&
					temp_promo_codes.map((promo_code, index) => {
						if (edit_promo_codes) {
							return (
								<div className={styles.promoCode}>
									<div className={styles.checkBox}>
										<input
											type="checkbox"
											className={styles.checkbox}
											checked={selected_promo_codes.includes(index)}
											onChange={(event) => {
												if (event.target.checked) {
													set_selected_promo_codes([...selected_promo_codes, index]);
												} else {
													let temp_selected_promo_codes: number[] = selected_promo_codes.filter(
														(item) => item !== index
													);
													set_selected_promo_codes(temp_selected_promo_codes);
												}
											}}
										/>
									</div>
									<div className={styles.promoCodeInputWrapper}>
										<input
											className={styles.promoCodeInput}
											value={promo_code.name}
											maxLength={20}
											onChange={(event) => {
												let temp_codes: PromoCode[] = temp_promo_codes.slice(0);
												temp_codes[index].name = event.target.value;
												set_temp_promo_codes(temp_codes);
											}}
										/>
										<input
											className={styles.promoCodeInput}
											value={Math.round(promo_code.discount)}
											placeholder={promo_code.discount.toString()}
											style={{
												textAlign: "center",
											}}
											onChange={(event) => handle_promo_code_discount(event.target.value, index)}
										/>
										<div
											style={{
												position: "absolute",
												left: "337px",
												top: "8px",
											}}
										>
											%
										</div>
										<input
											className={styles.promoCodeInput}
											value={promo_code.code}
											style={{
												textAlign: "end",
											}}
											onChange={(event) => {
												let temp_codes: PromoCode[] = temp_promo_codes.slice(0);
												temp_codes[index].code = event.target.value;
												set_temp_promo_codes(temp_codes);
											}}
										/>
									</div>
								</div>
							);
						} else {
							return (
								<div className={styles.promoCode}>
									<div className={styles.promoCodeWrapper}>
										<div className={styles.promoCodeName}>{promo_code.name}</div>
										<div className={styles.promoCodeDiscount}>{Math.round(promo_code.discount)} %</div>
										<div className={styles.promoCodeCode}>{promo_code.code}</div>
									</div>
								</div>
							);
						}
					})}
				{temp_promo_codes.length === 0 && <div className={styles.noPromoCodes}>No Promo Codes</div>}
			</div>
			<div className={styles.buttonRow}>
				<SmallButton
					onClick={() => {
						add_promo_code();
					}}
					disabled={temp_promo_codes.length >= 10 || !edit_promo_codes}
				>
					Add Promo Code
				</SmallButton>
				<SmallButton
					onClick={() => {
						delete_promo_codes();
					}}
					disabled={!edit_promo_codes || temp_promo_codes.length === 0}
				>
					Delete Promo Codes
				</SmallButton>
			</div>
		</Modal>
	);
};

export default PromotionsModal;
