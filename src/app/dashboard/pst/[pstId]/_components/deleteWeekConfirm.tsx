'use client';
import { Dialog, Alert, DialogTitle, Button } from '@mui/material';
import { SetStateAction } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store/store';
import { Dispatch } from 'react';
import { useAppDispatch } from '@/app/hooks';
import { deleteWeek } from '@/redux/slices/pst/modifyPSTSlice';

export interface IDeleteWeekModalProps {
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
	weekNo: string;
	pstId: string;
}

export default function DeleteWeekModal(
	props: IDeleteWeekModalProps
): JSX.Element {
	const dispatch: Dispatch<any> = useAppDispatch();
	const user = useSelector((state: RootState) => state.user);

	function handleClose(): void {
		props.setOpen(false);
	}

	const handleDlgClose = (event: object, reason: string) => {
		if (reason && reason == 'backdropClick') {
			return;
		}
		handleClose();
	};

	const handleDelete = () => {
		let dispatchBody = {
			token: user.token!,
			params: {
				pstId: props.pstId,
				weekNo: props.weekNo,
			},
		};
		dispatch(deleteWeek(dispatchBody));
		handleClose()
	};

	return (
		<>
			<Dialog
				open={props.open}
				onClose={handleDlgClose}
				className='flex flex-nowrap justify-center'
				disableEscapeKeyDown
			>
				<div className='p-3 flex flex-col items-center'>
					<Alert
						severity='warning'
						variant='filled'
						color='error'
					>
						This action can not be undone.
					</Alert>
					<DialogTitle>Delete Week {props.weekNo}?</DialogTitle>
					<div className='w-full flex flex-wrap justify-evenly'>
						<Button
							onClick={handleDelete}
							color='warning'
							variant='contained'
							className='w-fit bg-red-400 self-center m-1'
						>
							Delete
						</Button>

						<Button
							onClick={handleClose}
							color='info'
							variant='contained'
							className='w-fit bg-blue-400 text-white self-center m-1'
						>
							Cancel
						</Button>
					</div>
				</div>
			</Dialog>
		</>
	);
}
