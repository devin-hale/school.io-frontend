'use client';
import { useRouter } from 'next/navigation';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';
import {
	getClassStudents,
	getClassInfo,
	ClassInstanceState,
	resetClassInstanceState,
	ClassInfoState,
	ClassStudentsState,
} from '@/redux/slices/classes/classInstanceSlice';
import { getOrgUsers } from '@/redux/slices/user/userDataSlice';
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
	Autocomplete,
	TextField,
	CircularProgress,
	Divider,
} from '@mui/material';
import {
	DeleteRounded,
	SettingsRounded,
	ArrowLeftRounded,
	Add,
	DoNotDisturbOnRounded,
	PersonAdd,
	PersonAddRounded,
} from '@mui/icons-material';
import DeleteClassModal from './_components/deleteConfirm';
import AddTeacherModal from './_components/addTeacherModal';
import { useState } from 'react';
import PageLoader from '../../_components/pageLoader';
import RemoveTeacherModal from './_components/removeTeacherConfirmation';

export default function ClassInstancePage({
	params,
}: {
	params: { classId: string };
}): JSX.Element {
	const router: AppRouterInstance = useRouter();
	const dispatch: Dispatch<any> = useAppDispatch();

	const [deleteOpen, setDeleteOpen] = useState(false);

	const [addTeacherOpen, setAddTeacherOpen] = useState(false);
	const [removeTeacherOpen, setRemoveTeacherOpen] = useState(false);
	const [removingTeacher, setRemovingTeacher] = useState({
		userId: '',
		name: '',
	});

	useEffect(() => {}, [addTeacherOpen]);

	const [optionsAnchor, setOptionsAnchor] = useState<null | HTMLElement>(null);
	const optionsOpen: boolean = Boolean(optionsAnchor);

	const userState: UserState = useSelector((state: RootState) => state.user);
	const userData = useSelector((state: RootState) => state.userData);
	const modifyState = useSelector((state: RootState) => state.classModify);
	const classInstance: ClassInfoState = useSelector(
		(state: RootState) => state.classInstance.classInstance
	);
	const classStudents: ClassStudentsState = useSelector(
		(state: RootState) => state.classInstance.classStudents
	);
	const classTeachers = classInstance.classInfo?.teachers.map(
		(teacher: any) => (
			<Paper
				elevation={1}
				key={teacher._id}
				className='flex flex-row items-center justify-center p-2'
			>
				<div>{`${teacher.last_name}, ${teacher.first_name}`}</div>
				<IconButton
					color='error'
					edge='end'
					onClick={() =>
						handleSetRemovingTeacher(
							teacher._id,
							`${teacher.first_name} ${teacher.last_name}`
						)
					}
				>
					<DoNotDisturbOnRounded sx={{ width: 15 }} />
				</IconButton>
			</Paper>
		)
	);

	useEffect(() => {
		if (userState.token) {
			dispatch(
				getClassInfo({ classId: params.classId, token: userState.token! })
			);
			dispatch(
				getOrgUsers({ orgId: userState.userInfo.org!, token: userState.token })
			);
		}
	}, [modifyState.addTeacher.complete, modifyState.removeTeacher.complete]);

	useEffect(() => {
		if (classInstance.classInfo && userState.token) {
			dispatch(
				getClassStudents({ classId: params.classId, token: userState.token! })
			);
		}
	}, [classInstance.classInfo]);

	const handleOptionsOpen = (e: React.MouseEvent<HTMLElement>): void => {
		setOptionsAnchor(e.currentTarget);
	};

	const handleOptionsClose = (): void => {
		setOptionsAnchor(null);
	};

	const handleBack = (): void => {
		router.push(`/dashboard/organization`);
	};

	const handleSetRemovingTeacher = (userId: string, name: string) => {
		setRemovingTeacher({ userId: userId, name: name });
		setRemoveTeacherOpen(true);
	};

	return (
		<>
			{classInstance.loading ? (
				<PageLoader />
			) : (
				<>
					<DeleteClassModal
						deleteClassModalOpen={deleteOpen}
						setDeleteClassModalOpen={setDeleteOpen}
						classId={params.classId}
					/>
					<AddTeacherModal
						open={addTeacherOpen}
						setOpen={setAddTeacherOpen}
						classId={classInstance.classInfo?._id!}
						teachers={classInstance.classInfo?.teachers!}
					/>
					<RemoveTeacherModal
						open={removeTeacherOpen}
						setOpen={setRemoveTeacherOpen}
						classId={classInstance.classInfo?._id!}
						userId={removingTeacher.userId}
						teacherName={removingTeacher.name}
					/>
					<Button
						variant='text'
						onClick={handleBack}
					>
						<ArrowLeftRounded /> Back
					</Button>
					<Paper
						elevation={2}
						className='m-2 p-3 flex justify-between'
					>
						<div>
							<p className='text-xl'>
								<strong>{classInstance.classInfo?.name}</strong>
							</p>
							<p>
								<strong>Subject: </strong>
								{classInstance.classInfo?.subject}
							</p>
							<div className='pb-1 flex flex-row items-center'>
								<strong className='pr-1'>Teacher(s): </strong>
								<div>
									{modifyState.addTeacher.loading ||
									modifyState.removeTeacher.loading ? (
										<CircularProgress color='secondary' />
									) : (
										classTeachers
									)}
								</div>
							</div>
						</div>
						<IconButton
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
							<MenuItem onClick={() => setAddTeacherOpen(true)}>
								<PersonAddRounded className='mr-2' /> Add Teacher
							</MenuItem>
							<Divider />
							<MenuItem onClick={() => setDeleteOpen(true)}>
								<DeleteRounded className='mr-2' /> Delete Class
							</MenuItem>
						</Menu>
					</Paper>
				</>
			)}
		</>
	);
}
