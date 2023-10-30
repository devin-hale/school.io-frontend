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
import { useState } from 'react';
import PageLoader from '../../_components/pageLoader';
import StudentGrid from '../../_components/studentGrid/studentGrid';
import UnenrollStudentModal from '../../students/[studentId]/_components/unenrollStudents';

export default function ClassInstancePage({
	params,
}: {
	params: { classId: string };
}): JSX.Element {
	const router: AppRouterInstance = useRouter();
	const dispatch: Dispatch<any> = useAppDispatch();
	const [loading, setLoading] = useState<boolean>(true);

	const [addStudentOpen, setAddStudentOpen] = useState<boolean>(false);
	const [removeStudentOpen, setRemoveStudentOpen] = useState<boolean>(false);

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
			</Paper>
		)
	);

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

	useEffect(() => {
		if (userState.token!) {
			dispatch(
				getClassInfo({ token: userState.token!, classId: params.classId })
			);
		}
	},[userState.token]);

	const handleBack = (): void => {
		router.push(`/dashboard/classes`);
	};

	return (
		<>
			{classInstance.loading || loading ? (
				<PageLoader />
			) : (
				<>
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
					</Paper>
					<StudentGrid
						students={studentState.classStudents.students}
						type='userClass'
						sourceId={params.classId}
						setRemoveStudentOpen={setRemoveStudentOpen}
						removeStudentOpen={removeStudentOpen}
					/>
				</>
			)}
		</>
	);
}
