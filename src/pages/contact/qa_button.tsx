import { useState, useEffect, FC } from "react";

export interface qaButtonProps {
	question: string;
	answer: string;
}

export const QaButton: FC<qaButtonProps> = (props) => {
	const [showModal, setShowModal] = useState(false);

	const handleOpenModal = () => {
		setShowModal(!showModal);
	};

	useEffect(() => {
		setShowModal(false);
	}, [props]);

	return (
		<div className="w-full pb-[10px] pt-[30px] text-center font-custom text-regular font-bold text-fangarde-black">
			<button
				onClick={handleOpenModal}
				className={"w-full border-b-[3px] border-medium-blue hover:cursor-pointer hover:border-light-blue"}
			>
				{props.question}
			</button>
			{showModal && <button className={"w-full rounded-b bg-fangarde-light-gray p-[5px]"}>{props.answer}</button>}
		</div>
	);
};
