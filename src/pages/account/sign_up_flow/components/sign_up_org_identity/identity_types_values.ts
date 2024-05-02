const company_structures: { [key: string]: string } = {
	"Select an option...": "",
	"Sole Proprietorship": "sole_proprietorship",
	"Single Member LLC": "single_member_llc",
	"Multi Member LLC": "multi_member_llc",
	"Private Partnership": "private_partnership",
	"Private Corporation": "private_corporation",
	"Unincorporated Association": "unincorporated_association",
	"Public Partnership": "public_partnership",
	"Public Corporation": "public_corporation",
};

const government_entity_structures: { [key: string]: string } = {
	"Select an option...": "",
	"Governmental Unit": "governmental_unit",
	"Government Instrumentality": "government_instrumentality",
	"Tax Exempt Government Instrumentality": "tax_exempt_government_instrumentality",
};

const non_profit_structures: { [key: string]: string } = {
	"Select an option...": "",
	"Incorporated Nonprofit": "incorporated_non_profit",
	"Unincorporated Nonprofit": "unincorporated_non_profit",
};
const individual_structures: { [key: string]: string } = {
	"Select an option...": "",
	Individual: "individual",
};

export const org_types_map: { [key: string]: string } = {
	Company: "company",
	Nonprofit: "non_profit",
	"Government Entity": "government_entity",
	Individual: "individual",
};

export const org_types_and_structures: {
	[key: string]: { [key: string]: string };
} = {
	company: company_structures,
	non_profit: non_profit_structures,
	government_entity: government_entity_structures,
	individual: individual_structures,
};

export const event_type_mcc_map: { [key: string]: string } = {
	"Select an option...": "",
	"University or College": "8220",
	"Charitable or Social Service Organization": "8398",
	"Venue or Entertainment Organization": "7929",
	"High School": "8211",
	"Bar or Brewery": "5813",
	"Sports Club": "7941",
};

export const rep_required = [
	"sole_proprietorship",
	"single_member_llc",
	"public_partnership",
	"public_corporation",
	"incorporated_non_profit",
	"unincorporated_non_profit",
	"governmental_unit",
	"government_instrumentality",
	"tax_exempt_government_instrumentality",
];

export const owner_and_rep_required = [
	"multi_member_llc",
	"private_corporation",
	"private_partnership",
	"unincorporated_association",
];

export const individual_required = ["individual"];
