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
import { SetStateAction, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store/store';
import { Dispatch } from 'react';
import { useAppDispatch } from '@/app/hooks';
import { resetCreateClass } from '@/redux/slices/classes/modifyClass';
import { getOrgStudents } from '@/redux/slices/students/studentsSlice';
import {
	ICreateStudentReq,
	IModifyStudentsState,
	createStudent,
	resetCreateStudent,
} from '@/redux/slices/students/modifyStudentsSlice';
import {
	ICreateUserCall,
	createUser,
	resetCreateUser,
} from '@/redux/slices/user/modifyUser';

export interface ICreateStudentModalProps {
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
}

export default function CreateUserModal(
	props: ICreateStudentModalProps
): JSX.Element {
	const dispatch: Dispatch<any> = useAppDispatch();
	const user = useSelector((state: RootState) => state.user);
	const modifyUser = useSelector((state: RootState) => state.userModify);

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

	const [gender, setGender] = useState('');
	const [genderError, setGenderError] = useState(false);
	const [gradeLevelEText, setGenderEText] = useState('');

	function handleGenderChange(e: SelectChangeEvent): void {
		if (e.target.value == '') {
			setGenderError(true);
			setGenderEText('A gender level must be selected');
			setGender(e.target.value);
		} else {
			setGenderError(false);
			setGenderEText('');
			setGender(e.target.value);
		}
	}

	//Password
	const [password, setPassword] = useState('');

	function handlePassChange(): void {
		setPassword(
			`${firstNameField === '' ? '' : `${firstNameField[0].toLowerCase()}`}${lastNameField === '' ? '' : `${lastNameField.toLowerCase()}`
			}${user.userInfo.userId!.slice(0, 4)}`
		);
	}

	const [email, setEmail] = useState('');
	const [emailError, setEmailError] = useState(false);
	const [emailEText, setEmailEText] = useState('');

	function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>): void {
		if (e.target.value.length === 0) {
			setEmail('');
			setEmailError(true);
			setEmailEText('Email field must not be empty.');
		} else if (
			!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(e.target.value)
		) {
			setEmail(e.target.value);
			setEmailError(true);
			setEmailEText('Must be a valid email.');
		} else {
			setEmail(e.target.value);
			setEmailError(false);
			setEmailEText('');
		}
	}

	useEffect(() => {
		if (user.userInfo.userId) {
			handlePassChange();
		}
	}, [handleFirstNameChange, handleLastNameChange]);

	function handleClose(): void {
		setFirstNameField('');
		setFirstNameError(false);
		setFirstNameEText('');
		setLastNameField('');
		setLastNameError(false);
		setLastNameEText('');
		setGender('');
		setGenderError(false);
		setGenderEText('');
		setPassword('');
		setEmail('');
		dispatch(getOrgStudents({ token: user.token!, orgId: user.userInfo.org! }));
		props.setOpen(false);
		dispatch(resetCreateUser());
	}

	function handleSave() {
		let payload: ICreateUserCall = {
			token: user.token!,
			body: {
				first_name: firstNameField,
				last_name: lastNameField,
				password: password,
				email: email,
				gender: gender,
				orgCode: user.userInfo.org!
			},
		};
		dispatch(createUser(payload));
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
					{modifyUser.createUser.loading ? (
						<div>
							<CircularProgress color='primary' />
						</div>
					) : (
						<>
							{modifyUser.createUser.complete ? (
								<>
									<DialogTitle>{`${modifyUser.createUser.message}`}</DialogTitle>
									<Button
										onClick={handleClose}
										color={
											modifyUser.createUser.statusCode === 201
												? 'success'
												: 'error'
										}
										variant='contained'
										className='w-fit bg-green-400 self-center m-1'
									>
										Close
									</Button>
								</>
							) : (
								<>
									<DialogTitle>Create New User:</DialogTitle>
									<DialogContent>
										Please enter details for new user.
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
										<TextField
											className='m-2 w-60 sm:w-60'
											variant='filled'
											label='Email'
											name='email'
											required
											error={emailError}
											value={email}
											onChange={handleEmailChange}
											helperText={emailEText}
										/>

										<FormControl
											variant='filled'
											className='m-2 w-36'
											error={genderError}
											required
										>
											<InputLabel id='createClassModalGradeLevel'>
												Gender
											</InputLabel>
											<Select
												labelId='createClassModalGradeLevel'
												value={gender}
												onChange={handleGenderChange}
												required
											>
												<MenuItem value={'M'}>M</MenuItem>
												<MenuItem value={'F'}>F</MenuItem>
											</Select>
										</FormControl>
										<div className='flex flex-col w-full justify-center items-center'>
											<TextField
												className='m-2 w-60 sm:w-60'
												variant='filled'
												label='Temporary Password'
												name='password'
												required
												disabled
												value={password}
											/>
											<p>
												Warning: this temporary password will not be shown
												again. <br /> Please write it down or take as
												screenshot.
											</p>
										</div>
										<div className='m-2 w-60 sm:w-[300px] flex flex-row flex-wrap justify-center'>
											<Button
												sx={{ width: 'fit-content', margin: 1, color: 'white' }}
												className='bg-green-400'
												color='primary'
												variant='contained'
												type='button'
												disabled={
													firstNameError ||
													lastNameError ||
													gender === '' ||
													emailError
												}
												onClick={handleSave}
											>
												Create User
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
