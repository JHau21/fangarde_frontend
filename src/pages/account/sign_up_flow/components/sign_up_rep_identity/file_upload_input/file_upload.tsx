import React, { useState } from "react";

import styles from "./file_upload.module.css";
import common from "../../../../../../common/css/common.module.css";

import color_palette from "../../../../../../common/types/colors";

type Props = {
	header: string;
	label: string;
	onUpload: Function;
};

const FileUpload = ({ header, label, onUpload }: Props) => {
	const [file_uploaded, set_file_uploaded] = useState<string>("");

	return (
		<div className={`${styles.root} ${common.common_bold}`}>
			<div className={styles.upload_container}>
				<p>{header}</p>
				<label
					htmlFor={header}
					style={{
						color: color_palette.dark_blue,
					}}
				>
					{label}
				</label>
			</div>
			<div className={styles.upload_container}>
				<input
					id={header}
					className={styles.file_upload}
					type="file"
					accept="image/JPEG, image/PNG, image/JPG, image/PDF"
					onChange={(event) => {
						// need this conditional to appease the holy and benevolent typescript gods. May their many blessings bring us good fortune
						if (event.target.files) {
							const file = event.target.files[0];

							set_file_uploaded(file.name ? file.name : "");

							onUpload(file);
						}
					}}
				/>
				<p className={styles.file_name} style={{ color: color_palette.gray }}>
					{file_uploaded === "" ? "No file selected." : file_uploaded}
				</p>
			</div>
		</div>
	);
};

export default FileUpload;
