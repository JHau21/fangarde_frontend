import styles from "./admin_header.module.css";

import { useUser } from "../../../../../state/useUser";

interface AdminHeaderProps {
	image: string;
}

const AdminHeader = ({ image }: AdminHeaderProps) => {
	const user = useUser((state) => state.user);
	return (
		<div
			className={
				"mb-[30px] mt-[50px] flex h-[176px] w-[100vw] flex-row items-center justify-center bg-gradient-to-tr from-violet-500 to-light-blue"
			}
		>
			<div className={styles.headerContent}>
				<h1 className={styles.greeting}>Hello {user.first_name}!</h1>
				{image !== "" && (
					<div className={styles.imageContainer}>
						{image !== "" && <img className={styles.image} src={image} alt={"header banner"} />}
					</div>
				)}
			</div>
		</div>
	);
};

export default AdminHeader;
