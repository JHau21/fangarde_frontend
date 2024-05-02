import { useNavigate, useLocation } from "react-router-dom";

type Props = {
	elements: Array<MenuElement>;
};

const HorizontalMenu = ({ elements }: Props) => {
	const navigate = useNavigate();
	let location = useLocation();

	const default_link: string =
		"text-black text-regular text-center font-bold decoration-none hover:cursor-pointer hover:bg-fangarde-light-gray hover:rounded-md hover:text-black h-[30px] w-[50%] pt-[4px]";
	const active_link: string =
		"text-white text-regular font-bold decoration-none text-center bg-medium-blue rounded-md h-[30px] w-[50%] pt-[4px]";

	return (
		<div className={"mb-[40px] flex flex-row items-center rounded-lg border-2 border-medium-blue"}>
			{elements.map(({ title, route }: MenuElement) => {
				return (
					<div className={location.pathname === route ? active_link : default_link} onClick={() => navigate(route)}>
						<p className={"font-custom text-regular font-bold"}>{title}</p>
					</div>
				);
			})}
		</div>
	);
};

export default HorizontalMenu;
