'use client';
import { useRouter } from 'next/navigation';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store/store';
import { Dispatch, useEffect } from 'react';
import { useAppDispatch } from '@/app/hooks';
import { UserState } from '@/redux/slices/user/userSlice';
import {
	Paper,
	Button,
	Menu,
	MenuItem,
	IconButton,
	Divider,
	Card,
	CardContent,
	Typography,
	Chip,
} from '@mui/material';
import {
	SettingsRounded,
	EditRounded,
	DeleteRounded,
	GroupAdd,
	ArrowLeftRounded,
} from '@mui/icons-material';
import { useState } from 'react';
import { getStudentInstance } from '@/redux/slices/students/studentsSlice';
import PageLoader from '@/app/dashboard/_components/pageLoader';
import ClassesGrid from '@/app/dashboard/_components/classesGrid/classesGrid';

export default function ClassInstancePage({
	params,
}: {
	params: { studentId: string };
}): JSX.Element {
	const router: AppRouterInstance = useRouter();
	const dispatch: Dispatch<any> = useAppDispatch();

	const [optionsAnchor, setOptionsAnchor] = useState<null | HTMLElement>(null);
	const optionsOpen: boolean = Boolean(optionsAnchor);

	const userState: UserState = useSelector((state: RootState) => state.user);

	const studentState = useSelector((state: RootState) => state.students);
	const studentInstance = studentState.studentInstance.student;

	const [loading, setLoading] = useState<boolean>(true);

	const [addClassOpen, setAddClassOpen] = useState<boolean>(false);
	const [removeClassOpen, setRemoveClassOpen] = useState<boolean>(false);

	useEffect(() => {
		if (userState.token) {
			dispatch(
				getStudentInstance({
					token: userState.token!,
					studentId: params.studentId,
				})
			);
		}
	}, [userState.token, params.studentId]);

	useEffect(() => {
		if (!removeClassOpen) {
			dispatch(
				getStudentInstance({
					token: userState.token!,
					studentId: params.studentId,
				})
			);
		}
	}, [removeClassOpen]);
	useEffect(() => {
		if (!addClassOpen) {
			dispatch(
				getStudentInstance({
					token: userState.token!,
					studentId: params.studentId,
				})
			);
		}
	}, [addClassOpen]);

	useEffect(() => {
		if (studentState.studentInstance.loading) setLoading(true);
		else setLoading(false);
	}, [studentState.studentInstance.loading]);

	const handleOptionsOpen = (e: React.MouseEvent<HTMLElement>): void => {
		setOptionsAnchor(e.currentTarget);
	};

	const handleOptionsClose = (): void => {
		setOptionsAnchor(null);
	};

	const handleBack = (): void => {
		router.push(`/dashboard/students`);
	};

	return (
		<>
			{studentState.studentInstance.loading || loading ? (
				<PageLoader />
			) : (
				<>
					<Button
						variant='text'
						onClick={handleBack}
					>
						<ArrowLeftRounded /> Back
					</Button>
					<Paper className='p0 max-w-[90vw]'>
						<Card
							className='m-1'
							variant='elevation'
							elevation={4}
						>
							<CardContent className='flex flex-row flex-wrap justify-between w-full items-center'>
								<Typography className='mr-[51px]'>
									<strong className='underline'>Student Name:</strong>
									{` ${studentInstance?.first_name} ${studentInstance?.last_name}`}
								</Typography>
								<Typography className='mr-[51px]'>
									<strong className='underline'>Grade:</strong>
									{` ${studentInstance?.grade_level}`}
								</Typography>
								<div className='flex flex-row flex-wrap'>
									{studentInstance?.gifted ? (
										<Chip
											className='bg-blue-400 m-1 text-white drop-shadow-md'
											label='Gifted'
										/>
									) : null}
									{studentInstance?.retained ? (
										<Chip
											className='bg-orange-400 m-1 text-white drop-shadow-md'
											label='Retained'
										/>
									) : null}
									{studentInstance?.sped ? (
										<Chip
											className='bg-yellow-400 m-1 text-white drop-shadow-md'
											label='SpEd'
										/>
									) : null}
									{studentInstance?.english_language_learner ? (
										<Chip
											className='bg-emerald-400 m-1 text-white drop-shadow-md'
											label='ELL'
										/>
									) : null}
								</div>
								<IconButton
									className='justify-self-end'
									sx={{ height: 41, width: 40 }}
									onClick={handleOptionsOpen}
									edge='start'
								>
									<SettingsRounded />
								</IconButton>
								<Menu
									anchorEl={optionsAnchor}
									open={optionsOpen}
									onClick={handleOptionsClose}
									onClose={handleOptionsClose}
									transformOrigin={{ horizontal: 'right', vertical: 'top' }}
									anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
								>
									<MenuItem onClick={() => { }}>
										<EditRounded className='mr-1' /> Option
									</MenuItem>
								</Menu>
							</CardContent>
						</Card>
						<Card className='m-2 p-3'>
							<div className='flex flex-row flexwrap justify-between m-1 p-1'>
								<Typography>
									<strong className='underline'>Classes:</strong>
								</Typography>
							</div>
							<div className='m-2'>
								<ClassesGrid
									type='userStudent'
									sourceId={studentState.studentInstance.student!._id}
									removeClassOpen={removeClassOpen}
									setRemoveClassOpen={setRemoveClassOpen}
								/>
							</div>
						</Card>
					</Paper>
				</>
			)}
		</>
	);
}
