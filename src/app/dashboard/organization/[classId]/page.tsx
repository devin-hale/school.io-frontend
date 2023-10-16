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
	EditRounded,
} from '@mui/icons-material';
import DeleteClassModal from './_components/deleteConfirm';
import AddTeacherModal from './_components/addTeacherModal';
import { useState } from 'react';
import PageLoader from '../../_components/pageLoader';
import RemoveTeacherModal from './_components/removeTeacherConfirmation';
import StudentGrid from '../../_components/studentGrid/studentGrid';
import EditClassModal from './_components/editClass';
import AddStudentToClassModal from './_components/addStudent';

export default function ClassInstancePage({
	params,
}: {
	params: { classId: string };
}): JSX.Element {
	const router: AppRouterInstance = useRouter();
	const dispatch: Dispatch<any> = useAppDispatch();
	const [loading, setLoading] = useState<boolean>(true);

	const [deleteOpen, setDeleteOpen] = useState(false);

	const [editClassOpen, setEditClassOpen] = useState<boolean>(false);

	const [addTeacherOpen, setAddTeacherOpen] = useState(false);
	const [removeTeacherOpen, setRemoveTeacherOpen] = useState(false);
	const [removingTeacher, setRemovingTeacher] = useState({
		userId: '',
		name: '',
	});
	const [addStudentOpen, setAddStudentOpen] = useState<boolean>(false);

	useEffect(() => { }, [addTeacherOpen, addStudentOpen]);

	const [optionsAnchor, setOptionsAnchor] = useState<null | HTMLElement>(null);
	const optionsOpen: boolean = Boolean(optionsAnchor);


	const userState: UserState = useSelector((state: RootState) => state.user);
	const userData = useSelector((state: RootState) => state.userData);
	const modifyState = useSelector((state: RootState) => state.classModify);
	const classInstance: ClassInfoState = useSelector(
		(state: RootState) => state.classInstance.classInstance
	);
	const studentState = useSelector((state: RootState) => state.students);

	useEffect(() => {
		dispatch(
			getClassStudents({ token: userState.token!, classId: params.classId })
		);
	}, [userState.token, params.classId]);

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
		if (userState.token && !editClassOpen) {
			dispatch(
				getClassInfo({ classId: params.classId, token: userState.token! })
			);
			dispatch(
				getOrgUsers({ orgId: userState.userInfo.org!, token: userState.token })
			);
		}
	}, [
		modifyState.addTeacher.complete,
		modifyState.removeTeacher.complete,
		modifyState.edit.complete,
		editClassOpen
	]);

	useEffect(() => {
		if (classInstance.loading) setLoading(true);
		else setLoading(false);
	}, [classInstance.loading]);

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
			{classInstance.loading || loading ? (
				<PageLoader />
			) : (
				<>
					<AddStudentToClassModal open={addStudentOpen} setOpen={setAddStudentOpen} currentStudents={studentState.classStudents.students} classId={params.classId} orgId={userState.userInfo.org!} />
					<EditClassModal
						open={editClassOpen}
						setOpen={setEditClassOpen}
						classInfo={{
							classId: params.classId,
							className: classInstance.classInfo!.name,
							gradeLevel: classInstance.classInfo!.grade_level,
							subject: classInstance.classInfo!.subject!,
						}}
					/>
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
								<div className='flex flex-row flex-wrap items-center justify-evenly m-1'>
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
							<MenuItem onClick={() => setEditClassOpen(true)}>
								<EditRounded className='mr-2' /> Edit Details
							</MenuItem>
							<MenuItem onClick={() => setAddTeacherOpen(true)}>
								<PersonAddRounded className='mr-2' /> Add Teacher
							</MenuItem>
							<Divider />
							<MenuItem onClick={() => setDeleteOpen(true)}>
								<DeleteRounded className='mr-2' /> Delete Class
							</MenuItem>
						</Menu>
					</Paper>
					<StudentGrid
						students={studentState.classStudents.students}
						type='class'
						sourceId={params.classId}
					/>
				</>
			)}
		</>
	);
}
