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
	CardHeader,
	CardContent,
	CardActions,
	Typography,
	Chip,
} from '@mui/material';
import {
	SettingsRounded,
	EditRounded,
	DeleteRounded
} from '@mui/icons-material';
import { useState } from 'react';
import { getStudentInstance } from '@/redux/slices/students/studentsSlice';
import PageLoader from '../../_components/pageLoader';
import EditStudentModal from './_components/editStudentModal';
import DeleteStudentModal from './_components/deleteConfirm';

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
	const modifyStudentState = useSelector(
		(state: RootState) => state.studentsModify
	);
	const studentInstance = studentState.studentInstance.student;

	const [loading, setLoading] = useState<boolean>(true);

	const [editStudentModalOpen, setEditStudentModalOpen] =
		useState<boolean>(false);

	const [deleteStudentModalOpen, setDeleteStudentModalOpen] = useState<boolean>(false);

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
		if (userState.token) {
			dispatch(
				getStudentInstance({
					token: userState.token!,
					studentId: params.studentId,
				})
			);
		}
	}, [modifyStudentState.editInfo.complete]);

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

	return (
		<>
			{studentState.studentInstance.loading || loading ? (
				<PageLoader />
			) : (
				<>
					<DeleteStudentModal open={deleteStudentModalOpen} setOpen={setDeleteStudentModalOpen} studentId={params.studentId} />
					<EditStudentModal
						open={editStudentModalOpen}
						setOpen={setEditStudentModalOpen}
						studentInfo={{
							studentId: params.studentId,
							first_name: studentInstance?.first_name ?? '',
							last_name: studentInstance?.last_name ?? '',
							grade_level: studentInstance?.grade_level.toString() ?? '',
							gifted: studentInstance?.gifted ?? false,
							retained: studentInstance?.retained ?? false,
							sped: studentInstance?.sped ?? false,
							english_language_learner:
								studentInstance?.english_language_learner ?? false,
						}}
					/>
					<Paper className='p-1'>
						<Card
							className='m-2'
							variant='elevation'
							elevation={3}
						>
							<CardContent className='flex flex-row flex-wrap justify-between w-full items-center'>
								<Typography className='mr-[50px]'>
									<strong className='underline'>Student Name:</strong>
									{` ${studentInstance?.first_name} ${studentInstance?.last_name}`}
								</Typography>
								<Typography className='mr-[50px]'>
									<strong className='underline'>Grade:</strong>
									{` ${studentInstance?.grade_level}`}
								</Typography>
								<div className='flex flex-row flex-wrap'>
									{studentInstance?.gifted ? (
										<Chip
											className='bg-blue-500 m-1 text-white drop-shadow-md'
											label='Gifted'
										/>
									) : null}
									{studentInstance?.retained ? (
										<Chip
											className='bg-orange-500 m-1 text-white drop-shadow-md'
											label='Retained'
										/>
									) : null}
									{studentInstance?.sped ? (
										<Chip
											className='bg-yellow-500 m-1 text-white drop-shadow-md'
											label='SpEd'
										/>
									) : null}
									{studentInstance?.english_language_learner ? (
										<Chip
											className='bg-emerald-500 m-1 text-white drop-shadow-md'
											label='ELL'
										/>
									) : null}
								</div>
								<IconButton
									className='justify-self-end'
									sx={{ height: 40, width: 40 }}
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
									<MenuItem onClick={() => setEditStudentModalOpen(true)}>
										<EditRounded className='mr-2' /> Edit Student
									</MenuItem>
									<Divider />
<MenuItem onClick={() => setDeleteStudentModalOpen(true)}>
										<DeleteRounded className='mr-2' /> Delete Student
									</MenuItem>

									
								</Menu>
							</CardContent>
						</Card>
					</Paper>
				</>
			)}
		</>
	);
}
