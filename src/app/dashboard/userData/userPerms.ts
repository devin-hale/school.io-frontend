export interface userFeature {
	name: string;
	userTypes: string[];
	icon: string;
}

const features: userFeature[] = [
	{
		name: 'Classes',
		userTypes: ['Basic', 'Admin', 'Staff'],
		icon: 'GroupsRounded',
	},

	{
		name: 'Communication',
		userTypes: ['Basic', 'Admin', 'Staff'],
		icon: 'ChatRounded',
	},

	{
		name: 'Incidents',
		userTypes: ['Basic', 'Admin', 'Staff'],
		icon: 'DirectionsRunRounded'
	},
	{
		name: 'PST',
		userTypes: ['Basic', 'Admin', 'Staff'],
		icon: 'ArticleRounded'
	},
];

const tools: userFeature[] = [
	{ name: 'Users', userTypes: ['Admin', 'Staff'], icon: 'ManageAccountsRounded' },
	{
		name: 'Students',
		userTypes: ['Admin', 'Staff'],
		icon: 'FaceRounded',
	},
	{
		name: 'Organization',
		userTypes: ['Admin', 'Staff'],
		icon: 'CorporateFareRounded'
	},
	{ name: 'App Settings', userTypes: ['Basic', 'Admin', 'Staff'], icon: "SettingsRounded" },
];

export { features, tools };
