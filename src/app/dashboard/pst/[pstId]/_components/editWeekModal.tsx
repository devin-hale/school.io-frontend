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
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
dayjs.extend(weekday);
import { Dispatch, SetStateAction } from 'react';
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


	const handleClose = () => {
		props.setOpen(false);
	};

	const handleDlgClose = (event: object, reason: string) => {
		if (reason && reason == 'backdropClick') {
			return;
		}
		handleClose();
	};

	return (
		<Dialog
			open={props.open}
			onClose={handleDlgClose}
			className='flex flex-nowrap justify-center p-1'
			disableEscapeKeyDown
		>
			<DialogTitle>Edit Week {props.weekInfo.weekNo}</DialogTitle>
			<DialogContent>Words</DialogContent>
			<div className='m-2 w-60 sm:w-[300px] flex flex-row flex-wrap justify-center'>
				<DatePicker
					label='Week Start'
					defaultValue={weekDates.data1}
					onChange={(newValue) => setWeekDates({...weekDates, data1: newValue!})}
				/>

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
		</Dialog>
	);
}
