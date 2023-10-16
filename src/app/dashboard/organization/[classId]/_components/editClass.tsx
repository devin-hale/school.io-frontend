'use client';
import {
	Dialog,
	DialogTitle,
	DialogContent,
	TextField,
	Box,
	Select,
	MenuItem,
	SelectChangeEvent,
	FormControl,
	InputLabel,
	Button,
	CircularProgress,
	FormGroup,
	FormControlLabel,
	Checkbox,
} from '@mui/material';
import { SetStateAction, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store/store';
import { Dispatch } from 'react';
import { useAppDispatch } from '@/app/hooks';
import { getOrgStudents } from '@/redux/slices/students/studentsSlice';
import {
	IEditStudentReq,
	IModifyStudentsState,
	editStudentInfo,
	resetEditStudent,
} from '@/redux/slices/students/modifyStudentsSlice';
import {
	IEditClassInfo,
	IModifyClassState,
	editClassInfo,
	resetEditClass,
} from '@/redux/slices/classes/modifyClass';
import { getClassInfo } from '@/redux/slices/classes/classInstanceSlice';

export interface ICreateClassModalProps {
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
	classInfo: {
		classId: string;
		className: string;
		subject: string;
		gradeLevel: string;
	};
}

export default function EditClassModal(
	props: ICreateClassModalProps
): JSX.Element {
	const dispatch: Dispatch<any> = useAppDispatch();
	const user = useSelector((state: RootState) => state.user);
	const modifyStudent: IModifyStudentsState = useSelector(
		(state: RootState) => state.studentsModify
	);

	const [gradeLevel, setGradeLevel] = useState(props.classInfo.gradeLevel);
	const [gradeLevelError, setGradeLevelError] = useState(false);
	const [gradeLevelEText, setGradeLevelEText] = useState('');
	const [className, setClassName] = useState(props.classInfo.className);
	const [classNameError, setClassNameError] = useState(false);
	const [classNameEText, setClassNameEText] = useState('');
	const [subject, setSubject] = useState(props.classInfo.subject);
	const [subjectError, setSubjectError] = useState(false);
	const [subjectErrorMessage, setSubjectErrorMessage] = useState('');

	const modifyClassData: IModifyClassState = useSelector(
		(state: RootState) => state.classModify
	);

	function handleClose(): void {
		setClassName(props.classInfo.className);
		setClassNameError(false);
		setClassNameEText('');
		setGradeLevel(props.classInfo.gradeLevel);
		setGradeLevelError(false);
		setGradeLevelEText('');
		setSubject(props.classInfo.subject);
		setSubjectError(false);
		setSubjectErrorMessage('');
		dispatch(
			getClassInfo({ token: user.token!, classId: props.classInfo.classId })
		);
		props.setOpen(false);
		dispatch(resetEditClass());
	}

	function handleClassNameChange(e: React.ChangeEvent<HTMLInputElement>): void {
		if (e.target.value.length < 1) {
			setClassName(e.target.value);
			setClassNameEText('Name must be at least 1 character in length.');
			setClassNameError(true);
		} else if (e.target.value.length > 30) {
		} else {
			if (!/[A-Za-z0-9]/gm.test(e.target.value)) {
				setClassNameError(true);
				setClassNameEText('Name must include an alphanumeric character.');
				setClassName(e.target.value);
			} else {
				setClassNameEText('');
				setClassNameError(false);
				setClassName(e.target.value);
			}
		}
	}

	function handleClassSubjectChange(
		e: React.ChangeEvent<HTMLInputElement>
	): void {
		if (e.target.value.length < 1) {
			setSubject(e.target.value);
			setSubjectErrorMessage('Subject must be at least 1 character in length.');
			setSubjectError(true);
		} else if (e.target.value.length > 30) {
		} else {
			if (!/[A-Za-z0-9]/gm.test(e.target.value)) {
				setSubjectError(true);
				setSubjectErrorMessage(
					'Subject must include an alphanumeric character.'
				);
				setSubject(e.target.value);
			} else {
				setSubjectErrorMessage('');
				setSubjectError(false);
				setSubject(e.target.value);
			}
		}
	}

	function handleGradeLevelChange(e: SelectChangeEvent): void {
		if (e.target.value == '') {
			setGradeLevelError(true);
			setGradeLevelEText('A grade level must be selected');
			setGradeLevel(e.target.value);
		} else {
			setGradeLevelError(false);
			setGradeLevelEText('');
			setGradeLevel(e.target.value);
		}
	}

	const handleDlgClose = (event: object, reason: string) => {
		if (reason && reason == 'backdropClick') {
			return;
		}
		handleClose();
	};

	function handleCreate(): void {
		let dispatchBody: IEditClassInfo = {
			token: user.token!,
			params: {
				classId: props.classInfo.classId,
			},
			body: {
				name: className,
				grade_level: gradeLevel,
				subject: subject,
			},
		};

		dispatch(editClassInfo(dispatchBody));
		handleClose();
	}


	return (
		<>
			{props.open ? (
				<Dialog
					open={props.open}
					onClose={handleDlgClose}
					className='flex flex-nowrap justify-center p-1'
					disableEscapeKeyDown
				>
					{modifyStudent.editInfo.loading ? (
						<div>
							<CircularProgress
								className='w-[75px] h-[75px]'
								color='primary'
							/>
						</div>
					) : (
						<>
							<DialogTitle>Create New Class</DialogTitle>
							<DialogContent>Please enter details for new class.</DialogContent>
							<Box
								component='form'
								className='flex flex-col items-center w-40 sm:w-[500px] self-center'
							>
								<TextField
									className='m-2 w-60 sm:w-80'
									variant='filled'
									label='Name'
									name='name'
									required
									error={classNameError}
									value={className}
									onChange={handleClassNameChange}
									helperText={classNameEText}
								/>
								<TextField
									className='m-2 w-60 sm:w-80'
									variant='filled'
									label='Subject'
									name='subject'
									required
									error={subjectError}
									value={subject}
									onChange={handleClassSubjectChange}
									helperText={subjectErrorMessage}
								/>

								<FormControl
									variant='filled'
									className='m-2 w-60 sm:w-80'
									error={gradeLevelError}
									required
								>
									<InputLabel id='createClassModalGradeLevel'>
										Grade Level
									</InputLabel>
									<Select
										labelId='createClassModalGradeLevel'
										value={gradeLevel}
										onChange={handleGradeLevelChange}
										required
									>
										<MenuItem value={'Multi'}>Multi</MenuItem>
										<MenuItem value={'K'}>K</MenuItem>
										<MenuItem value={'1'}>1</MenuItem>
										<MenuItem value={'2'}>2</MenuItem>
										<MenuItem value={'3'}>3</MenuItem>
										<MenuItem value={'4'}>4</MenuItem>
										<MenuItem value={'5'}>5</MenuItem>
										<MenuItem value={'6'}>6</MenuItem>
										<MenuItem value={'7'}>7</MenuItem>
										<MenuItem value={'8'}>8</MenuItem>
										<MenuItem value={'9'}>9</MenuItem>
										<MenuItem value={'10'}>10</MenuItem>
										<MenuItem value={'11'}>11</MenuItem>
										<MenuItem value={'12'}>12</MenuItem>
									</Select>
								</FormControl>
								<div className='m-2 w-60 sm:w-[300px] flex flex-row flex-wrap justify-center'>
									<Button
										sx={{ width: 'fit-content', margin: 1 }}
										className='bg-green-400'
										color='primary'
										variant='contained'
										type='button'
										disabled={
											className.length === 0 ||
											classNameError ||
											subject.length === 0 ||
											subjectError ||
											gradeLevel == '' ||
											gradeLevelError ||
											(gradeLevel === props.classInfo.subject &&
												subject === props.classInfo.subject &&
												className === props.classInfo.className)
										}
										onClick={handleCreate}
									>
										Save
									</Button>
									<Button
										sx={{ width: 'fit-content', margin: 1 }}
										className='bg-red-400'
										color='error'
										variant='contained'
										type='button'
										onClick={handleClose}
									>
										Cancel
									</Button>
								</div>
							</Box>
						</>
					)}
				</Dialog>
			) : null}
		</>
	);
}
