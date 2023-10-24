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
} from '@mui/material';
import { useAppDispatch } from '@/app/hooks';
import { RootState } from '@/redux/store/store';
import { getPstInstance } from '@/redux/slices/pst/pstSlice';

export default function PSTIdPage({
	params,
}: {
	params: { pstId: string };
}): JSX.Element {
	const dispatch = useAppDispatch();
	const user = useSelector((state: RootState) => state.user);
	const pstGet = useSelector((state: RootState) => state.pst);
	const pstInstance = pstGet.pstInstance.content;
	console.log(pstInstance);

	useEffect(() => {
		if (user.token!) {
			dispatch(
				getPstInstance({ token: user.token!, params: { pstId: params.pstId } })
			);
		}
	}, [user.token]);

	const pstWeekList = pstInstance
		? pstInstance.weeks.map((week: any) => (
				<ListItem key={week.weekNo}>
					<Card
						elevation={3}
						className='p-2'
					>
						<header>
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
										{week.attendance.monday !== ''
											? week.attendance.monday
											: 'N/A'}
									</p>
								</Card>
								<Card
									elevation={3}
									className='p-1 m-1 w-[150px]'
								>
									<strong className='underline'>Tuesday:</strong>
									<p>
										{week.attendance.monday !== ''
											? week.attendance.monday
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
											? week.attendance.monday
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
											? week.attendance.monday
											: 'N/A'}
									</p>
								</Card>
								<Card
									elevation={3}
									className='p-1 m-1 w-[150px]'
								>
									<strong className='underline'>Friday:</strong>
									<p>
										{week.attendance.monday !== ''
											? week.attendance.monday
											: 'N/A'}
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
						</div>
						<div>Parent Communication</div>
						<div>Progress Monitoring</div>
					</Card>
				</ListItem>
		  ))
		: [];

	return (
		<>
			{!pstGet.pstInstance.content ? (
				<CircularProgress />
			) : (
				<Paper className='p-2'>
					<Card className='p-2 m-2 flex flex-row flex-wrap'>
						<div className='mr-5'>
							<h2>
								<strong className='underline'>Documenting Teacher:</strong>
								{` ${pstInstance.owner.last_name}, ${pstInstance.owner.first_name}`}
							</h2>
							<h2>
								<strong className='underline'>School Year:</strong>
								{` ${pstInstance.header.schoolYear}`}
							</h2>
							<h2>
								<strong className='underline'>Grading Period:</strong>
								{` ${pstInstance.header.gradingPeriod}`}
							</h2>
							<h2>
								<strong className="underline">Intervention Type:</strong>
								{` ${pstInstance.header.intervention_type}`}
							</h2>
							<h2>
								<strong className='underline'>Student Name:</strong>
								{pstInstance.student
									? ` ${pstInstance.student.first_name}, ${pstInstance.student.last_name}`
									: ''}
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
					</Card>
					<Card className='p-2 m-2'>{pstWeekList}</Card>
				</Paper>
			)}
		</>
	);
}
