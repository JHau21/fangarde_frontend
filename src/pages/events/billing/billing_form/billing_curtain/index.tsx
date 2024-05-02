import React from "react";

import color_palette from "common/types/colors";

type Props = {
	title: string;
	message?: string;
	open: boolean;
	set_open: Function;
	children: JSX.Element;
	primary_color: string | undefined;
};

const BillingCurtain: React.FC<Props> = ({ title, message, open, set_open, children, primary_color }) => {
	return (
		<div className={"my-[15px] flex w-full flex-col items-start"}>
			<div
				className={"flex w-full flex-row items-center justify-between hover:cursor-pointer"}
				style={{ borderBottom: `2px solid ${primary_color ?? color_palette.medium_blue}` }}
				onClick={() => set_open(!open)}
			>
				<h3 className={"m-0 text-sm-header"}>{title}</h3>
				<div
					className={"mr-[10px] h-[12px] w-[20px] bg-fangarde-black"}
					style={{
						clipPath: "polygon(50% 0%, 100% 100%, 78% 100%, 50% 40%, 22% 100%, 0% 100%)",
						rotate: open ? "180deg" : "0deg",
					}}
				/>
			</div>
			{message && <p className={"m-0 my-[10px] w-full break-normal"}>{message}</p>}
			<div className={open ? "mt-[10px] w-full" : "h-0 overflow-hidden"}>{children}</div>
		</div>
	);
};

export default BillingCurtain;
