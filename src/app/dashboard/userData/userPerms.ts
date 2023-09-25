export interface userFeature {
	name: string;
	userTypes: string[];
}

const features: userFeature[] = [
	{
		name: 'Classes',
		userTypes: ['Basic', 'Admin', 'Staff'],
	},

	{
		name: 'Communication',
		userTypes: ['Basic', 'Admin', 'Staff'],
	},

	{
		name: 'Incidents',
		userTypes: ['Basic', 'Admin', 'Staff'],
	},
	{
		name: 'PST',
		userTypes: ['Basic', 'Admin', 'Staff'],
	},
];

const tools: userFeature[] = [
	{ name: 'Users', userTypes: ['Admin', 'Staff'] },
	{
		name: 'Students',
		userTypes: ['Admin', 'Staff'],
	},
	{
		name: 'Organization',
		userTypes: ['Admin', 'Staff'],
	},
	{ name: 'App Settings', userTypes: ['Basic', 'Admin', 'Staff'] },
];

export { features, tools };
