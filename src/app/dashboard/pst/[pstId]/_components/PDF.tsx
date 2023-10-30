import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

interface PSTHeaderInterface {
	student: string;
	schoolYear: string;
	gradingPeriod: string;
	intervention_type: 'Reading' | 'Math' | 'Behavior';
	west_virginia_phonics: boolean;
	readingIXL: string;
	progress_monitoring_goal: string;
}

interface PSTTier1Interface {
	documentation: string[];
	standards: string[];
}

interface PSTWeekInterface {
	weekNo: number;
	dates: string;
	attendance: {
		monday: string;
		tuesday: string;
		wednesday: string;
		thursday: string;
		friday: string;
	};
	tier1: PSTTier1Interface;
	tier2: string[];
	parentComm: string[];
	progressMonitor: string[];
}

interface PSTInterface {
	_id: string;
	owner: any | null;
	org: string;
	class: string;
	student: any | null;
	access: string[];
	header: PSTHeaderInterface;
	weeks: PSTWeekInterface[];
}
const styles = StyleSheet.create({
	page: {
		flexDirection: 'column',
		alignItems: 'center',
		margin: '10px',
		fontSize: '12px',
	},
	titleText: {
		fontSize: '14px',
	},
	headerContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'flex-start',
		alignItems: 'center',
		width: '90%',
		padding: '10px',
		border: '1px solid black',
	},
	headerText: {
		flexDirection: 'row',
		marginRight: '10px',
		margin: '5px',
	},
	indicator: {
		textDecoration: 'underline',
		fontWeight: 'bold',
	},
	weekContainer: {
		width: '100%',
		flexDirection: 'row',
		alignItems: 'center',
	},
	weekBox: {
		flexDirection: 'column',
		alignItems: 'center',
		height: '95px',
		width: '25px',
		border: '1px solid black',
		padding: '3px',
	},
	weekBoxHeaderCont: {
		marginTop: '5px',
		flexDirection: 'row',
		width: '100%',
		alignItems: 'center',
	},
	weekBoxHeaderNo: {
		border: '1px solid black',
		height: '20px',
		alignItems: 'center',
		fontSize: '9px',
		width: '25px',
		flexDirection: 'row',
		justifyContent: 'center',
	},
	weekBoxHeaderDate: {
		border: '1px solid black',
		height: '20px',
		alignItems: 'center',
		fontSize: '9px',
		width: '55px',
		flexDirection: 'row',
		justifyContent: 'center',
	},
	weekBoxHeaderDay: {
		border: '1px solid black',
		height: '20px',
		alignItems: 'center',
		fontSize: '9px',
		width: '40px',
		flexDirection: 'row',
		justifyContent: 'center',
	},
	weekBoxHeaderDocu: {
		border: '1px solid black',
		height: '20px',
		alignItems: 'center',
		fontSize: '8px',
		width: '85px',
		flexDirection: 'row',
		justifyContent: 'center',
	},
	weekBoxHeaderPaPro: {
		border: '1px solid black',
		height: '20px',
		alignItems: 'center',
		fontSize: '7px',
		width: '65px',
		flexDirection: 'row',
		justifyContent: 'center',
	},

	weekBoxDatesCont: {
		flexDirection: 'column',
		alignItems: 'center',
		height: '95px',
		width: '55px',
		border: '1px solid black',
		padding: '2px',
	},
	weekBoxDocu: {
		flexDirection: 'column',
		alignItems: 'flex-start',
		justifyContent: 'space-evenly',
		height: '95px',
		width: '85px',
		border: '1px solid black',
		fontSize: '8px',
		padding: '4px',
		fontWeight: 'extrabold',
	},
	weekBoxParentProgress: {
		flexDirection: 'column',
		alignItems: 'flex-start',
		height: '95px',
		width: '65px',
		border: '1px solid black',
		fontSize: '8px',
		padding: '4px',
		fontWeight: 'extrabold',
	},
	weekBoxDay: {
		flexDirection: 'column',
		alignItems: 'center',
		height: '95px',
		width: '40px',
		border: '1px solid black',
		padding: '3px',
		fontSize: '5px',
	},
	weekBoxBoldText: {
		margin: 'auto',
		fontSize: '13px',
		fontWeight: 'bold',
	},
	weekBoxText: {
		margin: 'auto',
		fontSize: '9px',
	},
	weekBoxDate: {
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		margin: 'auto',
		fontSize: '9px',
	},
	weekBoxStandards: {
		flexDirection: 'row',
		}
});

interface IPSTPDF {
	data: PSTInterface;
}

export default function PSTPDF(props: IPSTPDF): JSX.Element {
	const WeekMap = [...props.data.weeks]
		.sort((a: PSTWeekInterface, b: PSTWeekInterface) =>
			a.weekNo < b.weekNo ? -1 : 1
		)
		.map((week: PSTWeekInterface, index: number) => (
			<View
				key={index}
				style={styles.weekContainer}
			>
				<View style={styles.weekBox}>
					<Text style={styles.weekBoxBoldText}>{week.weekNo}</Text>
				</View>
				<View style={styles.weekBoxDatesCont}>
					<View style={styles.weekBoxDate}>
						<Text>{week.dates.split(' to ')[0]}</Text>
						<Text>{' to '}</Text>
						<Text>{week.dates.split(' to ')[1]}</Text>
					</View>
				</View>
				<View style={styles.weekBoxDay}>
					<Text style={styles.weekBoxText}>{week.attendance.monday}</Text>
				</View>
				<View style={styles.weekBoxDay}>
					<Text style={styles.weekBoxText}>{week.attendance.tuesday}</Text>
				</View>
				<View style={styles.weekBoxDay}>
					<Text style={styles.weekBoxText}>{week.attendance.wednesday}</Text>
				</View>
				<View style={styles.weekBoxDay}>
					<Text style={styles.weekBoxText}>{week.attendance.thursday}</Text>
				</View>
				<View style={styles.weekBoxDay}>
					<Text style={styles.weekBoxText}>{week.attendance.friday}</Text>
				</View>
				<View style={styles.weekBoxDocu}>
					{week.tier1.documentation.map((doc: string, index: number) => (
						<Text key={index}>{`- ${doc}`}</Text>
					))}{' '}
					<View style={styles.weekBoxStandards}>
						{week.tier1.standards.map((std: string, index: number, arr) => (
							<Text key={index}>
								{std}
								{index < arr.length - 1 ? ', ' : null}
							</Text>
						))}
					</View>
				</View>
				<View style={styles.weekBoxDocu}>
					{week.tier2.map((doc: string, index: number) => (
						<Text key={index}>{`- ${doc}`}</Text>
					))}
				</View>
				<View style={styles.weekBoxParentProgress}>
					{week.parentComm.map((doc: string, index: number) => (
						<Text key={index}>{`- ${doc}`}</Text>
					))}
				</View>
				<View style={styles.weekBoxParentProgress}>
					{week.progressMonitor.map((doc: string, index: number) => (
						<Text key={index}>{`- ${doc}`}</Text>
					))}
				</View>
			</View>
		));

	return (
		<Document>
			<Page
				size={'A4'}
				style={styles.page}
			>
				<View style={styles.titleText}>
					<Text>PST Documentation</Text>
				</View>
				<View style={styles.headerContainer}>
					<View style={styles.headerText}>
						<Text style={styles.indicator}>Documenting Teacher:</Text>
						<Text>
							{' '}
							{props.data.owner.last_name}, {props.data.owner.first_name}
						</Text>
					</View>
					<View style={styles.headerText}>
						<Text style={styles.indicator}>Student Name:</Text>
						<Text>
							{' '}
							{props.data.student !== undefined
								? `${props.data.student.first_name} ${props.data.student.last_name}`
								: null}
						</Text>
					</View>
				</View>
				<View style={styles.headerContainer}>
					<View style={styles.headerText}>
						<Text style={styles.indicator}>School Year:</Text>
						<Text> {props.data.header.schoolYear}</Text>
					</View>
					<View style={styles.headerText}>
						<Text style={styles.indicator}>Grading Period:</Text>
						<Text> {props.data.header.gradingPeriod}</Text>
					</View>
					<View style={styles.headerText}>
						<Text style={styles.indicator}>Intervention Type:</Text>
						<Text> {props.data.header.intervention_type}</Text>
					</View>
					<View style={styles.headerText}>
						<Text style={styles.indicator}>West Virginia Phonics:</Text>
						<Text>
							{' '}
							{props.data.header.west_virginia_phonics ? 'Yes' : 'No'}
						</Text>
					</View>
					<View style={styles.headerText}>
						<Text style={styles.indicator}>Progress Monitoring Goal:</Text>
						<Text> {props.data.header.progress_monitoring_goal}</Text>
					</View>
				</View>
				<View style={styles.weekBoxHeaderCont}>
					<View style={styles.weekBoxHeaderNo}>
						<Text>Week</Text>
					</View>
					<View style={styles.weekBoxHeaderDate}>
						<Text>Dates</Text>
					</View>
					<View style={styles.weekBoxHeaderDay}>
						<Text>MON</Text>
					</View>
					<View style={styles.weekBoxHeaderDay}>
						<Text>TUE</Text>
					</View>
					<View style={styles.weekBoxHeaderDay}>
						<Text>WED</Text>
					</View>
					<View style={styles.weekBoxHeaderDay}>
						<Text>THU</Text>
					</View>
					<View style={styles.weekBoxHeaderDay}>
						<Text>FRI</Text>
					</View>
					<View style={styles.weekBoxHeaderDocu}>
						<Text>Tier 1 Documentation</Text>
					</View>
					<View style={styles.weekBoxHeaderDocu}>
						<Text>Tier 2 Documentation</Text>
					</View>
					<View style={styles.weekBoxHeaderPaPro}>
						<Text>Parent Communication</Text>
					</View>
					<View style={styles.weekBoxHeaderPaPro}>
						<Text>Progress Monitoring</Text>
					</View>
				</View>
				{WeekMap}
			</Page>
		</Document>
	);
}
