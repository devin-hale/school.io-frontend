import {
	DescriptionRounded,
	GroupsRounded,
	ManageAccountsRounded,
	FaceRounded,
	ChatRounded,
	DirectionsRunRounded,
	ArticleRounded,
	CorporateFareRounded,
	SettingsRounded,
} from '@mui/icons-material';

interface IProps {
	iconType: string;
}

const iconTypes = {
		[`DescriptionRounded`]: (): JSX.Element => <DescriptionRounded />, 
		[`GroupsRounded`]: (): JSX.Element => <GroupsRounded />,
		[`ManageAccountsRounded`]: (): JSX.Element => <ManageAccountsRounded />,
		[`FaceRounded`]: (): JSX.Element => <FaceRounded />,
		[`ChatRounded`]: (): JSX.Element => <ChatRounded />,
		[`DirectionsRunRounded`]: (): JSX.Element => <DirectionsRunRounded />,
		[`ArticleRounded`]: (): JSX.Element => <ArticleRounded />,
		[`CorporateFareRounded`]: (): JSX.Element => <CorporateFareRounded />,
		[`SettingsRounded`]: (): JSX.Element => <SettingsRounded />,
	};


export default function PermIcon(props: IProps): JSX.Element {
		// @ts-ignore
		return iconTypes[`${props.iconType}`]();
}
