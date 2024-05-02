import React from "react";

import CheckBox from "components/check_box";

type Props = {
	selected_organization: Organization;
	opt_in: boolean;
	set_opt_in: Function;
	primary_color?: string;
	secondary_color?: string;
};

const OptInSection: React.FC<Props> = ({ selected_organization, opt_in, set_opt_in, primary_color, secondary_color }) => {
	if (selected_organization?.request_marketing_communications?.requested) {
		return (
			<div className="mb-[30px] mt-[10px] flex min-h-[30px] max-w-[100%] flex-col items-start md:w-[460px]">
				<CheckBox
					checked={opt_in}
					label={
						selected_organization?.request_marketing_communications?.custom_message === "" ||
						!selected_organization?.request_marketing_communications?.custom_message
							? `I would like to receive email marketing communications from ${selected_organization.name}!`
							: selected_organization?.request_marketing_communications?.custom_message
					}
					onClick={() => set_opt_in(!opt_in)}
					default_color={primary_color}
					hover_color={secondary_color}
					active_color={primary_color}
				/>
			</div>
		);
	} else return null;
};

export default OptInSection;
