'use client';
import {
	Dialog,
	Alert,
	DialogTitle,
	Button,
	CircularProgress,
	Autocomplete,
	TextField,
	DialogContent
} from '@mui/material';
import { SetStateAction, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store/store';
import { Dispatch } from 'react';
import { useAppDispatch } from '@/app/hooks';
import modifyClass, {
	resetDeleteClass,
	deleteClass,
} from '@/redux/slices/classes/modifyClass';
import { useRouter } from 'next/navigation';
import {
	IAddStudentClass,
	addStudentClass,
	deleteStudent,
	resetAddClass,
	resetDeleteStudent,
} from '@/redux/slices/students/modifyStudentsSlice';
import { getOrgClasses } from '@/redux/slices/classes/classSlice';
import { IStudent } from '@/redux/slices/classes/classInstanceSlice';
import { userInfo } from 'os';
import { getOrgStudents, getStudentInstance } from '@/redux/slices/students/studentsSlice';

export interface IAddStudentToClassModal {
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
	classId: string;
	currentStudents: IStudent[];
	orgId: string;
}

export default function AddStudentToClassModal(props: IAddStudentToClassModal): JSX.Element {
	const dispatch: Dispatch<any> = useAppDispatch();
	const router = useRouter();
	const user = useSelector((state: RootState) => state.user);
	const modifyStudentState = useSelector(
		(state: RootState) => state.studentsModify.delete
	);
	const orgClasses = useSelector((state: RootState) => state.class);
	const orgStudents = useSelector((state: RootState) => state.students.orgStudents)

	const [selectedStudent, setSelectedStudent] = useState<studentOption | null>(null);

	useEffect(() => {
		dispatch(getOrgStudents({ token: user.token!, orgId: props.orgId }));
	}, []);

	function handleClose(): void {
		dispatch(resetAddClass());
		setSelectedStudent(null);
		props.setOpen(false);
	}

	const handleDlgClose = (event: object, reason: string) => {
		if (reason && reason == 'backdropClick') {
			return;
		}
		handleClose();
	};

	const handleSave = async (): Promise<void> => {
		let dispatchBody: IAddStudentClass = {
			token: user.token!,
			params: {
				studentId: selectedStudent!.studentId,
				classId: props.classId,
			},
		};
		dispatch(addStudentClass(dispatchBody))
		handleClose();
	};

	interface studentOption {
		label: string;
		studentId: string;
	}

	let studentOptions: studentOption[] = [...orgStudents.students]
		.filter(
			(orgStudent) =>
				!props.currentStudents.some(
					(studentClass) => studentClass._id === orgStudent._id
				)
		)
		.map((orgStudent) => ({ label: `${orgStudent.first_name} ${orgStudent.last_name}`, studentId: orgStudent._id! }));

	return (
		<>
			<Dialog
				open={props.open}
				onClose={handleDlgClose}
				className='flex flex-nowrap justify-center'
				disableEscapeKeyDown
			>
				<DialogContent>
					<DialogTitle>Enroll Student:</DialogTitle>
					<Autocomplete
						id='classes-search'
						options={studentOptions}
						onChange={(e, value) => setSelectedStudent(value)}
						renderInput={(params) => (
							<TextField
								{...params}
								label='Search Students...'
							/>
						)}
					/>
					<div className='m-2 mt-4'>
						<Button
							variant='contained'
							color='success'
							className='bg-green-400 text-white mr-4'
							disabled={!selectedStudent ? true : false}
							onClick={handleSave}
						>
							Enroll
						</Button>
						<Button
							variant='contained'
							color='error'
							className='bg-red-400 text-white'
							onClick={handleClose}
						>
							Cancel
						</Button>
					</div>
				</DialogContent>

			</Dialog>
		</>
	);
}
