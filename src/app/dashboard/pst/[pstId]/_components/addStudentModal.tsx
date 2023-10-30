'use client';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useAppDispatch } from '@/app/hooks';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store/store';
import { getOrgStudents } from '@/redux/slices/students/studentsSlice';
import {
	Autocomplete,
	Dialog,
	DialogTitle,
	DialogContent,
	TextField,
	Button,
} from '@mui/material';
import {
	addStudent,
	resetAddStudentToPST,
} from '@/redux/slices/pst/modifyPSTSlice';

interface IStudentOpt {
	_id: string;
	sped: boolean;
	retained: boolean;
	org: string;
	last_name: string;
	grade_level: string;
	gifted: boolean;
	first_name: string;
	english_language_learner: string;
	classes: string[];
}

interface IAddStudentToPSTModal {
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
	pstId: string;
}

export default function AddStudentToPSTModal(
	props: IAddStudentToPSTModal
): JSX.Element {
	const dispatch: Dispatch<any> = useAppDispatch();
	const router = useRouter();
	const user = useSelector((state: RootState) => state.user);
	const orgStudents = useSelector(
		(state: RootState) => state.students.orgStudents.students
	);

	const [selectedStudent, setSelectedStudent] = useState<studentOption | null>(
		null
	);

	useEffect(() => {
		dispatch(getOrgStudents({ token: user.token!, orgId: user.userInfo.org! }));
	}, []);

	function handleClose(): void {
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
		let dispatchBody = {
			token: user.token!,
			params: {
				pstId: props.pstId,
			},
			body: {
				studentId: selectedStudent!.studentId,
			},
		};
		dispatch(addStudent(dispatchBody));
		handleClose();
	};

	interface studentOption {
		label: string;
		studentId: string;
	}

	let studentOptions: studentOption[] = [...orgStudents].map((orgStudent) => ({
		label: `${orgStudent.first_name} ${orgStudent.last_name}`,
		studentId: orgStudent._id,
	}));

	return (
		<>
			<Dialog
				open={props.open}
				onClose={handleDlgClose}
				className='flex flex-nowrap justify-center'
				disableEscapeKeyDown
			>
				<DialogContent>
					<DialogTitle>Add/Change Student:</DialogTitle>
					<Autocomplete
						id='classes-search'
						options={studentOptions}
						onChange={(e, value) => setSelectedStudent(value)}
						renderOption={(props, option) => {
							return (
								<li
									{...props}
									key={option.studentId}
								>
									{option.label}
								</li>
							);
						}}
						renderInput={(params) => (
							<TextField
								{...params}
								label='Search Students...'
							/>
						)}
						isOptionEqualToValue={(option, value) =>
							option.studentId === value.studentId
						}
					/>
					<div className='m-2 mt-4 flex justify-center'>
						<Button
							variant='contained'
							color='success'
							className='bg-green-400 text-white mr-4'
							disabled={!selectedStudent ? true : false}
							onClick={handleSave}
						>
							Save
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
