import jack from "../../common/headshots/Jack_Hau_Headshot.jpg";
import david from "../../common/headshots/David_Banda_Headshot.jpg";

const Founders = () => {
	return (
		<div
			className={
				"flex w-full flex-row items-center justify-around px-44 font-custom text-regular font-normal text-fangarde-black"
			}
		>
			<div className={"flex h-[325px] w-[38%] flex-col items-center rounded-lg border-4 border-dark-blue pb-2"}>
				<img
					className={"h-[63%] w-full rounded-t-lg object-cover object-top"}
					style={{ objectPosition: "100% 10%" }}
					src={david}
					alt={"David Pic"}
				/>
				<h1 className={"m-0 mt-5 h-[20px] w-[80%] p-0 text-center text-sm-header font-bold"}>David Banda</h1>
				<h2 className={"m-0 mt-5 h-[20px] w-[80%] p-0 text-center text-sm-header font-medium text-dark-blue"}>
					Chief Executive Officer
				</h2>
			</div>
			<div className={"flex h-[325px] w-[38%] flex-col items-center rounded-lg border-4 border-dark-blue bg-white pb-2"}>
				<img
					className={"h-[63%] w-full rounded-t-lg object-cover"}
					style={{ objectPosition: "100% 10%" }}
					src={jack}
					alt={"Jack Pic"}
				/>
				<h1 className={"m-0 mt-5 h-[20px] w-[80%] p-0 text-center text-sm-header font-bold"}>Jack Hau</h1>
				<h2 className={"m-0 mt-5 h-[20px] w-[80%] p-0 text-center text-sm-header font-medium text-dark-blue"}>
					Chief Technology Officer
				</h2>
			</div>
		</div>
	);
};
export default Founders;
