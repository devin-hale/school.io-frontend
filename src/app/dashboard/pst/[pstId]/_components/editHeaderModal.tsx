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
import {
	IEditStudentReq,
	IModifyStudentsState,
	editStudentInfo,
	resetEditStudent,
} from '@/redux/slices/students/modifyStudentsSlice';
import { editHeader } from '@/redux/slices/pst/modifyPSTSlice';

export interface IEditPSTHeaderProps {
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
	headerInfo: {
		pstId: string;
		schoolYear: string;
		gradingPeriod: string;
		studentName: string;
		interventionType: string;
		west_virginia_phonics: boolean;
		progress_monitoring_goal: string;
	};
}

export default function EditPSTHeaderModal(
	props: IEditPSTHeaderProps
): JSX.Element {
	const dispatch: Dispatch<any> = useAppDispatch();
	const user = useSelector((state: RootState) => state.user);
	const modifyStudent: IModifyStudentsState = useSelector(
		(state: RootState) => state.studentsModify
	);

	/*School Year*/
	const [schoolYearField, setSchoolYearField] = useState({
		schoolYear: props.headerInfo.schoolYear,
		error: false,
		errorText: '',
	});

	function handleSchoolYearChange(e: SelectChangeEvent) {
		if (e.target.value == '') {
			setSchoolYearField({
				schoolYear: '',
				error: true,
				errorText: 'A school year must be selected',
			});
		} else {
			setSchoolYearField({
				schoolYear: e.target.value,
				error: false,
				errorText: '',
			});
		}
	}

	/*Grading Period*/
	const [gradingPeriodField, setGradingPeriodField] = useState({
		gradingPeriod: props.headerInfo.gradingPeriod,
		error: false,
		errorText: '',
	});

	function handleGradingPeriodChange(e: SelectChangeEvent) {
		if (e.target.value == '') {
			setGradingPeriodField({
				gradingPeriod: '',
				error: true,
				errorText: 'A grading period must be selected',
			});
		} else {
			setGradingPeriodField({
				gradingPeriod: e.target.value,
				error: false,
				errorText: '',
			});
		}
	}
	console.log(gradingPeriodField);

	/*Intervention Type*/
	const [interventionType, setInterventionType] = useState({
		interventionType: props.headerInfo.interventionType,
		error: false,
		errorText: '',
	});

	function handleInterventionTypeChange(e: SelectChangeEvent) {
		if (e.target.value == '') {
			setInterventionType({
				interventionType: '',
				error: true,
				errorText: 'A grading period must be selected',
			});
		} else {
			setInterventionType({
				interventionType: e.target.value,
				error: false,
				errorText: '',
			});
		}
	}

	//Checkboxes
	const [wggState, setWGGState] = useState<boolean>(
		props.headerInfo.west_virginia_phonics
	);

	const [pMG, setPMG] = useState({
		pMG: props.headerInfo.progress_monitoring_goal,
		error: false,
		errorText: '',
	});

	function handleSave(): void {
		let payload = {
			token: user.token!,
			params: {
				pstId: props.headerInfo.pstId,
			},
			body: {
				gradingPeriod: gradingPeriodField.gradingPeriod,
				schoolYear: schoolYearField.schoolYear,
				intervention_type: interventionType.interventionType,
				west_virginia_phonics: wggState,
				progress_monitoring_goal: pMG.pMG,
			},
		};
		dispatch(editHeader(payload));
		handleClose();
	}

	function handleClose(): void {
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
					<DialogTitle>Edit Student Info:</DialogTitle>
					<Box
						component='form'
						className='flex flex-col items-center self-center p-3'
					>
						<div className='flex flex-row w-full justify-center'>
							<FormControl
								variant='filled'
								className='m-2 w-[150px]'
								error={schoolYearField.error}
								required
							>
								<InputLabel id='createClassModalGradeLevel'>
									School Year
								</InputLabel>
								<Select
									labelId='createClassModalGradeLevel'
									value={schoolYearField.schoolYear}
									onChange={handleSchoolYearChange}
									required
								>
									<MenuItem value={'2022 - 2023'}>2022 - 2023</MenuItem>
									<MenuItem value={'2023 - 2024'}>2023 - 2024</MenuItem>
									<MenuItem value={'2024 - 2025'}>2024 - 2025</MenuItem>
								</Select>
							</FormControl>
							<FormControl
								variant='filled'
								className='m-2 w-[200px]'
								error={gradingPeriodField.error}
								required
							>
								<InputLabel id='createClassModalGradeLevel'>
									Grading Period
								</InputLabel>
								<Select
									labelId='createClassModalGradingPeriod'
									value={gradingPeriodField.gradingPeriod}
									onChange={handleGradingPeriodChange}
									required
								>
									<MenuItem value={'1st Nine Weeks'}>1st Nine Weeks</MenuItem>
									<MenuItem value={'2nd Nine Weeks'}>2nd Nine Weeks</MenuItem>
									<MenuItem value={'3rd Nine Weeks'}>3rd Nine Weeks</MenuItem>
									<MenuItem value={'4th Nine Weeks'}>4th Nine Weeks</MenuItem>
								</Select>
							</FormControl>
							<FormControl
								variant='filled'
								className='m-2 w-36'
								error={schoolYearField.error}
								required
							>
								<InputLabel id='createClassModalGradeLevel'>
									Intervention Type
								</InputLabel>
								<Select
									labelId='createClassModalGradeLevel'
									value={interventionType.interventionType}
									onChange={handleInterventionTypeChange}
									required
								>
									<MenuItem value={'Reading'}>Reading</MenuItem>
									<MenuItem value={'Math'}>Math</MenuItem>
									<MenuItem value={'Behavior'}>Behavior</MenuItem>
								</Select>
							</FormControl>
						</div>

						<div>
							<FormGroup className='flex flex-row flex-wrap'>
								<FormControlLabel
									control={
										<Checkbox
											checked={wggState}
											onChange={() => setWGGState((prev) => !prev)}
										/>
									}
									label='West Virginia Phonics'
								/>
							</FormGroup>
							{/* <TextField value={} type='' />
							 */}
						</div>
						<div className='m-2 w-60 sm:w-[300px] flex flex-row flex-wrap justify-center'>
							<Button
								sx={{ width: 'fit-content', margin: 1, color: 'white' }}
								className='bg-green-400'
								color='primary'
								variant='contained'
								type='button'
								onClick={handleSave}
								disabled={
									schoolYearField.error ||
									gradingPeriodField.error ||
									interventionType.error
								}
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
				</Dialog>
			) : null}
		</>
	);
}
