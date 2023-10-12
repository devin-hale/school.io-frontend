'use client';
import {
	Dialog,
	DialogContent,
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
import { SetStateAction, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store/store';
import { Dispatch } from 'react';
import { useAppDispatch } from '@/app/hooks';
import {
	resetCreateClass,
} from '@/redux/slices/classes/modifyClass';
import { getOrgStudents } from '@/redux/slices/students/studentsSlice';
import {
	ICreateStudentReq,
	IModifyStudentsState,
	createStudent,
	resetCreateStudent,
} from '@/redux/slices/students/modifyStudentsSlice';

export interface ICreateClassModalProps {
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
}

export default function CreateStudentModal(
	props: ICreateClassModalProps
): JSX.Element {
	const dispatch: Dispatch<any> = useAppDispatch();
	const user = useSelector((state: RootState) => state.user);
	const modifyStudent: IModifyStudentsState = useSelector(
		(state: RootState) => state.studentsModify
	);

	//First Name Field
	const [firstNameField, setFirstNameField] = useState<string>('');
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
	const [lastNameField, setLastNameField] = useState('');
	const [lastNameError, setLastNameError] = useState(false);
	const [lastNameEText, setLastNameEText] = useState('');

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

	const [gradeLevel, setGradeLevel] = useState('');
	const [gradeLevelError, setGradeLevelError] = useState(false);
	const [gradeLevelEText, setGradeLevelEText] = useState('');

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
	const [isGifted, setIsGifted] = useState(false);
	const [isRetained, setIsRetained] = useState(false);
	const [isSpEd, setIsSpEd] = useState(false);
	const [isELL, setIsELL] = useState(false);

	function handleSave(): void {
		let payload: ICreateStudentReq = {
			token: user.token!,
			body: {
				first_name: firstNameField,
				last_name: lastNameField,
				grade_level: gradeLevel,
				gifted: isGifted,
				retained: isRetained,
				sped: isSpEd,
				english_language_learner: isELL,
				org: user.userInfo.org!,
			},
		};
		dispatch(createStudent(payload));
	}

	function handleClose(): void {
		setFirstNameField('');
		setFirstNameError(false);
		setFirstNameEText('');
		setLastNameField('');
		setLastNameError(false);
		setLastNameEText('');
		setGradeLevel('');
		setGradeLevelError(false);
		setGradeLevelEText('');
		setIsGifted(false);
		setIsELL(false);
		setIsRetained(false);
		setIsSpEd(false);
		dispatch(getOrgStudents({ token: user.token!, orgId: user.userInfo.org! }));
		props.setOpen(false);
		dispatch(resetCreateStudent())
	}

	const handleDlgClose = (event: object, reason: string) => {
		if (reason && reason == 'backdropClick') {
			return;
		}
		handleClose();
	};

	return (
		<>
			{props.open ? (
				<Dialog
					open={props.open}
					onClose={handleDlgClose}
					className='flex flex-nowrap justify-center'
					disableEscapeKeyDown
				>
					{modifyStudent.create.loading ? (
						<div>
							<CircularProgress color='primary' />
						</div>
					) : (
						<>
							{modifyStudent.create.complete ? (
								<>
									<DialogTitle>{`${modifyStudent.create.message}`}</DialogTitle>
									<Button
										onClick={handleClose}
										color='success'
										variant='contained'
										className='w-fit bg-green-400 self-center m-1'
									>
										Close
									</Button>
								</>
							) : (
								<>
									<DialogTitle>Create New Student:</DialogTitle>
									<DialogContent>
										Please enter details for new student.
									</DialogContent>
									<Box
										component='form'
										className='flex flex-col items-center w-40 sm:w-[750px] self-center'
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
															onChange={() => setIsGifted(!isGifted)}
														/>
													}
													label='Gifted'
												/>
												<FormControlLabel
													control={
														<Checkbox
															checked={isRetained}
															onChange={() => setIsRetained(!isRetained)}
														/>
													}
													label='Retained'
												/>
												<FormControlLabel
													control={
														<Checkbox
															checked={isSpEd}
															onChange={() => setIsSpEd(!isSpEd)}
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
												Create Student
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
