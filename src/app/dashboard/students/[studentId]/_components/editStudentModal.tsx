'use client';
import {
	Dialog,
	DialogTitle,
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

export interface IEditStudentModalProps {
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
	studentInfo: {
		studentId: string;
		first_name: string;
		last_name: string;
		grade_level: string;
		gifted: boolean;
		retained: boolean;
		sped: boolean;
		english_language_learner: boolean;
	};
}

export default function EditStudentModal(
	props: IEditStudentModalProps
): JSX.Element {
	const dispatch: Dispatch<any> = useAppDispatch();
	const user = useSelector((state: RootState) => state.user);
	const modifyStudent: IModifyStudentsState = useSelector(
		(state: RootState) => state.studentsModify
	);

	//First Name Field
	const [firstNameField, setFirstNameField] = useState<string>(
		props.studentInfo.first_name
	);
	const [firstNameError, setFirstNameError] = useState<boolean>(false);
	const [firstNameEText, setFirstNameEText] = useState<string>('');

	function handleFirstNameChange(e: React.ChangeEvent<HTMLInputElement>) {
		if (e.target.value.length === 0) {
			setFirstNameField('');
			setFirstNameError(true);
			setFirstNameEText('First Name field must not be empty.');
		} else if (!/^[A-Za-z]+$/gm.test(e.target.value)) {
		} else if (e.target.value.length < 15) {
			setFirstNameField(e.target.value);
			setFirstNameError(false);
			setFirstNameEText('');
		} else {
		}
	}

	//Last Name Field
	const [lastNameField, setLastNameField] = useState<string>(
		props.studentInfo.last_name
	);
	const [lastNameError, setLastNameError] = useState<boolean>(false);
	const [lastNameEText, setLastNameEText] = useState<string>('');

	function handleLastNameChange(e: React.ChangeEvent<HTMLInputElement>) {
		if (e.target.value.length === 0) {
			setLastNameField('');
			setLastNameError(true);
			setLastNameEText('Last Name field must not be empty.');
		} else if (!/^[A-Za-z]+$/gm.test(e.target.value)) {
		} else if (e.target.value.length < 15) {
			setLastNameField(e.target.value);
			setLastNameError(false);
			setLastNameEText('');
		} else {
		}
	}

	//Grade Level
	const [gradeLevel, setGradeLevel] = useState<string>(
		props.studentInfo.grade_level
	);
	const [gradeLevelError, setGradeLevelError] = useState<boolean>(false);
	const [gradeLevelEText, setGradeLevelEText] = useState<string>('');

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

	//Checkboxes
	const [isGifted, setIsGifted] = useState<boolean>(props.studentInfo.gifted);
	const [isRetained, setIsRetained] = useState<boolean>(
		props.studentInfo.retained
	);
	const [isSpEd, setIsSpEd] = useState<boolean>(props.studentInfo.sped);
	const [isELL, setIsELL] = useState<boolean>(
		props.studentInfo.english_language_learner
	);

	function handleSave(): void {
		let payload: IEditStudentReq = {
			token: user.token!,
			params: {
				studentId: props.studentInfo.studentId,
			},
			body: {
				first_name: firstNameField,
				last_name: lastNameField,
				grade_level: gradeLevel,
				gifted: isGifted,
				retained: isRetained,
				sped: isSpEd,
				english_language_learner: isELL,
			},
		};
		dispatch(editStudentInfo(payload));
	}

	function handleClose(): void {
		setFirstNameField(props.studentInfo.first_name);
		setFirstNameError(false);
		setFirstNameEText('');
		setLastNameField(props.studentInfo.last_name);
		setLastNameError(false);
		setLastNameEText('');
		setGradeLevel(props.studentInfo.grade_level);
		setGradeLevelError(false);
		setGradeLevelEText('');
		setIsGifted(props.studentInfo.gifted);
		setIsELL(props.studentInfo.english_language_learner);
		setIsRetained(props.studentInfo.retained);
		setIsSpEd(props.studentInfo.sped);
		dispatch(getOrgStudents({ token: user.token!, orgId: user.userInfo.org! }));
		props.setOpen(false);
		dispatch(resetEditStudent());
	}

	const handleDlgClose = (event: object, reason: string) => {
		if (reason && reason == 'backdropClick') {
			return;
		}
		handleClose();
	};

	useEffect(() => {
		if (modifyStudent.editInfo.complete) {
			handleClose();
		}
	}, [modifyStudent.editInfo.complete]);

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
							{modifyStudent.editInfo.complete ? (
								<>
									<div>
										<CircularProgress
											className='w-[75px] h-[75px]'
											color='primary'
										/>
									</div>{' '}
								</>
							) : (
								<>
									<DialogTitle>Edit Student Info:</DialogTitle>
									<Box
										component='form'
										className='flex flex-col items-center self-center p-3'
									>
										<div className='flex flex-row w-full justify-center'>
											<TextField
												className='m-2 w-60 sm:w-60'
												variant='filled'
												label='First Name'
												name='first_name'
												required
												error={firstNameError}
												value={firstNameField}
												onChange={handleFirstNameChange}
												helperText={firstNameEText}
											/>
											<TextField
												className='m-2 w-60 sm:w-60'
												variant='filled'
												label='Last Name'
												name='last_name'
												required
												error={lastNameError}
												value={lastNameField}
												onChange={handleLastNameChange}
												helperText={lastNameEText}
											/>
										</div>

										<FormControl
											variant='filled'
											className='m-2 w-36'
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
										<div>
											<FormGroup className='flex flex-row flex-wrap'>
												<FormControlLabel
													control={
														<Checkbox
															checked={isGifted}
															onChange={() => setIsGifted((prev) => !prev)}
														/>
													}
													label='Gifted'
												/>
												<FormControlLabel
													control={
														<Checkbox
															checked={isRetained}
															onChange={() => setIsRetained((prev) => !prev)}
														/>
													}
													label='Retained'
												/>
												<FormControlLabel
													control={
														<Checkbox
															checked={isSpEd}
															onChange={() => setIsSpEd((prev) => !prev)}
														/>
													}
													label='SpEd'
												/>
												<FormControlLabel
													control={
														<Checkbox
															checked={isELL}
															onChange={() => setIsELL(!isELL)}
														/>
													}
													label='ELL'
												/>
											</FormGroup>
										</div>
										<div className='m-2 w-60 sm:w-[300px] flex flex-row flex-wrap justify-center'>
											<Button
												sx={{ width: 'fit-content', margin: 1, color: 'white' }}
												className='bg-green-400'
												color='primary'
												variant='contained'
												type='button'
												disabled={
													firstNameError || lastNameError || gradeLevel === ''
												}
												onClick={handleSave}
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
						</>
					)}
				</Dialog>
			) : null}
		</>
	);
}
