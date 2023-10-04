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
} from '@mui/material';
import { SetStateAction, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store/store';
import { Dispatch } from 'react';
import { useAppDispatch } from '@/app/hooks';
import {
	ICreateClass,
	createClass,
	resetCreateClass,
} from '@/redux/slices/modifyClass';
import { getOrgClasses } from '@/redux/slices/classSlice';

export interface ICreateClassModalProps {
	createClassModalOpen: boolean;
	setCreateClassModalOpen: Dispatch<SetStateAction<boolean>>;
}

export default function CreateClassModal(
	props: ICreateClassModalProps
): JSX.Element {
	const dispatch: Dispatch<any> = useAppDispatch();
	const [gradeLevel, setGradeLevel] = useState('');
	const [gradeLevelError, setGradeLevelError] = useState(false);
	const [gradeLevelEText, setGradeLevelEText] = useState('');
	const [className, setClassName] = useState('');
	const [classNameError, setClassNameError] = useState(false);
	const [classNameEText, setClassNameEText] = useState('');
	const [subject, setSubject] = useState('');
	const [subjectError, setSubjectError] = useState(false);
	const [subjectErrorMessage, setSubjectErrorMessage] = useState('');
	const user = useSelector((state: RootState) => state.user);
	const modifyClassData = useSelector((state: RootState) => state.classModify);

	function handleClose(): void {
		setClassName('');
		setClassNameError(false);
		setClassNameEText('');
		setGradeLevel('');
		setGradeLevelError(false);
		setGradeLevelEText('');
		setSubject('');
		setSubjectError(false);
		setSubjectErrorMessage('');
		dispatch(getOrgClasses({ orgId: user.userInfo.org!, token: user.token! }));
		props.setCreateClassModalOpen(false);
		dispatch(resetCreateClass());
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

	function handleCreate(): void {
		let dispatchBody: ICreateClass = {
			token: user.token!,
			body: {
				name: className,
				grade_level: gradeLevel,
				subject: subject,
				teachers: [],
				org: user.userInfo.org!,
			},
		};

		dispatch(createClass(dispatchBody));
	}

	const handleDlgClose = (event: object, reason: string) => {
		if (reason && reason == 'backdropClick') {
			return;
		}
		handleClose();
	};

	return (
		<>
			{props.createClassModalOpen ? (
				<Dialog
					open={props.createClassModalOpen}
					onClose={handleDlgClose}
					className='flex flex-nowrap justify-center'
					disableEscapeKeyDown
				>
					{modifyClassData.create.loading ? (
						<div>
							<CircularProgress color='primary' />
						</div>
					) : (
						<>
							{modifyClassData.create.complete ? (
								<>
									<DialogTitle>{`${modifyClassData.create.message}`}</DialogTitle>
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
									<DialogTitle>Create New Class</DialogTitle>
									<DialogContent>
										Please enter details for new class.
									</DialogContent>
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
													gradeLevelError
												}
												onClick={handleCreate}
											>
												Create Class
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
