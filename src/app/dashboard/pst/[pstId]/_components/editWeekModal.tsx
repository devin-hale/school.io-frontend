'use client';
import {
	Dialog,
	DialogContent,
	Box,
	DialogTitle,
	Button,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	SelectChangeEvent,
	TextField,
	IconButton,
	Divider,
} from '@mui/material';
import { AddRounded, DeleteRounded } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
dayjs.extend(weekday);
import { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { useState, useEffect } from 'react';
import { useAppDispatch } from '@/app/hooks';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store/store';

interface IEditWeekModalProps {
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
	pstId: string;
	weekInfo: {
		weekNo: number;
		dates: string;
		attendance: {
			monday: string;
			tuesday: string;
			wednesday: string;
			thursday: string;
			friday: string;
		};
		tier1: {
			documentation: string[];
			standards: string[];
		};
		tier2: string[];
		parentComm: string[];
		progressMonitor: string[];
	};
}

export default function EditWeekModal(props: IEditWeekModalProps): JSX.Element {
	const dispatch = useAppDispatch();
	const user = useSelector((state: RootState) => state.user);
	const pstInstance = useSelector((state: RootState) => state.pst.pstInstance);
	const modifyPST = useSelector((state: RootState) => state.pstModify);

	const weekDatesSplit: string[] = props.weekInfo.dates.split(' to ');
	const [weekDates, setWeekDates] = useState({
		data1: dayjs(weekDatesSplit[0]),
		data2: dayjs(weekDatesSplit[1]),
	});

	const [attendance, setAttendance] = useState({
		days: {
			monday: props.weekInfo.attendance.monday,
			tuesday: props.weekInfo.attendance.tuesday,
			wednesday: props.weekInfo.attendance.wednesday,
			thursday: props.weekInfo.attendance.thursday,
			friday: props.weekInfo.attendance.friday,
		},
		error: false,
		errorText: '',
	});

	const [tier1Doc, setTier1Doc] = useState({
		data: {
			doc: props.weekInfo.tier1.documentation,
			standards: props.weekInfo.tier1.standards,
		},
		error: false,
		errorText: '',
	});

	const [tier2Doc, setTier2Doc] = useState({
		data: props.weekInfo.tier2,
		error: false,
		errorText: '',
	});

	const [parentComm, setParentComm] = useState<string[]>([
		...props.weekInfo.parentComm,
	]);

	const handleClose = () => {
		props.setOpen(false);
	};

	const handleDlgClose = (event: object, reason: string) => {
		if (reason && reason == 'backdropClick') {
			return;
		}
		handleClose();
	};

	function handleDocAdd() {
		setTier1Doc({
			...tier1Doc,
			data: {
				...tier1Doc.data,
				doc: [...tier1Doc.data.doc, ''],
			},
		});
	}

	function handleDocChange(
		e: React.ChangeEvent<HTMLInputElement>,
		index: number
	) {
		if (e.target.value.length === 0) {
			let tempArr: string[] = [...tier1Doc.data.doc];
			tempArr[index] = '';
			setTier1Doc({ ...tier1Doc, data: { ...tier1Doc.data, doc: tempArr } });
		} else if (e.target.value.length < 30) {
			let tempArr: string[] = [...tier1Doc.data.doc];
			tempArr[index] = e.target.value;
			setTier1Doc({ ...tier1Doc, data: { ...tier1Doc.data, doc: tempArr } });
		} else {
		}
	}

	function handleDocDelete(index: number) {
		let tempArr: string[] = [...tier1Doc.data.doc];
		tempArr.splice(index, 1);
		setTier1Doc({ ...tier1Doc, data: { ...tier1Doc.data, doc: tempArr } });
	}

	const docMap = tier1Doc.data.doc.map((doc: any, index: number) => (
		<div
			key={index}
			className='flex flex-row m-2'
		>
			<TextField
				type='text'
				value={doc}
				onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
					handleDocChange(e, index)
				}
			/>
			<IconButton onClick={() => handleDocDelete(index)}>
				<DeleteRounded color='error' />
			</IconButton>
		</div>
	));

	function handleStandardsAdd() {
		setTier1Doc({
			...tier1Doc,
			data: {
				...tier1Doc.data,
				standards: [...tier1Doc.data.standards, ''],
			},
		});
	}

	function handleStandardsChange(
		e: React.ChangeEvent<HTMLInputElement>,
		index: number
	) {
		if (e.target.value.length === 0) {
			let tempArr: string[] = [...tier1Doc.data.standards];
			tempArr[index] = '';
			setTier1Doc({
				...tier1Doc,
				data: { ...tier1Doc.data, standards: tempArr },
			});
		} else if (e.target.value.length < 10) {
			let tempArr: string[] = [...tier1Doc.data.standards];
			tempArr[index] = e.target.value;
			setTier1Doc({
				...tier1Doc,
				data: { ...tier1Doc.data, standards: tempArr },
			});
		} else {
		}
	}

	function handleStandardsDelete(index: number) {
		let tempArr: string[] = [...tier1Doc.data.standards];
		tempArr.splice(index, 1);
		setTier1Doc({
			...tier1Doc,
			data: { ...tier1Doc.data, standards: tempArr },
		});
	}

	const standardsMap = tier1Doc.data.standards.map(
		(standard: any, index: number) => (
			<div
				key={index}
				className='flex flex-row m-2'
			>
				<TextField
					type='text'
					className='w-[100px]'
					value={standard}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
						handleStandardsChange(e, index)
					}
				/>
				<IconButton onClick={() => handleStandardsDelete(index)}>
					<DeleteRounded color='error' />
				</IconButton>
			</div>
		)
	);

	function handleTier2Add() {
		setTier2Doc({
			...tier1Doc,
			data: [...tier2Doc.data, ''],
		});
	}

	function handleTier2Change(
		e: React.ChangeEvent<HTMLInputElement>,
		index: number
	) {
		if (e.target.value.length === 0) {
			let tempArr: string[] = [...tier2Doc.data];
			tempArr[index] = '';
			setTier2Doc({ ...tier2Doc, data: tempArr });
		} else if (e.target.value.length < 30) {
			let tempArr: string[] = [...tier2Doc.data];
			tempArr[index] = e.target.value;
			setTier2Doc({ ...tier2Doc, data: tempArr });
		} else {
		}
	}

	function handleTier2Delete(index: number) {
		let tempArr: string[] = [...tier2Doc.data];
		tempArr.splice(index, 1);
		setTier2Doc({ ...tier1Doc, data: tempArr });
	}

	const tier2DocMap = tier2Doc.data.map((doc: any, index: number) => (
		<div
			key={index}
			className='flex flex-row m-2'
		>
			<TextField
				type='text'
				value={doc}
				onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
					handleTier2Change(e, index)
				}
			/>
			<IconButton onClick={() => handleTier2Delete(index)}>
				<DeleteRounded color='error' />
			</IconButton>
		</div>
	));

	function handleParentCommAdd() {
		setParentComm([...parentComm, '']);
	}

	function handleParentCommChange(
		e: React.ChangeEvent<HTMLInputElement>,
		index: number
	) {
		if (e.target.value.length === 0) {
			let tempArr: string[] = [...parentComm];
			tempArr[index] = '';
			setParentComm(tempArr);
		} else if (e.target.value.length < 30) {
			let tempArr: string[] = [...parentComm];
			tempArr[index] = e.target.value;
			setParentComm(tempArr);
		} else {
		}
	}

	function handleParentCommDelete(index: number) {
		let tempArr: string[] = [...parentComm];
		tempArr.splice(index, 1);
		setParentComm(tempArr);
	}


	

	const parentCommMap = parentComm.map((doc: any, index: number) => (
		<div
			key={index}
			className='flex flex-row m-2'
		>
			<TextField
				type='text'
				value={doc}
				onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
					handleParentCommChange(e, index)
				}
			/>
			<IconButton onClick={() => handleParentCommDelete(index)}>
				<DeleteRounded color='error' />
			</IconButton>
		</div>
	));

	return (
		<Dialog
			open={props.open}
			onClose={handleDlgClose}
			disableEscapeKeyDown
			maxWidth={'lg'}
		>
			<DialogTitle>Edit Week {props.weekInfo.weekNo}</DialogTitle>
			<Divider className='w-[95%] self-center' />
			<div className='p-4 flex flex-col items-start'>
				<div className='flex flex-col items-start mb-2'>
					<strong className='underline mb-2 text-[20px]'>Dates:</strong>
					<div className='flex flex-row flex-wrap'>
						<DatePicker
							className='w-[145px] mr-[5px]'
							label='Week Start'
							defaultValue={weekDates.data1}
							onChange={(newValue) =>
								setWeekDates({ ...weekDates, data1: newValue! })
							}
						/>
						<DatePicker
							className='w-[145px]'
							label='Week End'
							defaultValue={weekDates.data2}
							onChange={(newValue) =>
								setWeekDates({ ...weekDates, data2: newValue! })
							}
						/>
					</div>
				</div>
				<div className='flex flex-col mb-2'>
					<strong className='underline self-start text-[20px]'>
						Attendance:
					</strong>
					<div className='flex flex-row'>
						{/*Monday*/}
						<FormControl
							variant='filled'
							className='m-2 w-[160px]'
							error={attendance.error}
							required
						>
							<InputLabel
								className='font-bold'
								id='createClassModalGradeLevel'
							>
								Monday
							</InputLabel>
							<Select
								labelId='createClassModalGradeLevel'
								value={attendance.days.monday}
								onChange={(e) =>
									setAttendance({
										...attendance,
										days: { ...attendance.days, monday: e.target.value },
									})
								}
								required
							>
								<MenuItem value={'N/A'}>N/A</MenuItem>
								<MenuItem value={'Met'}>Met</MenuItem>
								<MenuItem value={'Student Absent'}>Student Absent</MenuItem>
								<MenuItem value={'Teacher Absent'}>Teacher Absent</MenuItem>
								<MenuItem value={'Out of School'}>Out of School</MenuItem>
							</Select>
						</FormControl>
						{/*Tuesday*/}
						<FormControl
							variant='filled'
							className='m-2 w-[160px]'
							error={attendance.error}
							required
						>
							<InputLabel
								className='font-bold'
								id='createClassModalGradeLevel'
							>
								Tuesday
							</InputLabel>
							<Select
								labelId='createClassModalGradeLevel'
								value={attendance.days.tuesday}
								onChange={(e) =>
									setAttendance({
										...attendance,
										days: { ...attendance.days, tuesday: e.target.value },
									})
								}
								required
							>
								<MenuItem value={'N/A'}>N/A</MenuItem>
								<MenuItem value={'Met'}>Met</MenuItem>
								<MenuItem value={'Student Absent'}>Student Absent</MenuItem>
								<MenuItem value={'Teacher Absent'}>Teacher Absent</MenuItem>
								<MenuItem value={'Out of School'}>Out of School</MenuItem>
							</Select>
						</FormControl>
						{/*Wednesday*/}
						<FormControl
							variant='filled'
							className='m-2 w-[160px]'
							error={attendance.error}
							required
						>
							<InputLabel
								className='font-bold'
								id='createClassModalGradeLevel'
							>
								Wednesday
							</InputLabel>
							<Select
								labelId='createClassModalGradeLevel'
								value={attendance.days.wednesday}
								onChange={(e) =>
									setAttendance({
										...attendance,
										days: { ...attendance.days, wednesday: e.target.value },
									})
								}
								required
							>
								<MenuItem value={'N/A'}>N/A</MenuItem>
								<MenuItem value={'Met'}>Met</MenuItem>
								<MenuItem value={'Student Absent'}>Student Absent</MenuItem>
								<MenuItem value={'Teacher Absent'}>Teacher Absent</MenuItem>
								<MenuItem value={'Out of School'}>Out of School</MenuItem>
							</Select>
						</FormControl>
						{/*Thursday*/}
						<FormControl
							variant='filled'
							className='m-2 w-[160px]'
							error={attendance.error}
							required
						>
							<InputLabel
								className='font-bold'
								id='createClassModalGradeLevel'
							>
								Thursday
							</InputLabel>
							<Select
								labelId='createClassModalGradeLevel'
								value={attendance.days.thursday}
								onChange={(e) =>
									setAttendance({
										...attendance,
										days: { ...attendance.days, thursday: e.target.value },
									})
								}
								required
							>
								<MenuItem value={'N/A'}>N/A</MenuItem>
								<MenuItem value={'Met'}>Met</MenuItem>
								<MenuItem value={'Student Absent'}>Student Absent</MenuItem>
								<MenuItem value={'Teacher Absent'}>Teacher Absent</MenuItem>
								<MenuItem value={'Out of School'}>Out of School</MenuItem>
							</Select>
						</FormControl>
						{/*Friday*/}
						<FormControl
							variant='filled'
							className='m-2 w-[160px]'
							error={attendance.error}
							required
						>
							<InputLabel
								className='font-bold'
								id='createClassModalGradeLevel'
							>
								Friday
							</InputLabel>
							<Select
								labelId='createClassModalGradeLevel'
								value={attendance.days.friday}
								onChange={(e) =>
									setAttendance({
										...attendance,
										days: { ...attendance.days, friday: e.target.value },
									})
								}
								required
							>
								<MenuItem value={'N/A'}>N/A</MenuItem>
								<MenuItem value={'Met'}>Met</MenuItem>
								<MenuItem value={'Student Absent'}>Student Absent</MenuItem>
								<MenuItem value={'Teacher Absent'}>Teacher Absent</MenuItem>
								<MenuItem value={'Out of School'}>Out of School</MenuItem>
							</Select>
						</FormControl>
					</div>
				</div>
				<div>
					<div className='mb-1'>
						<strong className='underline text-[20px]'>
							Tier 1 Documentation:
						</strong>
						<IconButton
							className='ml-1'
							onClick={handleDocAdd}
						>
							<AddRounded color='primary' />
						</IconButton>
					</div>
					<div className='flex flex-row flex-wrap'>{docMap}</div>
				</div>
				<div>
					<div className='mb-1'>
						<strong className='underline'>Standards:</strong>
						<IconButton
							className='ml-1'
							onClick={handleStandardsAdd}
						>
							<AddRounded color='primary' />
						</IconButton>
					</div>
					<div className='flex flex-row flex-wrap'>{standardsMap}</div>
				</div>
				<div>
					<div className='mb-1'>
						<strong className='underline text-[20px]'>
							Tier 2 Documentation:
						</strong>
						<IconButton
							className='ml-1'
							onClick={handleTier2Add}
						>
							<AddRounded color='primary' />
						</IconButton>
					</div>
					<div className='flex flex-row flex-wrap'>{tier2DocMap}</div>
				</div>
				<div>
					<div className='mb-1'>
						<strong className='underline text-[20px]'>
							Parent Communication:
						</strong>
						<IconButton
							className='ml-1'
							onClick={handleParentCommAdd}
						>
							<AddRounded color='primary' />
						</IconButton>
					</div>
					<div className='flex flex-row flex-wrap'>{parentCommMap}</div>
				</div>


				<div className='self-end'>
					<Button
						sx={{ width: 'fit-content', margin: 1, color: 'white' }}
						className='bg-green-400'
						color='primary'
						variant='contained'
						type='button'
					>
						Save Changes
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
			</div>
		</Dialog>
	);
}
