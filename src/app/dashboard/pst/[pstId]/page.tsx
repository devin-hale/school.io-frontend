'use client';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
	Paper,
	Card,
	Divider,
	CircularProgress,
	ListItem,
	ListItemButton,
	Button,
} from '@mui/material';
import { useAppDispatch } from '@/app/hooks';
import { RootState } from '@/redux/store/store';
import { getPstInstance } from '@/redux/slices/pst/pstSlice';
import EditPSTHeaderModal from './_components/editHeaderModal';
import EditWeekModal from './_components/editWeekModal';
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
dayjs.extend(weekday);

interface IPSTWeek {
	weekNo: number;
	dates: string;
	attendance: {
		monday: string;
		tuesday: string;
		wednesday: string;
		thursday: string;
		friday: string;
	};
	tier1: {
		documentation: string[];
		standards: string[];
	};
	tier2: string[];
	parentComm: string[];
	progressMonitor: string[];
}

export default function PSTIdPage({
	params,
}: {
	params: { pstId: string };
}): JSX.Element {
	const dispatch = useAppDispatch();
	const user = useSelector((state: RootState) => state.user);
	const pstGet = useSelector((state: RootState) => state.pst);
	const pstInstance = pstGet.pstInstance.content;
	const pstModify = useSelector((state: RootState) => state.pstModify);

	const [editHeaderModal, setEditHeaderModal] = useState(false);
	const [editWeekModal, setEditWeekModal] = useState<boolean>(false);
	const [selectedWeek, setSelectedWeek] = useState<IPSTWeek | null>(null);

	const handleSelectWeek = (week: IPSTWeek) => {
		setSelectedWeek({
			...week,
		});
	};

	useEffect(() => {
		if (user.token! && !pstModify.editHeader.loading && !pstModify.editHeader.loading) {
			dispatch(
				getPstInstance({ token: user.token!, params: { pstId: params.pstId } })
			);
		}
	}, [user.token, pstModify.editHeader.loading, pstModify.editWeek.loading]);

	const pstWeekList = pstInstance
		? pstInstance.weeks.map((week: any) => (
				<ListItem key={week.weekNo}>
					<Card
						elevation={3}
						className='p-2'
					>
						<header>
							<Button
								className='float-right'
								type='button'
								onClick={() => {
									handleSelectWeek(week);
									setEditWeekModal(true);
								}}
							>
								Edit Week
							</Button>
							<div>
								<strong className='underline'>Week Number:</strong>
								{` ${week.weekNo}`}
							</div>
							<div>
								<strong className='underline'>Dates:</strong>
								{` ${week.dates}`}
							</div>
						</header>
						<div>
							<strong className='underline'>Attendance:</strong>
							<div className='flex flex-row flex-wrap'>
								<Card
									elevation={3}
									className='p-1 m-1 w-[150px]'
								>
									<strong className='underline'>Monday:</strong>
									<p>
										{week.attendance.monday ?? 'N/A' }
									</p>
								</Card>
								<Card
									elevation={3}
									className='p-1 m-1 w-[150px]'
								>
									<strong className='underline'>Tuesday:</strong>
									<p>
										{week.attendance.monday !== ''
											? week.attendance.tuesday
											: 'N/A'}
									</p>
								</Card>
								<Card
									elevation={3}
									className='p-1 m-1 w-[150px]'
								>
									<strong className='underline'>Wednesday:</strong>
									<p>
										{week.attendance.monday !== ''
											? week.attendance.wednesday
											: 'N/A'}
									</p>
								</Card>
								<Card
									elevation={3}
									className='p-1 m-1 w-[150px]'
								>
									<strong className='underline'>Thursday:</strong>
									<p>
										{week.attendance.monday !== ''
											? week.attendance.thursday
											: 'N/A'}
									</p>
								</Card>
								<Card
									elevation={3}
									className='p-1 m-1 w-[150px]'
								>
									<strong className='underline'>Friday:</strong>
									<p>
										{week.attendance.friday ?? 'N/A' }
									</p>
								</Card>
							</div>
						</div>
						<div>
							<strong className='underline'>Tier 1 Documentation:</strong>
							<div>
								{week.tier1.documentation.map((doc: any) => (
									<p key={doc}>{doc}</p>
								))}
							</div>
							<strong className='underline'>Standards:</strong>
							<div>
								{week.tier1.standards.map((standard: any) => (
									<p key={standard}> {standard}</p>
								))}
							</div>
						</div>
						<div>
							<strong className='underline'>Tier 2 Documentation:</strong>
							<div>
								{week.tier2.map((comm: any) => (
									<p key={comm.length}> {comm}</p>
								))}
							</div>

						</div>
						<div>
							<strong className='underline'>Parent Communication:</strong>
							<div>
								{week.parentComm.map((comm: any) => (
									<p key={comm.length}> {comm}</p>
								))}
							</div>
						</div>
						<div>
							<strong className='underline'>Progress Monitoring</strong>
							<div>
								{week.progressMonitor.map((prog: any) => (
									<p key={prog.length}> {prog}</p>
								))}
							</div>
						</div>
					</Card>
				</ListItem>
		  ))
		: [];

	return (
		<>
			{pstGet.pstInstance.content && (
				<EditPSTHeaderModal
					open={editHeaderModal}
					setOpen={setEditHeaderModal}
					headerInfo={{
						pstId: pstInstance._id,
						schoolYear: pstInstance.header.schoolYear,
						gradingPeriod: pstInstance.header.gradingPeriod,
						studentName: pstInstance.student
							? `${pstInstance.student.first_name} ${pstInstance.student.last_name}`
							: '',
						interventionType: pstInstance.header.intervention_type,
						west_virginia_phonics: pstInstance.header.west_virginia_phonics,
						progress_monitoring_goal:
							pstInstance.header.progress_monitoring_goal,
					}}
				/>
			)}
			{pstGet.pstInstance.content && selectedWeek && (
				<EditWeekModal
					open={editWeekModal}
					setOpen={setEditWeekModal}
					pstId={params.pstId}
					weekInfo={selectedWeek}
				/>
			)}
			{!pstGet.pstInstance.content ? (
				<CircularProgress />
			) : (
				<Paper className='p-2'>
					<Card className='p-2 m-2'>
						<h2>
							<strong className='underline'>Documenting Teacher:</strong>
							{` ${pstInstance.owner.last_name}, ${pstInstance.owner.first_name}`}
						</h2>

						<h2>
							<strong className='underline'>Student Name:</strong>
							{pstInstance.student
								? ` ${pstInstance.student.first_name}, ${pstInstance.student.last_name}`
								: ''}
						</h2>
					</Card>
					<Card className='p-2 m-2 flex flex-row flex-wrap'>
						<div className='mr-5'>
							<h2>
								<strong className='underline'>School Year:</strong>
								{` ${pstInstance.header.schoolYear}`}
							</h2>
							<h2>
								<strong className='underline'>Grading Period:</strong>
								{` ${pstInstance.header.gradingPeriod}`}
							</h2>
							<h2>
								<strong className='underline'>Intervention Type:</strong>
								{` ${pstInstance.header.intervention_type}`}
							</h2>
						</div>
						<div>
							<h2>
								<strong className='underline'> West Virginia Phonics:</strong>
								{` ${pstInstance.header.west_virginia_phonics}`}
							</h2>
							<h2>
								<strong className='underline'>Progress Monitoring Goal:</strong>
								{` ${pstInstance.header.progress_monitoring_goal}`}
							</h2>
						</div>
						<Button
							className='bg-green-400 text-white m-auto'
							type='button'
							variant='contained'
							onClick={() => setEditHeaderModal(true)}
						>
							Edit
						</Button>
					</Card>
					<Card className='p-2 m-2'>{pstWeekList}</Card>
				</Paper>
			)}
		</>
	);
}
