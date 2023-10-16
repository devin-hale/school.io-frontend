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
import { getStudentInstance } from '@/redux/slices/students/studentsSlice';

export interface IClassAddModalProps {
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
	student: IStudent;
	orgId: string;
}

export default function AddClassModal(props: IClassAddModalProps): JSX.Element {
	const dispatch: Dispatch<any> = useAppDispatch();
	const router = useRouter();
	const user = useSelector((state: RootState) => state.user);
	const modifyStudentState = useSelector(
		(state: RootState) => state.studentsModify.delete
	);
	const orgClasses = useSelector((state: RootState) => state.class);

	const [selectedClass, setSelectedClass] = useState<classOption | null>(null);

	useEffect(() => {
		dispatch(getOrgClasses({ token: user.token!, orgId: props.orgId }));
	}, []);

	function handleClose(): void {
		dispatch(resetAddClass());
		setSelectedClass(null);
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
				studentId: props.student._id,
				classId: selectedClass!.classId,
			},
		};
		await dispatch(addStudentClass(dispatchBody));
		handleClose();
	};

	interface classOption {
		label: string;
		classId: string;
	}

	let classOptions: classOption[] = [...orgClasses.classes]
		.filter(
			(orgClass) =>
				!props.student.classes!.some(
					(studentClass) => studentClass._id === orgClass._id
				)
		)
		.map((orgClass) => ({ label: orgClass.name, classId: orgClass._id! }));

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
					options={classOptions}
					onChange={(e, value) => setSelectedClass(value)}
					renderInput={(params) => (
						<TextField
							{...params}
							label='Search Classes...'
						/>
					)}
				/>
				<div className='m-2 mt-4'>
					<Button
						variant='contained'
						color='success'
						className='bg-green-400 text-white mr-4'
						disabled={!selectedClass ? true : false}
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
