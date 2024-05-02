export function BufferToImage(buffer: Buffer): string {
	return `data:image/jpg;base64` + new TextDecoder("utf-8").decode(new Uint8Array(buffer));
}

export const convertToBase64 = (file: any) => {
	return new Promise((resolve, reject) => {
		const fileReader = new FileReader();
		//   file = new Blob([file])
		fileReader.readAsDataURL(file);
		fileReader.onload = () => {
			resolve(fileReader.result);
		};
		fileReader.onerror = (error) => {
			reject(error);
		};
	});
};

export const validateUrl = (input: string): boolean => {
	const urlRegex = /^(ftp|http|https):\/\/[^ "]+\.\S+$/;
	return urlRegex.test(input);
};

export function roundDateToNearest30Minutes(date: Date) {
	const minutes = date.getMinutes();
	const roundedMinutes = Math.ceil(minutes / 30) * 30;

	date.setMinutes(roundedMinutes);
	date.setSeconds(0);
	date.setMilliseconds(0);

	return date;
}

export const format_number = (number: number) => {
	return number.toFixed(2).toLocaleString();
};
